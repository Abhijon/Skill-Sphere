import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Background from "../components/BackgroundAnimation";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { user } = await login(formData.email, formData.password);

      toast.success("Login successful!");

      if (user.role === "candidate") {
        navigate("/all-jobs");
      } else {
        navigate("/recruiter-dashboard");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <Background />

      <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl w-96 border border-gray-700 relative z-10 flex flex-col items-center overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-br-full opacity-50"></div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500 rounded-bl-full opacity-50"></div>

        <h2 className="text-4xl font-bold mb-6 text-pink-400 relative z-20 text-center w-full">
          Welcome Back!
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 relative z-20 w-full flex flex-col items-center"
        >
          <div className="w-full">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="giga@example.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none"
              required
            />
          </div>

          <div className="w-full relative">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-pink-400 transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="w-full flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-lg font-semibold hover:opacity-80 transition-all shadow-md shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  Sign In <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 flex justify-between text-sm relative z-20 w-full">
          <button
            onClick={() => navigate("/signup")}
            className="text-pink-400 hover:text-pink-300 transition-all underline"
          >
            Create Account
          </button>
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-purple-400 hover:text-purple-300 transition-all underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
