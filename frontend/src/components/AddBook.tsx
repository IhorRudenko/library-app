import React, { useState } from "react";
import { Book } from "../App";
import "../css/AddBook.css";


type AddBookProps = {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
};

const AddBook: React.FC<AddBookProps> = ({ books, setBooks }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBook: Book = {
      id: Date.now(),
      title,
      author,
      year: Number(year),
      description,
      image,
    };

    fetch("http://localhost:3001/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks([...books, data]);
        setTitle("");
        setAuthor("");
        setYear("");
        setDescription("");
        setImage("");
      });
  };

  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");







  return (
    <div className="add-book__block" onSubmit={handleSubmit}>

      <h3 className="add-book__title h3-title">Ein Buch zur Bibliothek hinzufügen</h3>

      <form className="add-book__form">

        <input className="add-book__input add-book__input--name input"
          type="text"
          placeholder="Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input className="add-book__input add-book__input--author input"
          type="text"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <input className="add-book__input add-book__input--year input"
          type="number"
          placeholder="Jahr"
          value={year}
          onChange={(e) => {
            const value = e.target.value;
            // Забороняємо мінуси
            if (!value.includes("-")) {
              setYear(value === "" ? "" : Number(value));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") {
              e.preventDefault(); // Блокуємо ввод "-" і "e"
            }
          }}
          required
          min={0}
        />       

        <button className="add-book__btn btn btn-accent" type="submit">Speichern</button>

        <textarea className="add-book__textarea input" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschreibung (optional)"
        />

        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Bild-URL oder Pfad"
          required
        />
      </form>

    </div>
  );
};

export default AddBook;
