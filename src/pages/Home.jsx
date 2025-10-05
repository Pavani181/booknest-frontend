// src/pages/Home.jsx
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      {/* Background decorative illustration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <svg
          className="absolute top-0 left-0 w-[600px] opacity-10"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="300" cy="300" r="300" fill="#6366F1" />
        </svg>
        <svg
          className="absolute bottom-0 right-0 w-[500px] opacity-10"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="0" width="500" height="500" rx="250" fill="#9333EA" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <img
          src="/reading-book.svg"
          alt="Reading Book"
          className="w-40 md:w-56 mx-auto mb-6 animate-fade-in"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-4">
          📚 Welcome to <span className="text-indigo-600">BookNest</span>
        </h1>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
          Discover, collect, and manage your favorite books with ease.
          <br />
          <span className="font-medium">BookNest</span> is your personal digital
          bookstore. <br />
          Register now to explore our growing collection!
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 transition px-6 py-2 rounded-full text-white shadow-md"
          >
            🚀 Register
          </Link>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-full text-white shadow-md"
          >
            🔑 Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
