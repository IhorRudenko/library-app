import React, { useState, useEffect } from "react";
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";
import ReadingList from "./components/ReadingList";

export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
};

type BookWithStatus = Book & {
  read: boolean;
};

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const [readingList, setReadingList] = useState<BookWithStatus[]>(() => {
    const saved = localStorage.getItem("readingList");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("readingList", JSON.stringify(readingList));
  }, [readingList]);

  const fetchBooks = () => {
    fetch("http://localhost:3001/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Помилка завантаження:", error));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addToReadingList = (book: Book) => {
    if (!readingList.some(b => b.id === book.id)) {
      setReadingList([...readingList, { ...book, read: false }]);
    }
  };
  
  const toggleReadStatus = (id: number) => {
    setReadingList(readingList.map(book =>
      book.id === id ? { ...book, read: !book.read } : book
    ));
  };
  
  const removeFromReadingList = (id: number) => {
    setReadingList(readingList.filter(book => book.id !== id));
  };

  const [activeTab, setActiveTab] = useState<"all" | "readingList">("all");
  

  return (
    <div className="App">
      <h1>📚 Бібліотека</h1>
  
      {/* Вкладки */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "all" ? "#ddd" : "#f5f5f5",
            border: "1px solid #ccc",
            marginRight: "10px",
            cursor: "pointer"
          }}
        >
          📚 Бібліотека
        </button>

        <button
          onClick={() => setActiveTab("readingList")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "readingList" ? "#ddd" : "#f5f5f5",
            border: "1px solid #ccc",
            cursor: "pointer"
          }}
        >
          📖 Список для читання
        </button>
      </div>
  
      {/* Умовне відображення вкладок */}
      {activeTab === "all" && (
        <>
          <AddBook books={books} setBooks={setBooks} />
          <BookList
            books={books}
            setBooks={setBooks}
            addToReadingList={addToReadingList}
          />
        </>
      )}
  
      {activeTab === "readingList" && (
        <ReadingList
          readingList={readingList}
          toggleReadStatus={toggleReadStatus}
          removeFromReadingList={removeFromReadingList}
        />
      )}
    </div>
  );
  
};

export default App;
