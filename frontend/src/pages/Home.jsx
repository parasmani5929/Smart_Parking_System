import React from "react";
import { useNavigate } from "react-router-dom";
import FloatingChat from "../components/FloatingChat";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">ParkSmart</div>
        <div className="navbar-buttons">
          <button className="nav-button" onClick={() => navigate("/menu")}>
            Menu
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <h1 className="hero-title">Smart Parking Solutions</h1>
        <p className="hero-subtitle">
          Book your parking spot instantly with our AI-powered system
        </p>
        <button className="nav-button" onClick={() => navigate("/menu")}>
          Get Started
        </button>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3 className="feature-title">Easy Booking</h3>
            <p className="feature-description">
              Book your parking spot in just a few clicks. No more circling around looking for parking.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI Assistant</h3>
            <p className="feature-description">
              Get instant help with our AI chatbot for any parking-related queries.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3 className="feature-title">Real-time Updates</h3>
            <p className="feature-description">
              Stay informed about your booking status and parking availability in real-time.
            </p>
          </div>
        </div>
      </section>

      <FloatingChat />
    </div>
  );
}