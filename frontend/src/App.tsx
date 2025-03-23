import React, { useState, useEffect } from "react";
import Tabs from "./components/Tabs";
import AddBook from "./components/AddBook";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import ReadingList from "./components/ReadingList";
import ViewToggle from "./components/ViewToggle";


export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  description?: string;
  image?: string;
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

  const toggleReadingList = (book: Book) => {
    setReadingList((prevList) => {
      const isAlreadyAdded = prevList.some((b) => b.id === book.id);
      if (isAlreadyAdded) {
        return prevList.filter((b) => b.id !== book.id);
      } else {
        return [...prevList, { ...book, read: false }]; // додаємо з read
      }
    });
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

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  

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

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [image, setImage] = useState("");



  

  return (
    <div className="App">
      <header className="header">
          <div className="container">
            <div className="header__inner">
              <img className="logo" src="/images/logo.png" alt="Logo"/>

              <button
                className={`theme__btn ${theme === "dark" ? "active" : ""}`}
                onClick={toggleTheme}
              >
                  <i className="indicator">
                    <img
                      src={theme === "light" ? "/images/moon.png" : "/images/sun.png"}
                      alt="theme icon"
                      className="theme__icon"
                    />
                  </i>
              </button>
            </div>
          </div>
      </header>
      
      <div className="wrapper">
        <div className="container">

          <h1 className="app__title">Bibliothek</h1>
          
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
    
          {/* Умовне відображення вкладок */}
          {activeTab === "all" && (
            <>
              <div className="main">

                <AddBook books={books} setBooks={setBooks} />
            
                <h3 className="search-book__title h3-title">Suche aus der Bücherliste</h3>

                <SearchBar
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  setSearchTerm={setSearchTerm}
                />

                <div className="list__head">
                  <h2 className="list__title">Bücherliste</h2>

                  <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

                </div>

                <BookList
                  books={books}
                  setBooks={setBooks}
                  addToReadingList={toggleReadingList}
                  searchTerm={searchTerm}
                  viewMode={viewMode}
                  readingList={readingList}
                />
              </div>
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
