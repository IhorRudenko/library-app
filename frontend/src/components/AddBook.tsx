import React, { useState } from "react";
import { Book } from "../App";

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
        // onBookAdded(); ← видалено
      });
  };

  return (
    <form onSubmit={handleSubmit}>

      <h3>➕ Додати книгу</h3>

      <input
        type="text"
        placeholder="Назва"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Автор"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Рік"
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

      <button type="submit">💾 Зберегти</button>

    </form>
  );
};

export default AddBook;
