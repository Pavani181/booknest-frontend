import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import api from "../api";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("");
  const [author, setAuthor] = useState("");
  const [availableGenres, setAvailableGenres] = useState([]);
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  const { addToCart } = useCart();

  const fetchBooks = async () => {
    try {
      let query = "";
      if (genre) query += `genre=${genre}&`;
      if (author) query += `author=${author}&`;

      const res = await api.get(`/api/books?${query}`);
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const fetchFilters = async () => {
    try {
      const res = await api.get("/api/books");
      const genres = [...new Set(res.data.map((b) => b.genre))];
      const authors = [...new Set(res.data.map((b) => b.author))];
      setAvailableGenres(genres);
      setAvailableAuthors(authors);
    } catch (err) {
      console.error("Failed to fetch filters:", err);
    }
  };

  const toggleWishlist = async (bookId) => {
    const token = localStorage.getItem("token");
    try {
      if (wishlistIds.includes(bookId)) {
        await api.delete(`/api/wishlist/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistIds((prev) => prev.filter((id) => id !== bookId));
      } else {
        await api.post(
          `/api/wishlist/${bookId}`, // ✅ Corrected
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlistIds((prev) => [...prev, bookId]);
      }

      window.dispatchEvent(new Event("wishlistUpdated")); // ✅ keep count synced
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
    }
  };

  useEffect(() => {
    fetchFilters();
    fetchBooks();
  }, [genre, author]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await api.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistIds(res.data.map((book) => book._id));
    };
    fetchWishlist();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Books</h2>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Genres</option>
          {availableGenres.map((g, i) => (
            <option key={i} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Authors</option>
          {availableAuthors.map((a, i) => (
            <option key={i} value={a}>
              {a}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setGenre("");
            setAuthor("");
          }}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          Reset Filters
        </button>
      </div>

      {/* Book Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className="border p-4 rounded shadow bg-white relative"
          >
            {book.image && (
              <img
                src={`http://localhost:5000/uploads/${book.image}`}
                alt={book.title}
                className="h-48 w-auto object-contain mx-auto"
              />
            )}
            <h3 className="text-lg font-bold">{book.title}</h3>
            <p className="text-sm text-gray-700 mb-1">{book.description}</p>
            <p className="text-sm">👤 Author: {book.author}</p>
            <p className="text-sm">📚 Genre: {book.genre}</p>
            <p className="text-sm">💰 Price: ₹{book.price}</p>

            <button
              onClick={() => addToCart(book)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Add to Cart
            </button>

            {/* ❤️ Wishlist Heart */}
            <button
              onClick={() => toggleWishlist(book._id)}
              className={`text-2xl absolute top-2 right-2 transition-colors ${
                wishlistIds.includes(book._id)
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
              title="Toggle Wishlist"
            >
              ❤️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
