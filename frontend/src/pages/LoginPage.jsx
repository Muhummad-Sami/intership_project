import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "../index.css";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get the page they came from with full state (including car)
  const from = location.state?.from || { pathname: "/" };

  // ✅ If already logged in, redirect to the intended page
  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate(from.pathname, { state: from.state });
      }
    }
  }, [user, navigate, from]);

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        login(res.data.token, res.data.user);

        if (res.data.user.isAdmin) {
          navigate("/admin");
        } else {
          // ✅ Go back to the original page with its state (car object)
          navigate(from.pathname, { state: from.state });
        }
      } else {
        await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        alert("Account created successfully!");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="hero-bg" />
      <div className="glass login-card fade-in">
        <h1 className="font-display headline-xl text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="subtitle text-center">Access your exclusive fleet</p>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-underline">
              <label className="label-caps">Name</label>
              <input
                className="luxury-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}
          <div className="input-underline">
            <label className="label-caps">Email</label>
            <input
              type="email"
              className="luxury-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="input-underline relative">
            <label className="label-caps">Password</label>
            <input
              type="password"
              className="luxury-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="btn-primary gold-glow w-full mt-6"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: "#D4AF37", cursor: "pointer" }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}