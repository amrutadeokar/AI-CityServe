import { useEffect, useState } from "react";
import axios from "axios";
import "./MyComplaints.css";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem("token");
  

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/complaints/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data);
      } catch (err) {
        alert("Failed to fetch complaints");
      }
    };

    fetchComplaints();
  }, [token]);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="page-header">
        <h1>City Complaints Portal</h1>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/complaint">File Complaint</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="content">
        <h2>My Complaints</h2>

        {complaints.length === 0 && <p>No complaints found.</p>}

        {complaints.map((c, idx) => (
          <div key={idx} className="complaint-card">
            {c.image && (
              <img
                src={`http://127.0.0.1:8000/images/${c.image}`}
                alt="Complaint"
                className="complaint-img"
              />
            )}

            <div className="complaint-details">
              <div className="detail-row">
                <span className="label">Department:</span>
                <span className="value">{c.department}</span>
              </div>

              <div className="detail-row">
                <span className="label">Location:</span>
                <span className="value">{c.location}</span>
              </div>

              <div className="detail-row">
                <span className="label">Description:</span>
                <span className="value">{c.description}</span>
              </div>

              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`status ${c.status.toLowerCase()}`}>
                  {c.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="page-footer">
        <p>© 2026 City Complaints Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MyComplaints;