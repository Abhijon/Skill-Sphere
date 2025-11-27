import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Background from "../components/BackgroundAnimation";
import { useAuth } from "../context/AuthContext";

const VerifyOTP = () => {
  const { verifyOTP, resendOTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("No email associated with this verification");
      navigate("/signup");
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      await verifyOTP(email, otp);
      toast.success("Account verified successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    try {
      setResendLoading(true);
      await resendOTP(email);
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    navigate("/signup");
    return null;
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <Background />
      <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl w-96 border border-gray-700 relative z-10 flex flex-col items-center overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-br-full opacity-50"></div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500 rounded-bl-full opacity-50"></div>

        <h2 className="text-3xl font-bold mb-6 text-pink-400 relative z-20 text-center w-full">
          Verify OTP
        </h2>

        <p className="text-gray-300 text-center mb-6">
          We've sent a 6-digit code to{" "}
          <span className="text-pink-400">{email}</span>
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 relative z-20 w-full flex flex-col items-center"
        >
          <div className="w-full">
            <label className="block text-gray-300 mb-2">OTP Code</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full px-4 py-2 text-center text-2xl tracking-[0.5em] rounded-lg bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none"
              placeholder="••••••"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-lg font-semibold hover:opacity-80 transition-all shadow-md shadow-pink-500/50 w-full"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Verify Account <FaArrowRight className="ml-2" />
              </>
            )}
          </button>

          <div className="text-center text-gray-300 text-sm mt-4">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-pink-400 hover:text-pink-300 transition-colors underline disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Send OTP again"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm relative z-20 w-full">
          <button
            onClick={() => navigate("/login")}
            className="text-purple-400 hover:text-purple-300 transition-all underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
