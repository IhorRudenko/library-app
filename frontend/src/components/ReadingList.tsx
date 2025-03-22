import React from "react";

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
};

const ReadingList: React.FC<ReadingListProps> = ({
  readingList,
  toggleReadStatus,
  removeFromReadingList
}) => {
  return (
    <div>
      <h2>📚 Мій список для читання</h2>
      <ul>
        {readingList.map(book => (
          <li className="book-item" key={book.id}>
            <span style={{ textDecoration: book.read ? "line-through" : "none" }}>
              {book.title} — {book.author} ({book.year})
            </span>

            <button onClick={() => toggleReadStatus(book.id)}>
              {book.read ? "📘 Прочитано" : "📖 Ще не читано"}
            </button>
            
            <button onClick={() => removeFromReadingList(book.id)}>🗑 Видалити</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadingList;
