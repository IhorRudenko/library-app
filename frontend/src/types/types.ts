export type Book = {
  _id?: string; // MongoDB ID
  id?: number; // Локальний ID (можеш залишити на всяк випадок)
  title: string;
  author: string;
  year: number;
  description?: string;
  image?: string;
  genre?: string | string[]; // на випадок genre.split()
};


export type BookWithStatus = Book & {
  read: boolean;
};