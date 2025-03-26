import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  year: Number,
  description: String,
  genre: String,
  image: String,
  read: { type: Boolean, default: false },
});

export default mongoose.model('Book', bookSchema);
