
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [expandedArea, setExpandedArea] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [expandedPriority, setExpandedPriority] = useState({
    High: true,
    Medium: false,
    Low: false,
  });
  const [notifications, setNotifications] = useState([]);

  const highPriorityAudio = useRef(new Audio("/alarm.mp3"));
  const firstLoad = useRef(true); // Track first fetch to play alarm once


  const departments = [
    "Sanitation",
    "Water Supply",
    "Roads",
    "Electricity",
    "Health",
    "Education",
    "Property Tax",
    "Public Transport",
    "Others",
  ];
  const deptEmojis = ["🧹","💧","🛣️","💡","🏥","🏫","🏠","🚌","⚙️"];

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Unlock audio after first user click
  useEffect(() => {
    const unlockAudio = () => {
      const audio = highPriorityAudio.current;
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
      window.removeEventListener("click", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
  }, []);

  // Fetch complaints & feedbacks with real-time polling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/complaints/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Play alarm once at login if any high-priority complaint exists
        if (firstLoad.current) {
          const hasHighPriority = res.data.some(c => c.priority === "High");
          if (hasHighPriority) {
            const audio = highPriorityAudio.current;
            audio.pause();
            audio.currentTime = 0;
            audio.play().catch(() => console.log("Audio blocked"));
          }
          firstLoad.current = false;
        }

        // Detect new complaints
        const newComplaints = res.data.filter(
          c => !complaints.some(old => old._id === c._id)
        );

        // Trigger notifications
        newComplaints.forEach(c => {
          if (Notification.permission === "granted") {
            new Notification(
              c.priority === "High" ? "High Priority Complaint!" : "New Complaint",
              { body: `${c.description} by ${c.user_email}` }
            );
          }
        });

        if (newComplaints.length > 0) {
          setNotifications(prev => {
  const existingIds = new Set(prev.map(n => n._id));
  const uniqueNew = newComplaints.filter(n => !existingIds.has(n._id));
  return [...uniqueNew, ...prev];
});
        }

        setComplaints(res.data);
      } catch {
        console.log("Failed to fetch complaints");
      }

      try {
        const res = await axios.get("http://127.0.0.1:8000/feedback/all-feedback");
        setFeedbacks(res.data);
      } catch {
        console.log("Failed to fetch feedback");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const updateStatus = async (id, status) => {
    const formData = new FormData();
    formData.append("status", status);

    try {
      await axios.put(
        `http://127.0.0.1:8000/complaints/update-status/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.get("http://127.0.0.1:8000/complaints/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const togglePriority = (priority) => {
    setExpandedPriority(prev => ({ ...prev, [priority]: !prev[priority] }));
  };

  // 🤖 AI Recommended Action
const getSuggestion = (c) => {
  const desc = c.description?.toLowerCase() || "";

  if (c.priority === "High") {
    return "🚨 Immediate escalation required. Assign field team within 2 hours.";
  }

  if (desc.includes("garbage")) {
    return "Assign sanitation team and schedule cleaning.";
  }

  if (desc.includes("water") || desc.includes("leak")) {
    return "Schedule inspection and repair water supply issue.";
  }

  if (desc.includes("road") || desc.includes("pothole")) {
    return "Plan road repair and safety inspection.";
  }

  if (desc.includes("electric")) {
    return "Send electricity maintenance team.";
  }

  return "Assign to department and monitor progress.";
};

  /* ================= KPI CALCULATIONS ================= */
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(c => c.status === "Pending").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;
  const resolutionRate = totalComplaints
    ? ((resolvedCount / totalComplaints) * 100).toFixed(1)
    : 0;

  const deptCounts = departments.map(
    dept => complaints.filter(c => c.department === dept).length
  );
  const deptChartData = {
    labels: departments,
    datasets: [{ label: "Department Complaints", data: deptCounts, backgroundColor: "rgba(54, 162, 235, 0.6)" }]
  };

  const statusTypes = ["Pending", "In Progress", "Resolved", "Rejected"];
  const statusCounts = statusTypes.map(
    status => complaints.filter(c => c.status === status).length
  );
  const statusChartData = {
    labels: statusTypes,
    datasets: [{ data: statusCounts, backgroundColor: ["#ffc107", "#17a2b8", "#28a745", "#dc3545"] }]
  };

  const priorityTypes = ["High", "Medium", "Low"];
  const priorityCounts = priorityTypes.map(
    priority => complaints.filter(c => c.priority === priority).length
  );
  const priorityChartData = {
    labels: priorityTypes,
    datasets: [{ data: priorityCounts, backgroundColor: ["#dc3545", "#ffc107", "#28a745"] }]
  };

  const totalFeedback = feedbacks.length;
  const avgRating = totalFeedback
    ? (feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) / totalFeedback).toFixed(1)
    : 0;

  const ratingTypes = [1, 2, 3, 4, 5];
  const ratingCounts = ratingTypes.map(r => feedbacks.filter(f => f.rating === r).length);
  const ratingChartData = { labels: ["1⭐","2⭐","3⭐","4⭐","5⭐"], datasets: [{ label: "Ratings", data: ratingCounts, backgroundColor: "#4CAF50" }] };

  const sentimentTypes = ["Positive","Neutral","Negative"];
  const sentimentCounts = sentimentTypes.map(
  s => feedbacks.filter(
    f => f.sentiment === s && f.comments && f.comments.trim() !== ""
  ).length
);
  const sentimentChartData = { labels: sentimentTypes, datasets: [{ label: "Sentiment", data: sentimentCounts, backgroundColor: ["#28a745","#ffc107","#dc3545"] }] };

  const filteredComplaints = selectedDept
    ? complaints.filter(c => c.department === selectedDept)
    : [];

    // ✅ Area-wise grouping
const areaGroups = complaints.reduce((acc, complaint) => {
const area = complaint.location 
  ? complaint.location.split(",")[0] 
  : "Unknown";

  if (!acc[area]) {
    acc[area] = [];
  }

  acc[area].push(complaint);
  return acc;
}, {});

  return (
    <div className="admin-dashboard-page dashboard">
      <header className="topbar">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-body">
        <aside className="sidebar">
          <div className="sidebar-header">Menu</div>
          <nav className="sidebar-nav">
            <button onClick={() => setActiveTab("home")}>🏠 Home</button>
            <button onClick={() => setActiveTab("all-complaints")}>📋 All Complaints</button>
            <button onClick={() => setActiveTab("analytics")}>📊 Analytics</button>
            <button onClick={handleLogout}>🚪 Logout</button>
          </nav>
        </aside>

        <main className="content">
          {activeTab === "home" && (
            <>
              <h2>Departments</h2>
              <div className="dept-grid">
                {departments.map((d, idx) => (
                  <div key={d} className={`dept-card color-${idx % 9}`} onClick={() => setSelectedDept(prev => prev === d ? "" : d)}>
                    <span className="emoji">{deptEmojis[idx]}</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              <h3>
                {selectedDept 
                  ? `Complaints in ${selectedDept}` 
                  : "Click a department to view complaints"}
              </h3>
              <div className="complaints-section">
                {selectedDept && filteredComplaints.map(c => (
                  <div key={c._id} className={`complaint-box flex-box ${c.priority === "High" ? "high-priority" : ""}`}>
                    {c.image && <img src={`http://127.0.0.1:8000/images/${c.image}`} alt="Complaint" className="complaint-img" />}
                    <div className="complaint-details">
                      <p><b>User:</b> {c.user_email}</p>
                      <p><b>Location:</b> {c.location}</p>
                      <p><b>Description:</b> {c.description}</p>
                      <p><b>Priority:</b> {c.priority}</p>
                      <p><b>Status:</b> {c.status}</p>
                      <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                        <option>Rejected</option>
                      </select>
                      <p className="ai-suggestion">
  🤖 <b>Suggested Action:</b> {getSuggestion(c)}
</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "all-complaints" && (
            <>
              <h2>All Complaints by Priority</h2>
              {["High","Medium","Low"].map(priority => {
                const complaintsByPriority = complaints.filter(c => c.priority === priority);
                return (
                  <div key={priority} className="priority-section">
                    <button
                      className={`priority-header ${priority.toLowerCase()}`}
                      onClick={() => togglePriority(priority)}
                    >
                      {priority} Priority ({complaintsByPriority.length}) <span>{expandedPriority[priority] ? "▲" : "▼"}</span>
                    </button>

                    {expandedPriority[priority] && (
                      <div className="priority-complaints">
                        {complaintsByPriority.length === 0 ? <p>No {priority} priority complaints</p> :
                          complaintsByPriority.map(c => (
                            <div key={c._id} className={`complaint-box flex-box ${c.priority === "High" ? "high-priority" : ""}`}>
                              {c.image && <img src={`http://127.0.0.1:8000/images/${c.image}`} alt="Complaint" className="complaint-img"/>}
                              <div className="complaint-details">
                                <p><b>User:</b> {c.user_email}</p>
                                <p><b>Location:</b> {c.location}</p>
                                <p><b>Description:</b> {c.description}</p>
                                <p><b>Status:</b> {c.status}</p>
                                <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}>
                                  <option>Pending</option>
                                  <option>In Progress</option>
                                  <option>Resolved</option>
                                  <option>Rejected</option>
                                </select>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                );
              })}
             <h2>Area-wise Issues</h2>

{/* 🔥 AREA CARDS */}
<div className="area-grid">
  {Object.keys(areaGroups).map((area, idx) => (
    <div
  key={area}
  className={`area-card ${selectedArea === area ? "active-area" : ""}`}
  onClick={() =>
    setSelectedArea(prev => (prev === area ? "" : area))
  }
>
  <div className="area-count">
    {areaGroups[area].length}
  </div>

  <div className="area-name">
    📍 {area}
  </div>
</div>
  ))}
</div>

{/* 🔥 EXPANDED AREA DETAILS */}
{selectedArea && (
  <div className="area-details">
    <h3>Complaints in {selectedArea}</h3>

    {areaGroups[selectedArea].map(c => (
      <div key={c._id} className={`complaint-box flex-box ${c.priority === "High" ? "high-priority" : ""}`}>
        
        {c.image && (
          <img
            src={`http://127.0.0.1:8000/images/${c.image}`}
            alt="Complaint"
            className="complaint-img"
          />
        )}

        <div className="complaint-details">
          <p><b>User:</b> {c.user_email}</p>
          <p><b>Location:</b> {c.location}</p>
          <p><b>Description:</b> {c.description}</p>
          <p><b>Priority:</b> {c.priority}</p>
          <p><b>Status:</b> {c.status}</p>

          <select
            value={c.status}
            onChange={(e) => updateStatus(c._id, e.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>
    ))}
  </div>
)}
            </>
          )}

          

          {activeTab === "analytics" && (
            <>
              <div className="kpi-container">
                <div className="kpi-card"><h3>Total Complaints</h3><p>{totalComplaints}</p></div>
                <div className="kpi-card"><h3>Pending</h3><p>{pendingCount}</p></div>
                <div className="kpi-card"><h3>Resolved</h3><p>{resolvedCount}</p></div>
                <div className="kpi-card"><h3>Resolution Rate</h3><p>{resolutionRate}%</p></div>
              </div>

              <div className="chart-container"><h3>Department-wise Complaints</h3><Bar data={deptChartData} /></div>
              <div className="pie-row">
                <div className="chart-box"><h3>Status Distribution</h3><Pie data={statusChartData} /></div>
                <div className="chart-box"><h3>Priority Distribution</h3><Pie data={priorityChartData} /></div>
              </div>

              <h2>Citizen Feedback Insights</h2>
              <div className="kpi-container">
                <div className="kpi-card"><h3>Total Feedback</h3><p>{totalFeedback}</p></div>
                <div className="kpi-card"><h3>Average Rating</h3><p>⭐ {avgRating}</p></div>
              </div>

              <div className="chart-container"><h3>Rating Distribution</h3><Bar data={ratingChartData} /></div>
              <div className="pie-row">
  <div className="chart-box">
    <h3>Feedback Sentiment Analysis</h3>
    <Pie data={sentimentChartData} />
  </div>
</div>

             
  <div className="feedback-dropdown">
  <button
    className="feedback-header"
    onClick={() => setShowFeedback(prev => !prev)}
  >
    Recent Feedback {showFeedback ? "▲" : "▼"}
  </button>

  {showFeedback && (
    <div className="feedback-content">
      {feedbacks
        .filter(fb => fb.comments && fb.comments.trim() !== "")
        .slice(-5)
        .reverse()
        .map((fb, i) => (
          <div key={i} className="complaint-box flex-box">
            <div className="complaint-details">
              <p>
                <b>Sentiment:</b>{" "}
                <span className={`feedback-${fb.sentiment.toLowerCase()}`}>
                  {fb.sentiment}
                </span>
              </p>
              <p><b>Comment:</b> {fb.comments}</p>
            </div>
          </div>
        ))}
    </div>
  )}
</div>
            </>
          )}
        </main>

      {activeTab === "home" && (
          <div className="notification-panel">
            {notifications.map(n => (
              <div key={n._id} className={`notification ${n.priority === "High" ? "high-priority" : ""}`}>
                <p><b>{n.priority} Priority:</b> {n.description}</p>
                <p><small>{n.user_email}</small></p>
              </div>
            ))}
          </div>
        )} 
      </div>

      <footer className="footer">
        <p>© 2026 AI CityServe | Admin Panel</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;

