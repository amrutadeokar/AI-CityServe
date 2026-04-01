import { useNavigate } from "react-router-dom";
import "./ActivitiesPage.css";

function ActivitiesPage() {
  const navigate = useNavigate();

  return (
    <div className="activities-page">
      {/* Header */}
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
          <span onClick={() => navigate("/activities")} style={{ cursor: "pointer" }}>
            Activities
          </span>
        </nav>
      </header>

      <main className="content">
        {/* Hero Section */}
        <section className="hero-section">
          <h2>Explore AI CityServe Activities</h2>
          <p>Engage with the community and track your city's smart initiatives!</p>
        </section>

        {/* Activities Grid */}
        <section className="activities-section">
          <h3>What You Can Do</h3>
          <div className="activities-grid">
            <div className="activity-card">
              <span>📝</span>
              <h4>Report Issues</h4>
              <p>Submit complaints about civic issues and track resolution status.</p>
            </div>
            <div className="activity-card">
              <span>💡</span>
              <h4>Give Feedback</h4>
              <p>Provide insights on services to improve efficiency and quality.</p>
            </div>
            <div className="activity-card">
              <span>📊</span>
              <h4>View Analytics</h4>
              <p>Monitor city data trends, citizen reports, and resolutions in real-time.</p>
            </div>
            <div className="activity-card">
              <span>💬</span>
              <h4>Participate in Discussions</h4>
              <p>Join community discussions or municipal Q&A sessions.</p>
            </div>
            <div className="activity-card">
              <span>🔔</span>
              <h4>Receive Alerts</h4>
              <p>Get smart notifications about emergencies or municipal updates.</p>
            </div>
            <div className="activity-card">
              <span>🏆</span>
              <h4>Community Challenges</h4>
              <p>Participate in city initiatives, events, and improvement challenges.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h3>Join the Action</h3>
          <p>Be part of your city's smart initiatives today!</p>
          <button onClick={() => navigate("/register-form")}>Get Started</button>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 AI CityServe. All rights reserved.</p>
        
      </footer>
    </div>
  );
}

export default ActivitiesPage;