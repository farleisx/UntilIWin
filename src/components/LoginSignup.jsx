import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginSignup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setErr("");
    try {
      await axios.post("/api/signup", { email, password });
      navigate("/dashboard");
    } catch (error) {
      setErr(error.response?.data?.error || error.message || "Signup failed");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    try {
      await axios.post("/api/login", { email, password });
      navigate("/dashboard");
    } catch (error) {
      setErr(error.response?.data?.error || error.message || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Login / Sign Up</h2>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded" required />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded" required />
        {err && <div className="text-red-600 mb-3">{err}</div>}
        <div className="flex gap-2">
          <button onClick={handleLogin} className="flex-1 py-2 bg-indigo-600 text-white rounded">Login</button>
          <button onClick={handleSignup} className="flex-1 py-2 border rounded">Sign Up</button>
        </div>
      </form>
    </div>
  );
}
