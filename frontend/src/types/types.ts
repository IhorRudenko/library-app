export type Book = {
  _id?: string;
  id?: number;
  title: string;
  author: string;
  year: number;
  description?: string;
  image?: string;
  genre?: string;
  read?: boolean;
};


export type BookWithStatus = Book & {
  read: boolean;
};