// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api";
const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleCancel = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(
        `/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Could not cancel the order. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded mb-4 shadow bg-white"
          >
            <p className="font-bold">
              Order ID: <span className="text-sm">{order._id}</span>
            </p>
            <p>Status: {order.status}</p>
            <p>Total Amount: ₹{order.totalAmount}</p>
            <p>Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>

            {order.status === "Processing" && (
              <button
                onClick={() => handleCancel(order._id)}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                ❌ Cancel Order
              </button>
            )}

            <div className="mt-4 space-y-2">
              {order.items.map((item, index) =>
                item.book ? (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-b pb-2"
                  >
                    {item.book.image && (
                      <img
                        src={`http://localhost:5000/uploads/${item.book.image}`}
                        alt={item.book.title}
                        className="w-16 h-20 object-cover border"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold">{item.book.title}</h4>
                      <p className="text-sm text-gray-600">
                        Author: {item.book.author}
                      </p>
                      <p className="text-sm">Price: ₹{item.book.price}</p>
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-b pb-2 text-red-500"
                  >
                    ❌ This book is no longer available.
                  </div>
                )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
