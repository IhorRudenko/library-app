// src/types.ts
export interface Book {
   id: number;
   title: string;
   author: string;
   year: number;
   description: string;
   image: string;
 }
 
 export interface BookWithStatus extends Book {
   isRead: boolean;
 }
 