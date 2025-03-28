import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGODB_URI || "mongodb+srv://Ihor:oc2vi73f3@cluster0.tkykq8y.mongodb.net/library?retryWrites=true&w=majority&appName=Cluster0";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  description: String,
  image: String,
  genre: String,
});

const Book = mongoose.model("Book", bookSchema);

async function importBooks() {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Підключено до MongoDB");

    const filePath = path.join(__dirname, "../books.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const books = JSON.parse(rawData);

    if (!Array.isArray(books)) {
      throw new Error("📛 books.json має бути масивом");
    }

    await Book.insertMany(books);
    console.log(`📚 Імпортовано ${books.length} книг`);
  } catch (error) {
    console.error("❌ Помилка імпорту:", error);
  } finally {
    mongoose.disconnect();
  }
}

importBooks();
