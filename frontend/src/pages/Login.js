import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Services from "./Services";
import ChatBot from "./ChatBot/ChatBot";

function Login() {
  const [showPopup, setShowPopup] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [language, setLanguage] = useState("en");

  const [userLocation, setUserLocation] = useState("");
  const [coords, setCoords] = useState(null);

  const navigate = useNavigate();

   useEffect(() => {
  if (showSOS) {
    setCoords(null); // reset old location
    setUserLocation("Detecting location...");
    getLocation(); // call location AFTER popup opens
  }
}, [showSOS]);

  const getLocation = () => {
  setUserLocation("Detecting location...");

  if (!navigator.geolocation) {
    setUserLocation("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setCoords({ lat, lng });

      setUserLocation(`Lat: ${lat}, Lng: ${lng}`);

      try {
        const res = await fetch(
  `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
);
        const data = await res.json();

        if (data?.display_name) {
          setUserLocation(data.display_name);
        }
      } catch (error) {
        console.log("Address fetch failed");
      }
    },
    () => {
      setUserLocation("Location permission denied");
    }
  );
};
 

  return (
    <div className="login-page">
      <nav className="nav-bar">
        <div className="nav-left">
          <h1>AI CityServe</h1>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a onClick={() => navigate("/get-to-know")} style={{ cursor: "pointer" }}>
            GetToKnow
          </a>
          <a onClick={() => navigate("/activities")} style={{ cursor: "pointer" }}>
            Activities
          </a>
          <div className="dropdown">
            <span>Search ▼</span>
          </div>
          <button className="profile-btn" onClick={() => setShowPopup(true)}>
            Profile ▼
          </button>
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <h2>Smart City Services at Your Fingertips</h2>
          <p>Find Trusted Services Near You</p>
          <div className="search-bar">
            <input type="text" placeholder="Search for services" />
            <button className="search-btn">Search</button>
          </div>
        </section>

        <div className="dashboard-container">
          <div className="white-card-container">
            <Services />
          </div>

          <div className="info-wrapper">
            <div className="info-grid">
              <div className="info-card" onClick={() => navigate("/feedback")} style={{ cursor: "pointer" }}>
                <div className="info-icon blue-circle">💬</div>
                <div className="info-text">
                  <h3>Feedback</h3>
                  <p>Receive feedback to improve services.</p>
                </div>
              </div>

              <div className="info-card" onClick={() => navigate("/get-to-know")} style={{ cursor: "pointer" }}>
                <div className="info-icon blue-circle">i</div>
                <div className="info-text">
                  <h3>About</h3>
                  <p>AI CityServe connects citizens with trusted services.</p>
                </div>
              </div>

              <div className="info-card" onClick={() => navigate("/announcements")} style={{ cursor: "pointer" }}>
                <div className="info-icon blue-circle">📣</div>
                <div className="info-text">
                  <h3>Latest Announcements</h3>
                  <p>Stay updated with municipal updates and notices.</p>
                </div>
              </div>

              <div className="info-card" onClick={() => navigate("/help")} style={{ cursor: "pointer" }}>
                <div className="info-icon blue-circle">⚙️</div>
                <div className="info-text">
                  <h3>Help & Support</h3>
                  <p>Help answers and experience issues.</p>
                </div>
              </div>

              <button className="chat-bar-full" onClick={() => setShowChat(true)}>
                <span>💬</span> Chat With Us
              </button>
            </div>
          </div>
        </div>
      </main>

      {showPopup && ( <div className="popup-overlay" onClick={() => setShowPopup(false)}> <div className="popup-box" onClick={(e) => e.stopPropagation()}> {/* Close Button */} <span className="popup-close" onClick={() => setShowPopup(false)}> &times; </span> {/* Icon */} <div className="popup-icon">🌆</div> {/* Title */} <h2>Together, Let's Engage In Good Governance</h2> {/* Subtitle */} <p>Join the platform to raise issues, track progress, and make your city better.</p> {/* Buttons */} <div className="popup-actions"> <button className="popup-btn primary" onClick={() => navigate("/login-form")} > Login </button> <button className="popup-btn secondary" onClick={() => navigate("/register-form")} > Register </button> </div> </div> </div> )}


      {showChat && <ChatBot onClose={() => setShowChat(false)} />}

      <button
        className="sos-button"
        onClick={() => setShowSOS(true)}
      >
        🚨 SOS
      </button>

  
      {showSOS && (
        <div className="sos-overlay" onClick={() => setShowSOS(false)}>
          <div className="sos-popup" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setShowSOS(false)}>
              &times;
            </span>

            <h3>🚨 Emergency Contacts</h3>

            <div className="sos-item">🚓 Police: <a href="tel:100">100</a></div>
            <div className="sos-item">🚑 Ambulance: <a href="tel:102">102</a></div>
            <div className="sos-item">🔥 Fire: <a href="tel:101">101</a></div>

            <hr />

            <p><b>📍 Your Location:</b></p>
            <p className="user-location">
              {userLocation || "Detecting..."}
            </p>

           <a
  href={coords ? `https://www.google.com/maps/search/police+station+near+${coords.lat},${coords.lng}` : "#"}
  target="_blank"
  rel="noreferrer"
  className="sos-link"
  onClick={(e) => {
    if (!coords) {
      e.preventDefault();
      alert("Fetching location... please wait");
    }
  }}
  style={{
    opacity: coords ? 1 : 0.6,
    cursor: coords ? "pointer" : "not-allowed"
  }}
>
  🚓 {coords ? "Find Nearby Police Station" : "Getting location..."}
</a>

<button
  className="share-btn"
  disabled={!coords}
  onClick={async () => {
    if (!coords) {
      alert("Location not ready yet");
      return;
    }
    const link = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Location link copied!");
    } catch (err) {
      alert("Failed to copy location");
    }
  }}
>
  📤 {coords ? "Share My Location" : "Getting location..."}
</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
