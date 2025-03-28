export interface Book {
  _id?: string;
  id?: number;
  title: string;
  author: string;
  year: number;
  description: string;
  image: string;
  genre: string;
}

export interface BookWithStatus extends Book {
  read: boolean;
}

export interface BookWithStatus extends Book {
  read: boolean;
}

export interface BookWithStatus extends Book {
  read: boolean;
}