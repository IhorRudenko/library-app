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
  
  // -- theme ---------------------------------------------------------------------------

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // -- //theme -------------------------------------------------------------------------------




  

  return (
    <div className="App">
      <header className="header">
          <div className="container">
            <div className="header__inner">
              <img className="logo" src="/images/logo.png" alt="Logo"/>

              <button className="theme__btn" onClick={toggleTheme}>
                <img
                  src={theme === "light" ? "/images/icon-dark.png" : "/images/icon-light.png"}
                  alt="theme icon"
                  className="theme__icon"
                />
              </button>
            </div>
          </div>
      </header>
      
      <div className="wrapper">
        <div className="container">
          <h1 className="app__title">Bibliothek</h1>
          
            <div className="tabs" style={{ marginBottom: "20px" }}>
              <button className="tabs__btn tabs__btn--left"
                onClick={() => setActiveTab("all")}
                style={{
                  backgroundColor: activeTab === "all" ? "rgb(97, 190, 20)" : "#d2d2d2",
                  color: activeTab === "all" ? "#fff" : "#000",
                }}
              >
                📚 Gesamte Liste 
              </button>
    
              <button className="tabs__btn tabs__btn--right"
                onClick={() => setActiveTab("readingList")}
                style={{
                  backgroundColor: activeTab === "readingList" ? "rgb(97, 190, 20)" : "#d2d2d2",
                  color: activeTab === "all" ? "#000" : "#fff",
                }}
              >
                📖 Favoriten zum Lesen
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
      </div>
      
      
    </div>
  );
  
};

export default App;
