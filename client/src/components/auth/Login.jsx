import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./login.css"; 
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function isValidPassword(password) {
    const minLength = 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= minLength;

    return hasUpper && hasLower && hasDigit && hasSpecial && isLongEnough;
  }

  const handleLogin = async (e) => {
    e.preventDefault(); 

    if (!isValidPassword(password)) {
        toast.error("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
        navigate("/login");
        return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      toast.success("Logged in successfully!");
      localStorage.setItem("uid", firebaseUser.uid);
      navigate(`/inbox/${firebaseUser.uid}`, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      if (err.code === 'auth/user-not-found') {
        toast.error("No user found with this email.");
      } else if (err.code === 'auth/wrong-password') {
        toast.error("Incorrect password.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-page">
    <div className="login-container">
      <h2>Login</h2>
      <form id="login" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
