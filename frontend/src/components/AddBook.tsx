import React, { useState } from "react";

type AddBookProps = {
  onBookAdded: () => void;
};

const AddBook: React.FC<AddBookProps> = ({ onBookAdded }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState<number | "">(""); // ✅ Початкове значення - порожнє

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (year === "") {
      alert("❌ Будь ласка, введіть рік!");
      return;
    }
  
    const validYear = Math.max(0, Number(year)); // ✅ Перетворюємо `year` у число перед перевіркою
  
    fetch("http://localhost:3001/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        author,
        year: validYear, // ✅ Тепер це гарантовано число
      }),
    })
      .then((res) => res.json())
      .then(() => {
        // alert("✅ Книга додана!");
        setTitle("");
        setAuthor("");
        setYear(""); // ✅ Очищаємо поле
        onBookAdded();
      });
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>➕ Додати книгу</h2>

      <input
        type="text"
        placeholder="Назва книги"
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
        placeholder="Рік видання"
        value={year}
        onChange={(e) => {
          let inputYear = e.target.value;
          if (inputYear.includes("-")) inputYear = inputYear.replace("-", "");

          const numericYear = inputYear === "" ? "" : Math.max(0, parseInt(inputYear, 10) || 0);
          setYear(numericYear);
        }}
        onKeyDown={(e) => {
          if (e.key === "-" || e.key === "e") {
            e.preventDefault(); // 🔹 Блокуємо введення `-` та `e` (щоб уникнути експоненційного запису)
          }
        }}
        required
      />


      <button type="submit">Додати книгу</button>
    </form>
  );
};

export default AddBook;
