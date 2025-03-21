import React from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
};

type BookListProps = {
  books: Book[]; // Список книг
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>; // Функція для оновлення списку
};

const BookList: React.FC<BookListProps> = ({ books, setBooks }) => {
  const handleDelete = (id: number) => {
    fetch(`http://localhost:3001/books/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setBooks(books.filter((book) => book.id !== id)); // Оновлюємо список книг
      });
  };

  return (
    <div>
      <h2>📚 Список книг</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.author} ({book.year})
            <button onClick={() => handleDelete(book.id)}>❌ Видалити</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
