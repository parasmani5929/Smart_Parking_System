import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    setIsLoggedIn(true);
  };

  return (
    <div className="menu-container">
      <header className="menu-header">
        <div className="parking-icon">🚗</div>
        <h1 className="menu-title">ParkSmart Menu</h1>
        <p className="menu-subtitle">Your Smart Parking Dashboard</p>
      </header>

      {!isLoggedIn ? (
        <section className="login-section">
          <h2 className="login-title">Login to Continue</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </section>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">🎯</div>
            <h3 className="card-title">Book a Slot</h3>
            <p className="card-description">
              Find and book available parking slots in your preferred location.
            </p>
            <button className="card-button" onClick={() => navigate("/book-slot")}>
              Book Now
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3 className="card-title">My Bookings</h3>
            <p className="card-description">
              View and manage your current and upcoming parking bookings.
            </p>
            <button className="card-button" onClick={() => navigate("/bookings")}>
              View Bookings
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📍</div>
            <h3 className="card-title">Parking Areas</h3>
            <p className="card-description">
              Explore available parking areas and their current status.
            </p>
            <button className="card-button" onClick={() => navigate("/parking-areas")}>
              View Areas
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3 className="card-title">Profile</h3>
            <p className="card-description">
              Manage your account settings and personal information.
            </p>
            <button className="card-button" onClick={() => navigate("/profile")}>
              View Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 