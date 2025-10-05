import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import api from "../api";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const handleRemove = async (bookId) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/api/wishlist/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWishlist();
      window.dispatchEvent(new Event("wishlistUpdated")); // 🔔 sync Layout count
    } catch (err) {
      console.error("Failed to remove book:", err);
    }
  };

  const handleMoveToCart = async (book) => {
    addToCart(book);
    await handleRemove(book._id); // remove from wishlist and sync count
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">💖 Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No books in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map((book) => (
            <div key={book._id} className="bg-white p-4 rounded shadow">
              {book.image && (
                <img
                  src={`/uploads/${book.image}`}
                  alt={book.title}
                  className="h-48 w-auto object-contain mx-auto"
                />
              )}
              <h3 className="font-semibold text-lg mt-2">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm font-bold">₹{book.price}</p>

              <button
                onClick={() => handleMoveToCart(book)}
                className="bg-green-600 text-white px-3 py-1 rounded mt-2"
              >
                🛒 Move to Cart
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                onClick={() => handleRemove(book._id)}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
