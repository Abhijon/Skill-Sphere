import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const backend_url = import.meta.env.BACKEND_URL || "http://localhost:9001";

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  // 🔹 Load user & verify token on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          const response = await fetch(
            `${backend_url}/api/auth/verify`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            setUser(JSON.parse(storedUser));
          } else {
            clearAuthStorage();
          }
        }
      } catch (error) {
        clearAuthStorage();
      } finally {
        setIsAuthenticating(false);
      }
    };

    initializeAuth();
  }, []);

  // 🔹 Clear user authentication storage
  const clearAuthStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🔹 Generic API request function (used for login, signup, etc.)
  const authRequest = async (url, body, method = "POST") => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login function
  const login = async (email, password) => {
    const data = await authRequest(
      `${backend_url}/api/auth/login`,
      {
        email,
        password,
      }
    );

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  // 🔹 Signup function (now directly registers user without OTP)
  const signup = async (formData) => {
    const data = await authRequest(
      `${backend_url}/api/auth/signup`,
      formData
    );
    return data;
  };

  // 🔹 Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`{backend_url}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.warn("Logout request failed, but clearing storage anyway.");
    } finally {
      clearAuthStorage();
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        loading,
        isAuthenticating,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Custom hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
