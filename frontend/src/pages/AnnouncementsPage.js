
import { useNavigate } from "react-router-dom";
import "./AnnouncementsPage.css";

function AnnouncementsPage() {
  const navigate = useNavigate();

  const announcements = [
    {
      id: 1,
      title: "Road Repair Work",
      category: "Traffic",
      date: "20 Mar 2026",
      isNew: true,
      description: "Major road maintenance work starting in central zones."
    },
    {
      id: 2,
      title: "Water Supply Shutdown",
      category: "Water",
      date: "18 Mar 2026",
      isNew: true,
      description: "Temporary water shutdown in Sector 5."
    },
    {
      id: 3,
      title: "New Public Park Opening",
      category: "Event",
      date: "15 Mar 2026",
      isNew: false,
      description: "Grand opening of eco-friendly park."
    },
    {
      id: 4,
      title: "Smart Traffic Signals",
      category: "Innovation",
      date: "12 Mar 2026",
      isNew: false,
      description: "AI-based signals to reduce congestion."
    }
  ];

  return (
    <div className="announcements-page">

      {/* Header */}
      <nav className="nav-bar">
  <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
    AI CityServe
  </h1>

  <div className="nav-links">
    <span onClick={() => navigate("/")}>Home</span>
    <span onClick={() => navigate("/get-to-know")}>GetToKnow</span>
    <span onClick={() => navigate("/activities")}>Activities</span>
  </div>
</nav>

      {/* Hero */}
      <section className="hero">
        <h2>📣 Smart City Updates</h2>
        <p>Live updates powered by AI insights</p>
      </section>

      {/* AI Highlight */}
      <section className="highlight">
        <h3>🔥 Priority Alert</h3>
        <div className="highlight-card">
          <h4>{announcements[0].title}</h4>
          <p>{announcements[0].description}</p>
          <span>{announcements[0].date}</span>
        </div>
      </section>

      {/* Timeline Feed */}
      <section className="timeline">
        {announcements.map(item => (
          <div key={item.id} className="timeline-item">
            
            {/* Dot */}
            <div className="timeline-dot"></div>

            {/* Content */}
            <div className="timeline-content">
              <div className="top-row">
                <h4>{item.title}</h4>
                {item.isNew && <span className="new-badge">NEW</span>}
              </div>

              <span className="category">{item.category}</span>
              <p>{item.description}</p>
              <small>{item.date}</small>
            </div>

          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 AI CityServe</p>
        <div className="footer-links">
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/get-to-know")}>About</span>
          <span onClick={() => navigate("/feedback")}>Feedback</span>
        </div>
      </footer>

    </div>
  );
}

export default AnnouncementsPage;