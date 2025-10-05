import React from "react";

const BookCard = ({ book }) => {
  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <h3 className="text-xl font-bold mb-1">{book.title}</h3>
      <p className="text-gray-600 mb-2">Author: {book.author}</p>
      <p className="text-gray-500 text-sm mb-2">Genre: {book.genre}</p>
      <p className="text-sm text-gray-800">₹{book.price}</p>
    </div>
  );
};

export default BookCard;
