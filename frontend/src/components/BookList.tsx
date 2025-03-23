import React from "react";
import "../css/BookList.css";

type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  description?: string;
};

type BookListProps = {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  addToReadingList: (book: Book) => void;
  searchTerm: string;
  viewMode: "list" | "grid";
};

const BookList: React.FC<BookListProps> = ({ 
  books, 
  setBooks, 
  addToReadingList, 
  searchTerm,
  viewMode, 
}) => {
  const handleDelete = (id: number) => {
    fetch(`http://localhost:3001/books/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      });
  };

  
  const filteredBooks = books.filter((book) => {
    const trimmedTerm = searchTerm.trim().toLowerCase();
    return (
      book.title.toLowerCase().includes(trimmedTerm) ||
      book.author.toLowerCase().includes(trimmedTerm)
    );
  });


  const [openBookId, setOpenBookId] = React.useState<number | null>(null);
  const toggleDescription = (id: number) => {
    setOpenBookId(prevId => (prevId === id ? null : id));
  };

  const [showDescriptionId, setShowDescriptionId] = React.useState<number | null>(null);


  return (
    <div className="list">
      <ul className={`list__body ${viewMode === "grid" ? "card-view" : "list-view"}`}>
  
  <p className={`list__negativ ${filteredBooks.length === 0 ? "active" : ""}`}>
    keine Ergebnisse gefunden
  </p>

  <img className="list__deco-img" src="/images/book-deco.png" alt="Deco" />

  {filteredBooks.map((book) => (
   <li
      className={`list__item ${showDescriptionId === book.id ? "active" : ""}`}
      key={book.id}
      onClick={() =>
        setShowDescriptionId((prev) => (prev === book.id ? null : book.id))
      }
    >
      
      
      <div className="list__item-poster">
        <img className="list__item-img" src="/images/books/1.jpg" alt="Img" />
      </div>

      <div className="list__item-inner">
        {book.title} - {book.author} ({book.year})
      </div>

      <div className="list__item-controls">
        <button className="list__item-btn list__item-favorit" onClick={() => addToReadingList(book)}>
          <img className="list__item-star" src="/images/star.png" alt="Star" />
          zu Favoriten
        </button>

        <button className="list__item-btn list__item-delete" onClick={(e) => {
          e.stopPropagation();
          handleDelete(book.id);
        }}>
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
  );
};

export default BookList;
