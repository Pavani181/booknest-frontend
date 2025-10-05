import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import api from "../api";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    if (!address.trim()) {
      return alert("🚨 Please enter a delivery address.");
    }

    const token = localStorage.getItem("token");
    try {
      await api.post(
        "/api/orders",
        {
          items: cartItems.map((item) => ({
            book: item._id,
            quantity: item.quantity,
          })),
          totalAmount,
          address, // ✅ Include address in the payload
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Order placed successfully!");
      clearCart();
      setAddress(""); // clear address
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p>
                  ₹{item.price} ×{" "}
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, parseInt(e.target.value))
                    }
                    className="w-12 border rounded text-center ml-1"
                  />
                </p>
                <p className="text-sm text-gray-600">{item.author}</p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6">
            <label className="block font-semibold mb-1">
              🏠 Delivery Address:
            </label>
            <textarea
              className="w-full border p-2 rounded"
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address"
              required
            ></textarea>
          </div>

          <div className="text-right font-bold text-xl mt-4">
            Total: ₹{totalAmount}
          </div>

          <button
            onClick={handleOrder}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            ✅ Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
