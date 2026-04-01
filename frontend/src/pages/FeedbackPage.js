
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeedbackPage.css";

function FeedbackPage() {
  const navigate = useNavigate();

  const [feedbackData, setFeedbackData] = useState({
  service_quality: 0,
  response_time: 0,
  ease_of_use: 0,
  overall_experience: 0,
  satisfaction: "",
  comments: "",
  anonymous: false,
  complaint_id: ""   // ✅ ADD THIS
});

  const [showMessage, setShowMessage] = useState(false);

  const handleStarClick = (field, value) => {
    setFeedbackData({
      ...feedbackData,
      [field]: value
    });
  };

  const renderStars = (field) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={feedbackData[field] >= star ? "star active" : "star"}
        onClick={() => handleStarClick(field, star)}
      >
        ★
      </span>
    ));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Get complaint_id (you MUST have this stored somewhere)
  const complaintId = localStorage.getItem("complaint_id");

  // ✅ Create updated data with complaint_id
  const updatedData = {
    ...feedbackData,
    complaint_id: complaintId
  };

  try {
    const response = await fetch("http://localhost:8000/feedback/submit-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)   // ✅ send correct data
    });

    const data = await response.json();

    console.log("Response:", data);  // ✅ helpful for debugging

    // ❗ Optional: check if backend returned error
    if (!response.ok) {
      console.error("Backend error:", JSON.stringify(data, null, 2));
      return;
    }

    setShowMessage(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

  } catch (error) {
    console.error("Error submitting feedback:", error);
  }
};
  return (
    
    <div className="feedback-container">

      <header className="feedback-header">
        <h1>AI CityServe</h1>
        <p>Your feedback helps improve city services</p>
      </header>

      <div className="feedback-page">

        {showMessage ? (
          <div className="feedback-success">
            <h3>✅ Thank You!</h3>
            <p>We appreciate your feedback.</p>
          </div>
        ) : (
          <form className="feedback-form" onSubmit={handleSubmit}>

            <h2>Feedback Form</h2>

            <div className="rating-row">
              <span className="rating-label">Service Quality</span>
              <div className="stars">{renderStars("service_quality")}</div>
            </div>

            <div className="rating-row">
              <span className="rating-label">Response Time</span>
              <div className="stars">{renderStars("response_time")}</div>
            </div>

            <div className="rating-row">
              <span className="rating-label">Ease of Use</span>
              <div className="stars">{renderStars("ease_of_use")}</div>
            </div>

            <div className="rating-row">
              <span className="rating-label">Overall Experience</span>
              <div className="stars">{renderStars("overall_experience")}</div>
            </div>

            <h3 className="feedback-section">Overall Satisfaction</h3>

            <div className="emoji-row">
              {[
                { icon: "😡", label: "Poor" },
                { icon: "😐", label: "Average" },
                { icon: "🙂", label: "Good" },
                { icon: "😃", label: "Excellent" }
              ].map((item) => (
                <div
                  key={item.label}
                  className={
                    feedbackData.satisfaction === item.label
                      ? "emoji-card selected"
                      : "emoji-card"
                  }
                  onClick={() =>
                    setFeedbackData({
                      ...feedbackData,
                      satisfaction: item.label
                    })
                  }
                >
                  <span className="emoji-icon">{item.icon}</span>
                  <span className="emoji-text">{item.label}</span>
                </div>
              ))}
            </div>

            <label>
              Additional Comments
              <textarea
                value={feedbackData.comments}
                onChange={(e) =>
                  setFeedbackData({
                    ...feedbackData,
                    comments: e.target.value
                  })
                }
              />
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={feedbackData.anonymous}
                onChange={(e) =>
                  setFeedbackData({
                    ...feedbackData,
                    anonymous: e.target.checked
                  })
                }
              />
              Submit anonymously
            </label>

            <button type="submit">Submit Feedback</button>

          </form>
        )}

      </div>

      <footer className="feedback-footer">
        © 2026 AI CityServe
      </footer>

    </div>
  );
}

export default FeedbackPage;

