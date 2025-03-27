import React, { useState, useEffect } from 'react';
import { Book } from "../types/types";
import "../css/BookList.css";


interface BookListProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  addToReadingList: (book: Book) => void;
  searchTerm: string;
  viewMode: "list" | "grid";
  readingList: Book[];
  onDeleteBook: (id: string) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  setBooks,
  addToReadingList,
  searchTerm,
  viewMode,
  readingList,
  onDeleteBook
}) => {
const [openBookId, setOpenBookId] = React.useState<number | null>(null);

const handleToggleDescription = (bookId: number) => {
  setOpenBookId(prevId => (prevId === bookId ? null : bookId));
};

const filteredBooks = books.filter((book) => {

  const term = searchTerm.toLowerCase().trim();
  
  return (
    book.title.toLowerCase().includes(term) ||
    book.author.toLowerCase().includes(term)
  );
});

// const groupedBooks: { [genre: string]: Book[] } = {};




const groupedBooks: Record<string, Book[]> = {}; // 🔥

filteredBooks.forEach((book) => {
  const genre = book.genre || "Інше";
  if (!groupedBooks[genre]) {
    groupedBooks[genre] = [];
  }
  groupedBooks[genre].push(book);
});

const sortedGenreEntries = Object.entries(groupedBooks).sort(
  ([a], [b]) => a.localeCompare(b)
);




filteredBooks.forEach((book) => {
  const genres = Array.isArray(book.genre)
  ? book.genre
  : typeof book.genre === "string"
    ? book.genre.split(",").map((g) => g.trim())
    : [];

  genres.forEach((genre) => {
    if (!groupedBooks[genre]) {
      groupedBooks[genre] = [];
    }
    groupedBooks[genre].push(book);
  });
});


// === 2. Отримуємо жанри у порядку популярності ===
const sortedGenres = Object.entries(groupedBooks)
  .sort(([, booksA], [, booksB]) => booksB.length - booksA.length) // Сортуємо за довжиною масивів
  .map(([genre]) => genre); // Беремо тільки назви жанрів

  const [showDescriptionId, setShowDescriptionId] = useState<string | null>(null);

  const isFavorite = (bookId: string): boolean => {
    return readingList.some((book) => book.id === bookId);
  };

  const handleDelete = (bookId: string) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

//   const sortedGenreEntries = Object.entries(groupedBooks).sort(
//     ([, booksA], [, booksB]) => booksB.length - booksA.length
//   );




  useEffect(() => {
    fetch("http://localhost:3001/api/books")
      .then(res => res.json())
      .then(data => {
        setBooks(data);
      })
      .catch(error => console.error("Помилка отримання книг:", error));
  }, []);
  

  console.log("📚 filteredBooks:", filteredBooks);
console.log("📚 sortedGenreEntries:", sortedGenreEntries);
  // -----------------------------------------------------
  return (
    <div className={`book-list ${viewMode}`}>
      {sortedGenreEntries.map(([genre, booksInGenre]) => (
        <div key={genre} className="genre-group">
          <h2 className="genre-title">{genre}</h2>
  
          <ul className={`list__body ${viewMode === "grid" ? "card-view" : "list-view"}`}>
            {booksInGenre.length === 0 && (
              <p className="list__negativ active">keine Ergebnisse gefunden</p>
            )}
  
            <img className="list__deco-img" src="/images/book-deco.png" alt="Deco" />
  
            {booksInGenre.map((book) => (
              <li
                key={book.id}
                className={`list__item ${showDescriptionId === book.id ? "active" : ""} ${isFavorite(book.id) ? "favorite-added" : ""}`}
                onClick={() =>
                  setShowDescriptionId((prev) => (prev === book.id ? null : book.id))
                }
              >
                <div className="list__item-inner">
                  {book.title} - {book.author} ({book.year})
                </div>
  
                <p>{book.author}</p>
  
                <div className="list__item-poster">
                  <img
                    className="list__item-img"
                    src={book.image || "/images/books/placeholder.png"}
                    onError={(e) => {
                      e.currentTarget.src = "/images/books/placeholder.png";
                    }}
                    alt={book.title}
                  />
                </div>
  
                <div className="list__item-controls">
                  <button
                    className={`list__item-btn list__item-favorit ${isFavorite(book.id) ? "favorite-added" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToReadingList(book);
                    }}
                  >
                    <img className="list__item-star" src="/images/star.png" alt="Star" />
                    <span>{isFavorite(book.id) ? "hinzugefügt" : "zu Favoriten"}</span>
                  </button>
  
                  <button
                    className={`list__item-btn list__item-delete ${isFavorite(book.id) ? "favorite-added" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBook(book.id);
                    }}
                  >
                    <img className="list__item-garbage" src="/images/delete.png" alt="Garbage" />
                    <span>löschen</span>
                  </button>
                </div>
  
                {showDescriptionId === book.id && (
                  <p className={`book-description active`}>
                    {book.description || "Keine Beschreibung verfügbar."}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
  

};

export default BookList;
