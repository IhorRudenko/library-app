import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(express.json({ limit: "15mb" }));
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

const booksFile = "books.json"; // Файл для збереження книг

// 📌 Функція для завантаження книг з файлу (якщо файл є)
const loadBooks = (): any[] => {
  try {
    if (!fs.existsSync(booksFile)) {
      fs.writeFileSync(booksFile, "[]", "utf-8"); // ✅ Створюємо файл, якщо його немає
    }
    const data = fs.readFileSync(booksFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Помилка читання books.json:", error);
    return [];
  }
};

// 📌 Функція для запису книг у файл
const saveBooks = (books: any[]) => {
  try {
    fs.writeFileSync(booksFile, JSON.stringify(books, null, 2), "utf-8"); // ✅ Записуємо у файл
  } catch (error) {
    console.error("❌ Помилка запису у books.json:", error);
  }
};

let books = loadBooks(); // ✅ Завантажуємо книги при старті сервера

// 📌 Отримати всі книги
app.get("/books", (req, res) => {
  books = loadBooks(); // ✅ Оновлюємо книги перед відправкою
  res.json(books);
});

// 📌 Додати нову книгу
app.post("/books", (req, res) => {
  books = loadBooks(); // ✅ Оновлюємо список перед додаванням
  const newBook = { id: Date.now(), ...req.body };
  books.push(newBook);
  saveBooks(books); // ✅ Записуємо у файл
  res.status(201).json(newBook);
});

// 📌 Видалити книгу за ID
app.delete("/books/:id", (req, res) => {
  books = loadBooks(); // ✅ Оновлюємо список перед видаленням
  const bookId = parseInt(req.params.id);
  books = books.filter((book) => book.id !== bookId);
  saveBooks(books); // ✅ Записуємо оновлений список у файл
  res.json({ message: "✅ Книга видалена" });
});

// 📌 Запуск сервера
app.listen(3001, () => {
  console.log("✅ Сервер працює на http://localhost:3001");
});
