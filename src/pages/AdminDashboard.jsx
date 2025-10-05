// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api";
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-white shadow p-5 rounded cursor-pointer hover:bg-blue-100 transition"
          onClick={() => navigate("/admin/users")}
        >
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl">{stats.totalUsers}</p>
        </div>

        <div
          className="bg-white shadow p-5 rounded cursor-pointer hover:bg-green-100 transition"
          onClick={() => navigate("/admin/books")}
        >
          <h3 className="text-lg font-semibold">Total Books</h3>
          <p className="text-2xl">{stats.totalBooks}</p>
        </div>

        <div
          className="bg-white shadow p-5 rounded cursor-pointer hover:bg-purple-100 transition"
          onClick={() => navigate("/admin/orders")}
        >
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl">{stats.totalOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
