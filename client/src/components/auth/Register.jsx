import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
import "./register.css"; // Import CSS here

export default function Register({ onRegisterSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Sync with backend MongoDB
      await axios.post("http://localhost:5000/api/user/registerOrLogin", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      });

      setError("✅ Registered and synced with database!");
      setEmail("");
      setPassword("");

      if (onRegisterSuccess) {
        onRegisterSuccess({ uid: firebaseUser.uid, email: firebaseUser.email });
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
   
      <form className="register-form" onSubmit={handleRegister} noValidate>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Enter password "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && (
        <p className={`message ${error.startsWith("✅") ? "success" : "error"}`}>
          {error}
        </p>
      )}
    </div>
  );
}
