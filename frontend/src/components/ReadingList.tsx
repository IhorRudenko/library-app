import React, { useState } from "react";
import ViewToggle from "./ViewToggle";
import "../css/ReadingList.css";
import { BookWithStatus } from "../types/types";


  type ReadingListProps = {
    readingList: BookWithStatus[];
    toggleReadStatus: (id: number) => void;
    removeFromReadingList: (id: number) => void;
    viewMode: 'list' | 'grid';
    setViewMode: (mode: "list" | "grid") => void;
  };

  const ReadingList: React.FC<ReadingListProps> = ({
    readingList,
    toggleReadStatus,
    removeFromReadingList,
    viewMode,
    setViewMode
  }) => {

  const [showDescriptionId, setShowDescriptionId] = useState<number | null>(null);


  // --------------------------------------------------------------

  return (
    <div>
      <div className="list-head">
        <h2 className="list__title">Meine Leseliste</h2>

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>   

      {readingList.length === 0 ? (
        <p className="empty-message">Noch nichts zur Leseliste hinzugefügt.</p>
      ) : (

      <ul className={`list__body ${viewMode === "grid" ? "card-view" : "list-view"}`}>
        {readingList.map((book) => (
          
          <li
            key={book.id}
            className={`list__item ${showDescriptionId === book.id ? "active" : ""}`}
            onClick={() => setShowDescriptionId(book.id === showDescriptionId ? null : book.id)}
          >
            <div className={`list__item-inner ${book.read ? "read" : ""}`}>
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
                onClick={(e) => {
                  e.stopPropagation(); 
                  toggleReadStatus(book.id);
                }}
                className={`list__item-btn ${book.read ? "read" : ""}`}
              >
                  
                {book.read ? "gelesen" : "ungelesen"}
              </button>

              <button className="list__item-btn list__item-delete" 
                onClick={() => removeFromReadingList(book.id)}>
                  <img className="list__item-garbage" src="/images/delete.png" alt="Garbage" />

                  <span>löschen</span>
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
    )}
    </div>
  );
};

export default ReadingList;
