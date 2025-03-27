import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Book from './models/Book';
import dotenv from 'dotenv';


dotenv.config({ path: __dirname + "/.env" });

// const app = express();
// const PORT = process.env.PORT || 3001;

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// -- перевірка log
mongoose.connect("mongodb+srv://IhorRudenko:Oc2vi73F3@cluster0.gr4mtng.mongodb.net/my-library?retryWrites=true&w=majority")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("Connection failed:", err));

console.log("MONGO_URI = ", process.env.MONGO_URI);


// Маршрут для отримання всіх книг
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
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
