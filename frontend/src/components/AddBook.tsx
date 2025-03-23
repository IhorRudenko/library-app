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
  
    if (imageFile) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        console.log("📸 Base64 готовий:", base64Image.slice(0, 50)); // обрізано для консолі
  
        saveBook(base64Image);
      };
  
      reader.onerror = (err) => {
        console.error("❌ Помилка при зчитуванні зображення:", err);
        saveBook(""); // fallback
      };
  
      reader.readAsDataURL(imageFile); // ⬅️ запускаємо
    } else {
      saveBook(""); // без зображення
    }
  };
  
  const saveBook = (imageData: string) => {
    const newBook: Book = {
      id: Date.now(),
      title,
      author,
      year: Number(year),
      description,
      image: imageData,
    };
  
    fetch("http://localhost:3001/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks([...books, data]);
        setTitle("");
        setAuthor("");
        setYear("");
        setDescription("");
        setImageFile(null);
        console.log("✅ Книга додана:", data);
      })
      .catch((err) => {
        console.error("❌ Помилка при додаванні:", err);
      });
  };
  
  

  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);


  // -----------------------------------------------------------------





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

        <label
          htmlFor="imageUpload"
          className={`image-upload-label btn ${imageFile ? "uploaded" : ""}`}
        >
          {imageFile ? "Bild hochgeladen" : "Bild hochladen"}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            style={{ display: "none" }}
          />
        </label>
    

        {/* <button className="add-book__btn btn btn-accent" type="submit">Speichern</button> */}

        <textarea className="add-book__textarea input" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschreibung (optional)"
        />

        <button className="add-book__btn btn btn-accent" type="submit">Speichern</button>


        {/* <label htmlFor="imageUpload" className="image-upload-label btn">
          Bild hochladen
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            style={{ display: "none" }}
          />
        </label> */}
        
      </form>

    </div>
  );
};

export default AddBook;
