import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HelpPage.css";

function HelpPage() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      q: "How to report an issue?",
      a: "Go to Feedback section and submit your complaint."
    },
    {
      q: "How to track my complaint?",
      a: "You will receive updates in notifications and dashboard."
    },
    {
      q: "How does AI CityServe help?",
      a: "It uses AI to prioritize and manage city issues efficiently."
    }
  ];

  return (
    <div className="help-page">

      {/* HEADER */}
      <nav className="nav-bar">
        <h1 onClick={() => navigate("/")}>AI CityServe</h1>
        <div className="nav-links">
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/get-to-know")}>GetToKnow</span>
          <span onClick={() => navigate("/activities")}>Activities</span>
          <span onClick={() => navigate("/announcements")}>Announcements</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h2>🛠 Help & Support</h2>
        <p>Instant help, emergency access & smart assistance</p>
      </section>

      {/* 🚨 IMPORTANT NUMBERS */}
      <section className="emergency-section">
        <h3>🚨 Emergency Contacts</h3>

        <div className="emergency-grid">
          <a href="tel:100" className="emergency-card police">
            🚓 Police <span>100</span>
          </a>

          <a href="tel:102" className="emergency-card ambulance">
            🚑 Ambulance <span>102</span>
          </a>

          <a href="tel:101" className="emergency-card fire">
            🚒 Fire Brigade <span>101</span>
          </a>

          <a href="tel:1091" className="emergency-card women">
            👩 Women Helpline <span>1091</span>
          </a>

          <a href="tel:1800" className="emergency-card civic">
            🏢 Municipal Help <span>1800-123-456</span>
          </a>
        </div>
      </section>

      {/* ⚡ QUICK ACTIONS */}
      <section className="quick-actions">
        <div className="action-card" onClick={() => navigate("/feedback")}>
          📩 Report Issue
        </div>

        <div className="action-card" onClick={() => navigate("/announcements")}>
          📣 City Updates
        </div>

        <div className="action-card">
          🤖 AI Assistant
        </div>
      </section>

      {/* ❓ FAQ SECTION */}
     <section className="faq">
  <h3>❓ Smart Help Center</h3>

  {faqs.map((item, index) => (
    <div
      key={index}
      className={`faq-item ${openFAQ === index ? "active" : ""}`}
      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
    >
      <div className="faq-question">
        <span>{item.q}</span>
        <span className={`arrow ${openFAQ === index ? "open" : ""}`}>
          ⌄
        </span>
      </div>

      <div className="faq-answer">
        <p>{item.a}</p>
      </div>
    </div>
  ))}
</section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 AI CityServe</p>
        <div className="footer-links">
          
        </div>
      </footer>

    </div>
  );
}

export default HelpPage;