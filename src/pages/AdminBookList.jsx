import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import api from "../api";
const AdminBookList = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-4 text-purple-700">
        📚 Manage Books
      </h2>
      <table className="w-full border rounded shadow">
        <thead className="bg-purple-100 text-purple-700">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Genre</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id} className="text-center border-t">
              <td className="p-2">{book.title}</td>
              <td className="p-2">{book.author}</td>
              <td className="p-2">{book.genre}</td>
              <td className="p-2">₹{book.price}</td>
              <td className="p-2">
                <Link
                  to={`/admin/books/edit/${book._id}`}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookList;
