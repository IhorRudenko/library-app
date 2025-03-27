import React, { useState } from "react";
import { Book } from "../types/types";
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
        saveBook(""); 
      };
  
      reader.readAsDataURL(imageFile); 
    } else {
      saveBook(""); 
    }
  };

  const [genre, setGenre] = useState<string | string[]>("");

  
  const saveBook = (imageData: string) => {
    const newBook: Book = {
      id: Date.now(),
      title,
      author,
      year: Number(year),
      description,
      image: imageData,
      genre, 
    };

     
    fetch(`${apiUrl}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to add book");
      }
      return res.json();
    })
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



  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001/api";



  // -----------------------------------------------------------------





  return (

    <div className="add-book__block" onSubmit={handleSubmit}>

      <h3 className="add-book__title h3-title">Ein Buch zur Bibliothek hinzufügen</h3>

      <form className="add-book__form">

        <input className="add-book__input add-book__input--name input"
          type="text"
          placeholder="Name*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input className="add-book__input add-book__input--author input"
          type="text"
          placeholder="Autor*"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <input className="add-book__input add-book__input--year input"
          type="number"
          placeholder="Jahr*"
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

        <select className="add-book__select input" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Wähle ein Genre</option>
          <option value="Dystopian">Dystopian</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Literary Fiction">Literary Fiction</option>
          <option value="Romance">Romance</option>
          <option value="Classic Literature">Classic Literature</option>
          <option value="Adventure">Adventure</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Political Satire">Political Satire</option>
          <option value="Historical Fiction">Historical Fiction</option>
          <option value="Psychological Thriller">Psychological Thriller</option>
          <option value="Magical Realism">Magical Realism</option>
        </select>

        <button className="add-book__btn btn btn-accent" type="submit">Speichern</button>
        
      </form>

    </div>
  );
};

export default AddBook;
