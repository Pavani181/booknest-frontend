// src/pages/AddBook.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../api";

const AddBook = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
    description: "",
    image: null,
  });

  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams(); // used for edit mode
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchBook = async () => {
      if (id) {
        setIsEdit(true);
        try {
          const res = await api.get(`/api/books/${id}`);
          const { title, author, genre, price, description } = res.data;
          setBook({ title, author, genre, price, description, image: null });
        } catch (err) {
          alert("Failed to load book");
        }
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setBook((prev) => ({ ...prev, image: files[0] }));
    } else {
      setBook((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    for (const key in book) {
      if (book[key]) formData.append(key, book[key]);
    }

    try {
      if (isEdit) {
        await axios.put(`/api/books/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("✅ Book updated successfully");
      } else {
        await axios.post("/api/books", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("✅ Book added successfully");
      }
      navigate("/admin/books");
    } catch (err) {
      console.error(err);
      alert("❌ Operation failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "✏️ Edit Book" : "➕ Add Book"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={book.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2"
          required
        />
        <input
          name="author"
          value={book.author}
          onChange={handleChange}
          placeholder="Author"
          className="w-full border p-2"
          required
        />
        <input
          name="genre"
          value={book.genre}
          onChange={handleChange}
          placeholder="Genre"
          className="w-full border p-2"
          required
        />
        <input
          name="price"
          value={book.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          step="0.01"
          className="w-full border p-2"
          required
        />
        <textarea
          name="description"
          value={book.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2"
          required
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isEdit ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;



