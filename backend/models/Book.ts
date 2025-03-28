import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  description: String,
  image: String,
  genre: String,
});

export const Book = mongoose.model("Book", bookSchema);
