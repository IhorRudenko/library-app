import React from "react";
import "../css/BookList.css";

type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
};

type BookListProps = {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  addToReadingList: (book: Book) => void;
};


const BookList: React.FC<BookListProps> = ({ books, setBooks, addToReadingList }) => {
  const handleDelete = (id: number) => {
    fetch(`http://localhost:3001/books/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setBooks(books.filter((book) => book.id !== id)); // Оновлюємо список книг
      });
  };

  const [searchInput, setSearchInput] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <div>

      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="🔍 Пошук за назвою або автором"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: "8px", width: "60%", marginRight: "8px" }}
        />
        <button
          onClick={() => setSearchTerm(searchInput)}
          style={{ padding: "8px 16px" }}
        >
          Пошук
        </button>
        
        <button
          onClick={() => {
            setSearchInput("");
            setSearchTerm("");
          }}
          style={{ padding: "8px 16px", marginLeft: "8px", backgroundColor: "#eee" }}
        >
          Скинути
        </button>
      </div>

      <h2>📚 Список книг</h2>

      <ul>
        {books
          .filter((book) => {
            const trimmedTerm = searchTerm.trim().toLowerCase();
            return (
              book.title.toLowerCase().includes(trimmedTerm) ||
              book.author.toLowerCase().includes(trimmedTerm)
            );
          })

          .map((book) => (
            <li className="book-item" key={book.id}>
              {book.title} - {book.author} ({book.year})
              <button onClick={() => handleDelete(book.id)}>❌ Видалити</button>
              <button onClick={() => addToReadingList(book)}>📖 До списку читання</button>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
