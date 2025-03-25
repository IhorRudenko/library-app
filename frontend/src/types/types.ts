export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  image: string;
  description: string;
  genre: string | string[]; // ← це важливо!
};


export type BookWithStatus = Book & {
  read: boolean;
};