import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, loading, isAuthenticating } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".mobile-menu")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Jobs", path: "/all-jobs" },
    ...(user?.role === "recruiter"
      ? [{ name: "Recruiter Dashboard", path: "/recruiter-dashboard" }]
      : []),
  ];

  if (isAuthenticating) {
    return (
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 p-4 transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H/E</span>
            </div>
            <span className="text-2xl font-bold text-white hidden md:block">
             Skill Sphere
            </span>
          </Link>
          <div>Loading...</div>
        </div>
      </motion.nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 p-4 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S/S</span>
          </div>
          <span className="text-2xl font-bold text-white hidden md:block">
           Skill Sphere
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-300 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all group-hover:w-full" />
            </Link>
          ))}

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">|</span>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {loading ? "Logging Out..." : "Logout"}
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                to="/signup"
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-white p-2"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="mobile-menu md:hidden absolute top-16 right-4 w-64 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-800 p-4"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-gray-800 pt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full text-left text-red-500 hover:text-red-400 disabled:opacity-50"
                >
                  {loading ? "Logging Out..." : "Logout"}
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-300 hover:text-white mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block text-pink-500 hover:text-pink-400"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
