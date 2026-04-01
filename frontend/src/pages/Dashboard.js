import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cityDataChart from "../assets/city-data-chart.png";
import ChatBot from "./ChatBot/ChatBot";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [showChat, setShowChat] = useState(false);

  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/", { replace: true });
      return;
    }

    const fetchComplaints = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/complaints/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data);
      } catch {
        alert("Failed to fetch complaints");
      }
    };

    fetchComplaints();
  }, [token, role, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard">
      {/* Topbar */}
      <header className="topbar">
        <h1>AI CityServe - User Dashboard</h1>
        <div className="topbar-actions">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header"><h2>Menu</h2></div>
          <nav className="sidebar-nav">
            <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
            <button onClick={() => navigate("/complaint")}>📝 File Complaint</button>
            <button onClick={() => navigate("/mycomplaints")}>📋 My Complaints</button>
            <button onClick={() => navigate("/profile")}>👤 Profile</button>
            <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
            <button onClick={() => navigate("/help")}>❓ Help</button>
            <button onClick={handleLogout}>🚪 Logout</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content">
          <h2>Dashboard Overview</h2>

          {/* Stats */}
          <div className="stats-grid">
  <div className="stat-card">
    <span className="icon">📊</span>
    <span className="count">{complaints.length}</span>
    <span className="label">Total Complaints</span>
  </div>
  <div className="stat-card">
    <span className="icon">⏳</span>
    <span className="count">{complaints.filter(c => c.status === "Pending").length}</span>
    <span className="label">Pending</span>
  </div>
  <div className="stat-card">
    <span className="icon">✅</span>
    <span className="count">{complaints.filter(c => c.status === "Resolved").length}</span>
    <span className="label">Resolved</span>
  </div>
</div>
<div className="info-section">
  {/* Announcement Card */}
  <div className="info-card">
    <div className="info-header"><span>📣</span> Announcements</div>
    <div className="info-content">
      <p>City water supply will be disrupted tomorrow.</p>
    </div>
  </div>

{/* Feedback Card */}
<div className="info-card">
  <div className="info-header">
    <span>💬</span> Feedback & Support
  </div>
  <div className="info-content">
  <div className="feedback-buttons">
    <button className="card-btn">Submit Feedback</button>
    <button className="card-btn">Live Chat</button>
  </div>
</div>
</div>

  <div className="info-card">
  <div className="info-header">
    <span>📊</span> City Data Snapshot
  </div>
  <div className="info-content">
    <div className="city-snapshot-row">
  <div className="city-text">
    <p>Air Quality: 1886</p>
    <p>Traffic Flow: 2691</p>
  </div>
  <div className="bar-chart-placeholder">
    <img
      src={require("../assets/city-data-chart.png")}
      alt="City Data Chart"
      className="chart-img"
    />
  </div>
    </div>
  </div>
</div>
</div>

<div className="complaints-metrics-row">
  {/* Recent Complaints Card */}
  <div className="info-card complaints-section">
    <div className="info-header">
      <span>📋</span> Recent Complaints
    </div>
    <div className="info-content">
      <ul className="complaints-list">
        <li>🕳️ Pothole on Main St. – <span className="pending">Pending</span></li>
        <li>💡 Streetlight Outage – <span className="resolved">Resolved</span></li>
        <li>🎶 Park Noise Complaint – <span className="pending">Pending</span></li>
        <li>🗑️ Trash Overflow – <span className="resolved">Resolved</span></li>
      </ul>
    </div>
  </div>

  {/* Performance Metrics Card */}
  <div className="info-card metrics-section">
    <div className="info-header">
      <span>📈</span> Performance Metrics
    </div>
    <div className="info-content">
      <div className="metrics-grid">
        <div className="metric-card">⏱️ Avg Resolution Time: 1.8 days</div>
        <div className="metric-card">⭐ Satisfaction Rate: 4.5 / 5</div>
        <div className="bar-chart-placeholder">
         
        </div>
      </div>
    </div>
  </div>
</div>

         {/* Action Buttons */}
<div className="actions">
  <button className="action-btn">📝 File a Complaint</button>
  <button className="action-btn">📋 Track My Complaints</button>
  <button className="action-btn">📞 Contact Support</button>
</div>

        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2028 AI CityServe | Privacy | Terms</p>
      </footer>

      {/* Floating Chat */}
      <button className="floating-chat-btn" onClick={() => setShowChat(true)}>💬 Help</button>
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  );
}

export default Dashboard;

