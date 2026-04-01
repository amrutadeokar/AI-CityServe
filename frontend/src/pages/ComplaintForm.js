// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./ComplaintForm.css";
// import LocationPicker from "./LocationPicker";
// import { FaMapMarkerAlt } from "react-icons/fa";

// function ComplaintForm() {
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");
//   const [image, setImage] = useState(null);
//   const [showMapModal, setShowMapModal] = useState(false);
//   const mapRef = useRef(null);
//   const navigate = useNavigate();
//   const [category, setCategory] = useState("");
// const [priority, setPriority] = useState("");
// const [showResult, setShowResult] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) return alert("You are not logged in!");
//     if (!location) return alert("Please select a location!");

//     const formData = new FormData();
//     formData.append("description", description);
//     formData.append("location", location);
//     formData.append("image", image);

//    try {
//   const response = await axios.post(
//     "http://127.0.0.1:8000/complaints/create",
//     formData,
//     { headers: { Authorization: `Bearer ${token}` } }
//   );

//   // ✅ Get AI results from backend
//   setCategory(response.data.category || "General");
//   setPriority(response.data.priority || "Medium");

//   // ✅ Show result card
//   setShowResult(true);


// }  catch (error) {
//       console.error(error.response || error);
//       alert(error.response?.data?.detail || "Error submitting complaint");
//     }
//   };

//   // Trigger map resize after modal opens
//   useEffect(() => {
//     if (showMapModal && mapRef.current?.map) {
//       setTimeout(() => {
//         window.google?.maps.event.trigger(mapRef.current.map, "resize");
//       }, 200);
//     }
//   }, [showMapModal]);

//   return (
//     <div className="page-wrapper">
//       <header>
//         <h1>City Complaints Portal</h1>
//         <nav>
//           <a href="/">Home</a>
//           <a href="/dashboard">Dashboard</a>
//         </nav>
//       </header>

//       <main className="content">
//         <div className="form-container">
//           <h2>File a Complaint</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="location-input-wrapper">
//               <input
//                 type="text"
//                 placeholder="Enter location manually"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 required
//               />
//               <FaMapMarkerAlt
//                 className="location-icon"
//                 onClick={() => setShowMapModal(true)}
//                 title="Pick location on map"
//               />
//             </div>

//             {showMapModal && (
//               <div className="map-modal">
//                 <div className="map-modal-content">
//                   <button
//                     className="close-modal"
//                     onClick={() => setShowMapModal(false)}
//                   >
//                     &times;
//                   </button>
//                   <LocationPicker
//                     ref={mapRef}
//                     setLocation={(addr) => {
//                       setLocation(addr);
//                       setShowMapModal(false);
//                     }}
//                   />
//                 </div>
//               </div>
//             )}

//             <textarea
//               placeholder="Describe the issue"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//             />
//             <input
//               type="file"
//               onChange={(e) => setImage(e.target.files[0])}
//               required
//             />
//             <button type="submit">Submit Complaint</button>
//           </form>
//           {showResult && (
//   <div className="ai-result-card">

//     {/* ❌ Close Button */}
//     <span 
//       className="close-btn"
//       onClick={() => setShowResult(false)}
//     >
//       ✖
//     </span>

//     <h3>🧠 AI Analysis Result</h3>

//     <div className="result-row">
//       <span>Category:</span>
//       <span className={`badge category ${category.toLowerCase()}`}>
//         {category}
//       </span>
//     </div>

//     <div className="result-row">
//       <span>Priority:</span>
//       <span className={`badge priority ${priority.toLowerCase()}`}>
//         {priority}
//       </span>
//     </div>

//     <div className="ai-insight">
//       💡 This issue is related to <b>{category}</b> and requires 
//       <b> {priority}</b> attention.
//     </div>

//     {image && (
//       <div className="result-image">
//         <p>📸 Uploaded Evidence:</p>
//         <img src={URL.createObjectURL(image)} alt="complaint" />
//       </div>
//     )}

//     {/* ✅ Continue Button */}
//     <button 
//       className="go-dashboard-btn"
//       onClick={() => navigate("/dashboard")}
//     >
//       Go to Dashboard →
//     </button>

//   </div>
// )}
//         </div>
//       </main>

//       <footer>
//         &copy; 2026 City Complaints Portal. All rights reserved.
//       </footer>
//     </div>
//   );
// }

// export default ComplaintForm;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ComplaintForm.css";
import LocationPicker from "./LocationPicker";
import { FaMapMarkerAlt } from "react-icons/fa";

function ComplaintForm() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  // ✅ UPDATED STATES
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("");
  const [showResult, setShowResult] = useState(false);

  const mapRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("You are not logged in!");
    if (!location) return alert("Please select a location!");

    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", location);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/complaints/create",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Use department (correct logic)
      setDepartment(response.data.department || "Not Assigned");
      setPriority(response.data.priority || "Medium");

      // ✅ Show popup
      setShowResult(true);

    } catch (error) {
      console.error(error.response || error);
      alert(error.response?.data?.detail || "Error submitting complaint");
    }
  };

  useEffect(() => {
    if (showMapModal && mapRef.current?.map) {
      setTimeout(() => {
        window.google?.maps.event.trigger(mapRef.current.map, "resize");
      }, 200);
    }
  }, [showMapModal]);

  return (
    <div className="page-wrapper">
      <header>
        <h1>City Complaints Portal</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
      </header>

      <main className="content">
        <div className="form-container">
          <h2>File a Complaint</h2>

          <form onSubmit={handleSubmit}>
            <div className="location-input-wrapper">
              <input
                type="text"
                placeholder="Enter location manually"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <FaMapMarkerAlt
                className="location-icon"
                onClick={() => setShowMapModal(true)}
                title="Pick location on map"
              />
            </div>

            {showMapModal && (
              <div className="map-modal">
                <div className="map-modal-content">
                  <button
                    className="close-modal"
                    onClick={() => setShowMapModal(false)}
                  >
                    &times;
                  </button>
                  <LocationPicker
                    ref={mapRef}
                    setLocation={(addr) => {
                      setLocation(addr);
                      setShowMapModal(false);
                    }}
                  />
                </div>
              </div>
            )}

            <textarea
              placeholder="Describe the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />

            <button type="submit">Submit Complaint</button>
          </form>
        </div>
      </main>

      {/* ✅ AI RESULT POPUP */}
      {showResult && (
        <div className="result-overlay" onClick={() => setShowResult(false)}>
          <div
            className="result-popup"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <span
              className="close-btn"
              onClick={() => setShowResult(false)}
            >
              &times;
            </span>

            <h3>🧠 AI Analysis Result</h3>

            <div className="result-row">
              <span>Department:</span>
              <span className="badge category">
                {department}
              </span>
            </div>

            <div className="result-row">
              <span>Priority:</span>
              <span className={`badge priority ${priority.toLowerCase()}`}>
                {priority}
              </span>
            </div>

            <div className="ai-insight">
              💡 This issue has been assigned to <b>{department}</b> and requires 
              <b> {priority}</b> attention.
            </div>

            {image && (
              <div className="result-image">
                <p>📸 Uploaded Evidence:</p>
                <img
                  src={URL.createObjectURL(image)}
                  alt="complaint"
                />
              </div>
            )}

            <button
              className="go-dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      )}

      <footer>
        &copy; 2026 City Complaints Portal. All rights reserved.
      </footer>
    </div>
  );
}

export default ComplaintForm;