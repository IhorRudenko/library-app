import React from "react";
import ViewToggle from "./ViewToggle";
import "../css/ReadingList.css";


  type BookWithStatus = {
    id: number;
    title: string;
    author: string;
    year: number;
    read: boolean;
  };

  type ReadingListProps = {
    readingList: BookWithStatus[];
    toggleReadStatus: (id: number) => void;
    removeFromReadingList: (id: number) => void;
    viewMode: 'list' | 'grid';
    setViewMode: React.Dispatch<React.SetStateAction<"grid" | "list">>;
  };

  const ReadingList: React.FC<ReadingListProps> = ({
    readingList,
    toggleReadStatus,
    removeFromReadingList,
    viewMode,
    setViewMode
  }) => {

  // --------------------------------------------------------------

  return (
    <div>
      <div className="list__head">
        <h2 className="list__title">Meine Leseliste</h2>

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

      </div>

      <ul className={`list__body ${viewMode === "grid" ? "card-view" : "list-view"}`}>
        {readingList.map(book => (
          <li className="list__item" key={book.id}>
            <div className="list__item-inner">
              <span style={{ textDecoration: book.read ? "line-through" : "none" }}>
                {book.title} — {book.author} ({book.year})
              </span>
            </div>

            <div className="list__item-controls">
              <button onClick={() => toggleReadStatus(book.id)}>
                {book.read ? "📘 Прочитано" : "📖 Ще не читано"}
              </button>
              
              <button onClick={() => removeFromReadingList(book.id)}>🗑 Видалити</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadingList;
