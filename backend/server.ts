import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
// app.use(cors());
app.options("*", cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// 🔌 Підключення до MongoDB Atlas
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://Ihor:oc2vi73f3@cluster0.tkykq8y.mongodb.net/library?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Підключено до MongoDB"))
  .catch((err) => console.error("❌ Помилка MongoDB:", err));

// 📘 Модель книги
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  description: String,
  image: String,
  genre: String,
});

const Book = mongoose.model("Book", bookSchema);

// 📌 Отримати всі книги
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання книг" });
  }
});

// 📌 Додати нову книгу
app.post("/api/books", async (req, res) => {
  try {
    console.log("📥 Дані з форми:", req.body); // Додай сюди

    const newBook = new Book(req.body);
    const saved = await newBook.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Помилка при додаванні:", err); // І лог помилки
    res.status(500).json({ error: "Помилка при додаванні книги" });
  }
});

// 📌 Видалити книгу за ID
app.delete("/api/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Книга видалена" });
  } catch (err) {
    res.status(500).json({ error: "Помилка при видаленні" });
  }
});

// 📌 Запуск сервера
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Сервер працює на порті ${PORT}`);
});
