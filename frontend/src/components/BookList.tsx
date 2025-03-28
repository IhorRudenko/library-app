import React, { useState } from "react";
import { Book } from "../types/types";
import "../css/BookList.css";

interface BookListProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  searchTerm: string;
  viewMode: "list" | "grid";
  readingList: Book[];
  onDeleteBook: (id: string) => void;
  toggleInReadingList: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  setBooks,
  toggleInReadingList,
  searchTerm,
  viewMode,
  readingList,
  onDeleteBook,
}) => {
  const [showDescriptionId, setShowDescriptionId] = useState<string | null>(null);

  const isFavorite = (bookId: string): boolean => {
    return readingList.some((book) => String(book._id || book.id) === bookId);
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
    const genres = book.genre
      ? Array.isArray(book.genre)
        ? book.genre
        : book.genre.split(",").map((g) => g.trim())
      : [];

    genres.forEach((genre) => {
      if (!groupedBooks[genre]) {
        groupedBooks[genre] = [];
      }
      groupedBooks[genre].push(book);
    });
  });

  const sortedGenreEntries = Object.entries(groupedBooks).sort(
    ([, a], [, b]) => b.length - a.length
  );

  return (
    <div className={`book-list ${viewMode}`}>
      {sortedGenreEntries.map(([genre, booksInGenre]) => (
        <div key={genre} className="genre-group">
          <h2 className="genre-title">{genre}</h2>

          <ul className={`list__body ${viewMode === "grid" ? "card-view" : "list-view"}`}>
            {filteredBooks.length === 0 && (
              <p className="list__negativ active">keine Ergebnisse gefunden</p>
            )}

            <img className="list__deco-img" src="/images/book-deco.png" alt="Deco" />

            {booksInGenre.map((book) => {
              const bookId = String(book._id || book.id);
              
              if (!bookId) return null;

              return (
                <li
                  key={bookId}
                  className={`list__item ${
                    showDescriptionId === bookId ? "active" : ""
                  } ${isFavorite(bookId) ? "favorite-added" : ""}`}
                  onClick={() =>
                    setShowDescriptionId((prev) => (prev === bookId ? null : bookId))
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
                      className={`list__item-btn list__item-favorit ${
                        isFavorite(bookId) ? "favorite-added" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInReadingList(book);
                      }}
                    >
                      <img className="list__item-star" src="/images/star.png" alt="Star" />
                      <span>{isFavorite(bookId) ? "hinzugefügt" : "zu Favoriten"}</span>
                    </button>

                    <button
                      className={`list__item-btn list__item-delete ${
                        isFavorite(bookId) ? "favorite-added" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBook(bookId);
                      }}
                    >
                      <img className="list__item-garbage" src="/images/delete.png" alt="Garbage" />
                      <span>löschen</span>
                    </button>
                  </div>

                  {showDescriptionId === bookId && (
                    <p className="book-description active">
                      {book.description || "Keine Beschreibung verfügbar."}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BookList;
