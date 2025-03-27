import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: genre as string,
  year: Number,
  description: String,
  image: String,
});

export default mongoose.model('Book', bookSchema);