import React, { useState, useEffect } from "react";
import Tabs from "./components/Tabs";
import AddBook from "./components/AddBook";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import ReadingList from "./components/ReadingList";
import ViewToggle from "./components/ViewToggle";
import { Book } from "./types/types";

import './media-style/App.scss';

type BookWithStatus = Book & {
  read: boolean;
};

const App: React.FC = () => {

  const apiUrl = process.env.REACT_APP_API_URL;

  const [books, setBooks] = useState<Book[]>([]);

  const [readingList, setReadingList] = useState<BookWithStatus[]>(() => {
    const saved = localStorage.getItem("readingList");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("readingList", JSON.stringify(readingList));
  }, [readingList]);

 

  const fetchBooks = async () => {
    const response = await fetch(`${apiUrl}/books`);
    if (!response.ok) {
      const text = await response.text(); // ← подивитися, що повернулося
      throw new Error(`❌ Статус ${response.status}: ${text}`);
    }

const data = await response.json();
  
    const booksWithId = data.map((book: any) => ({
      ...book,
      id: book._id,
    }));
  
    setBooks(booksWithId);
    console.log("📚 Книги з id:", booksWithId);

    console.log("📚 JSON з API:", data);
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps

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

  // const [image, setImage] = useState("");

  const [readingListViewMode, setReadingListViewMode] = useState<"grid" | "list">("list");

  const handleDeleteBook = async (id: number) => {
    try {
      // Видалення з сервера (json-server)
      const handleDeleteBook = async (id: number) => {
        try {
          await fetch(`${apiUrl}/books/${id}`, {
            method: "DELETE",
          });
      
          setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
          setReadingList((prevList) => prevList.filter((book) => book.id !== id));
      
          localStorage.setItem(
            "readingList",
            JSON.stringify(readingList.filter((book) => book.id !== id))
          );
        } catch (error) {
          console.error("❌ Помилка при видаленні книги:", error);
        }
      };
      
      

  
      // Оновлення списку книг
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  
      // Оновлення списку для читання
      setReadingList((prevList) => prevList.filter((book) => book.id !== id));
  
      // Оновлення localStorage
      localStorage.setItem(
        "readingList",
        JSON.stringify(readingList.filter((book) => book.id !== id))
      );
    } catch (error) {
      console.error("❌ Помилка під час видалення книги:", error);
    }
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log("Scrolled:", scrolled);
  }, [scrolled]);
  
  const [isExpanded, setIsExpanded] = useState(false);


  console.log("📦 API URL:", apiUrl);

  // ----------------------------------------------------------------------------------

  return (
    <div className="App">
        <header className={`header ${scrolled ? "scrolled" : ""}`}>
          <div className="container header__container">
            <div className="header__inner">

              <div className="logo__box">
                <img className="logo" src="/images/logo.png" alt="Logo"/>

                <h1 className="app__title logo__title">Bibliothek</h1>
              </div>

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

          <h1 className="visually-hidden">Bibliothek</h1>

          <div className="list-head list-head--top">
            <div className="list-head__inner">
              <h2 className="visually-hidden">Neues Buch hinzufügen</h2>
                
              {activeTab === "all" && (
                <button
                  className={`add-book__toggle btn-accent ${isExpanded ? "collapsed" : "expanded"}`}
                  onClick={() => setIsExpanded(prev => !prev)}
                >
                  Neues Buch hinzufügen
                </button>
              )}
            </div>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
    
          {/* Умовне відображення вкладок */}
          {activeTab === "all" && (
            
            <>
              <div className="main">
                <div className={`add-book__form-container ${isExpanded ? "collapsed" : "expanded"}`}>

                  <AddBook books={books} setBooks={setBooks} />

                </div>

                <h3 className="search-book__title h3-title">Suche aus der Bücherliste</h3>

                <SearchBar
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  setSearchTerm={setSearchTerm}
                />

                <div className="list-head list-head--middle">
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
                  onDeleteBook={handleDeleteBook}
                />
              </div>
            </>
          )}

          {/* -- ReadingList ---------------------------------------------- */}
    
          {activeTab === "readingList" && (
            <ReadingList
              readingList={readingList}
              toggleReadStatus={toggleReadStatus}
              removeFromReadingList={removeFromReadingList}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}
        </div>
      </div>
      
      
    </div>
  );
  
};

export default App;
