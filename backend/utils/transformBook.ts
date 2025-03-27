export const transformBook = (book: any) => ({
   id: book._id.toString(),
   title: book.title,
   author: book.author,
   year: book.year,
   description: book.description,
   image: book.image,
   genre: book.genre,
   read: book.read || false,
 });
 