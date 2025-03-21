import React, { useState, useEffect } from "react";
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";

type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
};

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = () => {
    fetch("http://localhost:3001/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Помилка завантаження:", error));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>📚 Бібліотека</h1>
      <AddBook onBookAdded={fetchBooks} />
      <BookList books={books} setBooks={setBooks} /> {/* Передаємо `setBooks` */}
    </div>
  );
};

export default App;
