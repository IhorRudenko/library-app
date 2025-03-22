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
  searchTerm: string;
};

const BookList: React.FC<BookListProps> = ({ books, setBooks, addToReadingList, searchTerm }) => {
  const handleDelete = (id: number) => {
    fetch(`http://localhost:3001/books/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      });
  };

  // 👉 Фільтрація
  const filteredBooks = books.filter((book) => {
    const trimmedTerm = searchTerm.trim().toLowerCase();
    return (
      book.title.toLowerCase().includes(trimmedTerm) ||
      book.author.toLowerCase().includes(trimmedTerm)
    );
  });

  return (
    <div>
      <ul className="list__body">
        <img className="list__deco-img" src="/images/book-deco.png" alt="Deco" />

        {filteredBooks.map((book) => (
          <li className="list__item" key={book.id}>
            
            <div className="list__item-inner">
              {book.title} - {book.author} ({book.year})
            </div>

            <div className="list__item-controls">
              <button onClick={() => handleDelete(book.id)}>❌ Видалити</button>
              <button onClick={() => addToReadingList(book)}>📖 До списку читання</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
