export interface Book {
  id: string; // ОБОВ’ЯЗКОВО string
  title: string;
  author: string;
  year: number;
  description?: string;
  image?: string;
  genre?: string;
}

export interface BookWithStatus extends Book {
  read: boolean;
}