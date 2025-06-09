import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
import "./login.css"; // Import the CSS here

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Sync user with backend
      await axios.post("http://localhost:5000/api/user/registerOrLogin", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      });

      setError("Logged in and synced with database!");
      setLoading(false);

      if (onLoginSuccess) {
        onLoginSuccess({ uid: firebaseUser.uid, email: firebaseUser.email });
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} noValidate>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && (
        <p style={{ color: error.includes("Logged in") ? "#22c55e" : "#ef4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}
