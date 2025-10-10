import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setFormData({ name: res.data.name, password: "" });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    try {
      await api.put("/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Profile updated successfully!");
      setEditing(false);
      fetchUser();
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <div className="p-6">Loading user info...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👤 User Dashboard</h2>

      {!editing ? (
        <div className="bg-white shadow p-6 rounded space-y-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ✏️ Edit Profile
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleUpdate}
          className="bg-white shadow p-6 rounded space-y-4 max-w-md"
        >
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Updating..." : "💾 Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserDashboard;
