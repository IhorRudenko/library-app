
import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Book from './models/Book';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + "/.env" });

const mongoURI = process.env.MONGO_URI || '';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: '*', // тимчасово відкрито для всіх, можна потім уточнити
}));

app.use(express.json());

mongoose.connect("mongodb+srv://IhorRudenko:Oc2vi73F3@cluster0.gr4mtng.mongodb.net/my-library?retryWrites=true&w=majority")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("Connection failed:", err));

console.log("MONGO_URI = ", process.env.MONGO_URI);

// ------- API ROUTES ---------
const router = express.Router();

// GET all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Не вдалося отримати книги' });
  }
});

// POST new book
router.post('/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ error: 'Не вдалося додати книгу' });
  }
});

// PUT update book
router.put('/books/:id', (async (req: Request, res: Response) => {
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

// DELETE book
router.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Помилка при видаленні книги' });
  }
});

// Mount all /api routes
app.use('/api', router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
