import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Background from "../components/BackgroundAnimation";

const Signup = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
    organization: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.role === "recruiter" && !formData.organization.trim()) {
      toast.error("Organization name is required for recruiters");
      return;
    }

    try {
      const signupData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        ...(formData.role === "recruiter" && {
          organization: formData.organization.trim(),
        }),
      };

      const response = await signup(signupData);
      console.log("Signup Response:", response);

      if (response?.message?.toLowerCase().includes("signup successful")) {
        toast.success("Signup successful! You can now login.");
        navigate("/login");
      } else if (response?.message) {
        toast.error(response.message);
      } else {
        toast.error("Signup failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      organization: role === "recruiter" ? prev.organization : "",
    }));
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <Background />
      <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl w-96 border border-gray-700 relative z-10 flex flex-col items-center overflow-hidden">
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500 rounded-br-full"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500 rounded-bl-full"></div>
        <h2 className="text-3xl font-bold mb-6 text-purple-400 relative z-20 text-center w-full">
          Create Account
        </h2>

        <div className="flex w-full mb-4 space-x-2">
          <button
            type="button"
            className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
              formData.role === "candidate"
                ? "bg-pink-500 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
            onClick={() => toggleRole("candidate")}
          >
            Candidate
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
              formData.role === "recruiter"
                ? "bg-pink-500 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
            onClick={() => toggleRole("recruiter")}
          >
            Recruiter
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 relative z-20 w-full flex flex-col items-center"
        >
          <div className="w-full">
            <label className="w-full text-gray-400">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
          </div>

          {formData.role === "recruiter" && (
            <div className="w-full">
              <label className="w-full text-gray-400">Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Enter your organization"
                className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
          )}

          <div className="w-full">
            <label className="w-full text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
          </div>

          <div className="w-full">
            <label className="w-full text-gray-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="w-full">
            <label className="w-full text-gray-400">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-pink-500 text-white px-6 py-2 rounded-full text-lg font-semibold hover:opacity-80 transition-all shadow-md shadow-pink-500/50 w-full mt-4"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Sign Up <FaArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-sm relative z-20">
          <span className="text-gray-400">Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-purple-400 hover:text-purple-300 transition-all underline"
            disabled={loading}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
