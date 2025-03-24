export type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
  description?: string;
  image?: string;
};

export type BookWithStatus = Book & {
  read: boolean;
};