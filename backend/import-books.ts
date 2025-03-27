// backend/import-books.ts
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Book from "./models/Book";

dotenv.config();

const jsonPath = path.join(__dirname, "books.json");
const rawData = fs.readFileSync(jsonPath, "utf-8");
const books = JSON.parse(rawData);


console.log("MONGO_URI = ", process.env.MONGO_URI);

async function importData() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ MongoDB connected");

    await Book.deleteMany({});
    await Book.insertMany(books);
    await mongoose.connect(process.env.MONGO_URI!);

    console.log("📚 Books imported successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Import failed:", err);
    process.exit(1);
  }
}

importData();
