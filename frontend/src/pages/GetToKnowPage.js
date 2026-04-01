import { useNavigate } from "react-router-dom";
import "./GetToKnowPage.css";

function GetToKnowPage() {
  const navigate = useNavigate();

  return (
    <div className="gettoknow-page">
      {/* Header / Navigation */}
      <header className="nav-bar">
        <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          AI CityServe
        </h1>
        <nav className="nav-links">
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            Home
          </span>
          <span onClick={() => navigate("/get-to-know")} style={{ cursor: "pointer" }}>
            GetToKnow
          </span>
          <span onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            Dashboard
          </span>
        </nav>
      </header>

      <main className="content">
        {/* Hero Section */}
        <section className="hero-section">
          <h2>Welcome to AI CityServe</h2>
          <p>Transforming your city experience with intelligent services!</p>
        </section>

        {/* Innovation Section */}
        <section className="innovation-section">
          <h3>Our Innovations</h3>
          <div className="innovation-grid">
            <div className="innovation-card">
              <span>🤖</span>
              <h4>AI-Powered Assistance</h4>
              <p>Smart recommendations and chatbot assistance for citizens.</p>
            </div>
            <div className="innovation-card">
              <span>📈</span>
              <h4>Real-Time Analytics</h4>
              <p>Track city issues, trends, and resolutions at a glance.</p>
            </div>
            <div className="innovation-card">
              <span>🌐</span>
              <h4>Integrated Services</h4>
              <p>Connect with all municipal services from a single platform.</p>
            </div>
            <div className="innovation-card">
              <span>🔔</span>
              <h4>Smart Notifications</h4>
              <p>Receive instant alerts for emergencies or updates.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <h3>Did You Know?</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>500+</h4>
              <p>Trusted Services Listed</p>
            </div>
            <div className="stat-card">
              <h4>10,000+</h4>
              <p>Issues Reported & Tracked</p>
            </div>
            <div className="stat-card">
              <h4>95%</h4>
              <p>Citizen Satisfaction Rate</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h3>Get Started</h3>
          <p>Join AI CityServe and contribute to a smarter, safer city.</p>
          <button onClick={() => navigate("/register-form")}>Register Now</button>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 AI CityServe. All rights reserved.</p>
         
        </div>
      </footer>
    </div>
  );
}

export default GetToKnowPage;