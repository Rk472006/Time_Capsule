import React, { useState } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css";

export default function App() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-header-bar">
          <h1 className="dashboard-welcome-message">🎉 Welcome, {user.email}</h1>
          <button onClick={handleLogout} className="dashboard-logout-button">
            Logout
          </button>
        </div>

        

        <Dashboard user={user} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="title">⏳ Time Capsule</h1>
      <p className="subtitle">
        Save messages for the future. Unlock them when the time is right.
      </p>

      <div className="auth-box">
        {isLoginView ? (
          <Login onLoginSuccess={handleAuthSuccess} />
        ) : (
          <Register onRegisterSuccess={handleAuthSuccess} />
        )}

        <p className="toggle-text">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="toggle-button"
            onClick={() => setIsLoginView(!isLoginView)}
          >
            {isLoginView ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
