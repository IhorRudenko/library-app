import React, { useState } from "react";
import { Book } from "../types/types";
import "../css/BookList.css";


interface BookListProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  addToReadingList: (book: Book) => void;
  searchTerm: string;
  viewMode: "list" | "grid";
  readingList: Book[];
  onDeleteBook: (id: number) => void;
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

  const groupedBooks: Record<string, Book[]> = {};
filteredBooks.forEach((book) => {
  const genres = Array.isArray(book.genre)
    ? book.genre
    : book.genre.split(",").map((g) => g.trim());

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

  const [showDescriptionId, setShowDescriptionId] = useState<number | null>(null);

  const isFavorite = (bookId: number): boolean => {
    return readingList.some((book) => book.id === bookId);
  };

  const handleDelete = (bookId: number) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

  const sortedGenreEntries = Object.entries(groupedBooks).sort(
    ([, booksA], [, booksB]) => booksB.length - booksA.length
  );


  
  // -----------------------------------------------------


  return (
    <div className={`book-list ${viewMode}`}>
      {sortedGenreEntries.map(([genre, booksInGenre]) => (
        <div key={genre} className="genre-group">
          <h2 className="genre-title">{genre}</h2>

         <ul className={`list__body ${viewMode === "grid" ? "card-view" : "list-view"}`}>
           
            <p className={`list__negativ ${filteredBooks.length === 0 ? "active" : ""}`}>
              keine Ergebnisse gefunden
            </p>

            <img className="list__deco-img" src="/images/book-deco.png" alt="Deco" />

            {booksInGenre.map((book) => (          
                          
              <li 
                className={`list__item ${showDescriptionId === book.id ? "active" : ""} ${isFavorite(book.id) ? "favorite-added" : ""}`}
                  key={book.id}
                  onClick={() =>
                    setShowDescriptionId((prev) => (prev === book.id ? null : book.id))
                  }
                >
                
                <div className="list__item-inner">
                  {book.title} - {book.author} ({book.year})
                </div>

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
                        e.stopPropagation(); // щоб не відкривався опис
                        addToReadingList(book);
                      }}
                    >
                    <img className="list__item-star" src="/images/star.png" alt="Star" />
                    {isFavorite(book.id) ? "hinzugefügt" : "zu Favoriten"}
                  </button>

                  <button
                    className={`list__item-btn list__item-delete ${isFavorite(book.id) ? "favorite-added" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBook(book.id);
                    }}
                    >
                    <img className="list__item-garbage" src="/images/delete.png" alt="Garbage" />
                    löschen
                  </button>
                </div>

                {showDescriptionId === book.id && (
                  <p className={`book-description ${showDescriptionId === book.id ? "active" : ""}`}>
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
