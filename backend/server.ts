import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Підключення до бази даних
mongoose.connect(process.env.MONGO_URI || '')

  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Отримати всі книги
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Додати нову книгу
app.post('/books', async (req, res) => {
  const newBook = new Book(req.body);
  const savedBook = await newBook.save();
  res.status(201).json(savedBook);
});

app.put('/books/:id', (async (req: Request, res: Response) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Книгу не знайдено' });
    }

    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: 'Помилка при оновленні книги' });
  }
}) as RequestHandler);


// Видалити книгу
app.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Помилка при видаленні книги' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
