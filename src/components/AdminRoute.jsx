// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    api
      .get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsAdmin(res.data.role === "admin");
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAdmin ? (
    children
  ) : (
    <div className="text-center text-red-600 mt-10">
      🚫 You do not have permission to access this page.
    </div>
  );
};

export default AdminRoute;
