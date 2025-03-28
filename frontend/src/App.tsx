import React, { useState, useEffect } from "react";
import Tabs from "./components/Tabs";
import AddBook from "./components/AddBook";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import ReadingList from "./components/ReadingList";
import ViewToggle from "./components/ViewToggle";
import { Book } from "./types/types";
import './media-style/App.scss';



const API = "https://my-library-backend-swb1.onrender.com/api";

type BookWithStatus = Book & {
  read: boolean;
};

const App: React.FC = () => {
  
  const deleteBook = async (id: string) => {
    const res = await fetch(`${API}/books/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("❌ Не вдалося видалити книгу");
    }
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  const [books, setBooks] = useState<Book[]>([]);

  const [readingList, setReadingList] = useState<BookWithStatus[]>(() => {
    const storedList = localStorage.getItem("readingList");
    if (!storedList) return [];
    try {
      return JSON.parse(storedList);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const stored = localStorage.getItem("readingList");
    if (stored) {
      const parsed: Partial<BookWithStatus>[] = JSON.parse(stored);
      setReadingList(parsed.map((book: any) => ({ ...book, read: book.read ?? false })) as BookWithStatus[]);
    }
  }, []);

 

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
      const isAlreadyAdded = prevList.some((b) => b.id === book._id || book.id);
      if (isAlreadyAdded) {
        return prevList.filter((b) => b.id !== book._id || book.id);
      } else {
        return [...prevList, { ...book, read: false }]; // додаємо з read
      }
    });
  };
  
  
  const toggleReadStatus = (id: number) => {
    setReadingList(readingList.map(book =>
      book._id || book.id === id ? { ...book, read: !book.read } : book
    ));
  };
  
  const removeFromReadingList = (id: number) => {
    setReadingList(readingList.filter(book => book._id || book.id !== id));
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

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id);
  
      // Оновлення списку книг
      setBooks((prevBooks) =>
        prevBooks.filter((book) => (book._id || String(book.id)) !== id)
      );
  
      // Оновлення списку для читання
      setReadingList((prevList) =>
        prevList.filter((book) => (book._id || String(book.id)) !== id)
      );
  
      // Оновлення localStorage
      localStorage.setItem(
        "readingList",
        JSON.stringify(
          readingList.filter((book) => (book._id || String(book.id)) !== id)
        )
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

  const toggleInReadingList = (book: Book) => {
    const bookId = book._id || book.id;
    const exists = readingList.some((item) => item._id === bookId || item.id === bookId);
  
    let updatedList: BookWithStatus[];
  
    if (exists) {
      updatedList = readingList.filter((item) => item._id !== bookId && item.id !== bookId);
    } else {
      updatedList = [...readingList, { ...book, read: false }];
    }
  
    setReadingList(updatedList);
    localStorage.setItem("readingList", JSON.stringify(updatedList));
  };







   

  console.log("📦 API URL:", apiUrl);

  console.log("🧪 Поточний localStorage:", localStorage.getItem("readingList"));


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
                  toggleInReadingList={toggleInReadingList} // ✅ правильна пропса
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
