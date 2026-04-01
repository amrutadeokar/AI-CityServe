
import { useState, useEffect, useRef } from "react";
import "./ChatBot.css";

function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Welcome to AI CityServe Support. How can I assist you today?" }
  ]);
  const [options, setOptions] = useState([]);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const showMainOptions = () => {
    if (!token) {
      setOptions([
        { label: "How to register?", action: "faq_register" },
        { label: "Available Services", action: "faq_services" },
        { label: "Contact Support", action: "contact_support" },
        { label: "Give Feedback", action: "feedback" },
        { label: "Other Issue", action: "other_issue" },
        { label: "End Chat", action: "end_chat" },
        { label: "Get Helpline Number", action: "get_helpline" }
      ]);
    } else {
      setOptions([
        { label: "My Complaints", action: "listComplaints" },
        { label: "File a Complaint", action: "newComplaint" },
        { label: "General Help", action: "generalHelp" },
        { label: "Give Feedback", action: "feedback" },
        { label: "Other Issue", action: "other_issue" },
        { label: "End Chat", action: "end_chat" },
        { label: "Get Helpline Number", action: "get_helpline" }
      ]);
    }
  };

  const askMoreHelp = () => {
    setMessages(prev => [...prev, { from: "bot", text: "Do you want any other help?" }]);
    setOptions([
      { label: "Yes", action: "showMainOptions" },
      { label: "No", action: "end_chat" }
    ]);
  };

  useEffect(() => {
    const timer = setTimeout(() => showMainOptions(), 300);
    return () => clearTimeout(timer);
  }, [token]);

  const handleAction = (action, label) => {
    setMessages(prev => [...prev, { from: "user", text: label }]);
    setOptions([]);

    // ===== Contact Support works for everyone =====
    if (action === "contact_support") {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "You can reach our support team:" },
        { from: "bot", text: "📞 Call: 1860-12383-458" },
        { from: "bot", text: "📧 Email: support@cityserve.com" },
        { from: "bot", text: "Support is available 24/7." }
      ]);
      askMoreHelp();
      return;
    }

    // Non-logged-in FAQ/help
    if (!token && action.startsWith("faq")) {
      switch(action) {
        case "faq_register":
          setMessages(prev => [
            ...prev,
            { from: "bot", text: "Step 1: Click the 'Profile' button on the top right." },
            { from: "bot", text: "Step 2: Click 'Register' from the dropdown menu." },
            { from: "bot", text: "Step 3: Fill in your Name, Email, Phone, and Password." },
            { from: "bot", text: "Step 4: Click 'Submit' to complete registration." },
            { from: "bot", text: "Registration successful! 🎉" }
          ]);
          askMoreHelp();
          return;

        case "faq_services":
          setMessages(prev => [
            ...prev,
            { from: "bot", text: "We provide the following services:" },
            { from: "bot", text: "1. Water supply and management" },
            { from: "bot", text: "2. Sanitation and waste management" },
            { from: "bot", text: "3. Road maintenance and traffic management" },
            { from: "bot", text: "4. Electricity supply issues" },
            { from: "bot", text: "5. Health facilities and programs" },
            { from: "bot", text: "6. Education support services" }
          ]);
          askMoreHelp();
          return;
      }
    }

    // Complaint actions require login
    if (!token && (action === "listComplaints" || action === "newComplaint")) {
      setMessages(prev => [...prev, { from: "bot", text: "Please login to access complaints." }]);
      askMoreHelp();
      return;
    }

    // Logged-in or main actions
    switch(action) {
      case "listComplaints":
        wsRef.current = new WebSocket(`ws://localhost:8000/complaints/ws/complaints?token=${token}`);
        wsRef.current.onopen = () => wsRef.current.send("get_complaints");
        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.length > 0) {
            setMessages(prev => [...prev, { from: "bot", text: "Here are your recent complaints:" }]);
            setOptions(data.map(c => ({
              label: `${c.title} (${c.status})`,
              action: "none",
              image: c.image ? `http://127.0.0.1:8000/images/${c.image}` : null
            })));
          } else {
            setMessages(prev => [...prev, { from: "bot", text: "No active complaints found." }]);
          }
          askMoreHelp();
        };
        wsRef.current.onerror = (err) => {
          console.error(err);
          setMessages(prev => [...prev, { from: "bot", text: "Unable to connect to server." }]);
          askMoreHelp();
        };
        break;

      case "newComplaint":
        setMessages(prev => [...prev, { from: "bot", text: "To file a complaint, go to the 'File Complaint' page and fill the required details." }]);
        askMoreHelp();
        break;

      case "generalHelp":
        setMessages(prev => [...prev, { from: "bot", text: "You can view your complaints or file a new one here." }]);
        askMoreHelp();
        break;

      case "feedback":
        setMessages(prev => [...prev, { from: "bot", text: "We value your feedback! Please visit the Feedback page or email us at feedback@cityserve.com." }]);
        askMoreHelp();
        break;

      case "other_issue":
        setMessages(prev => [...prev, { from: "bot", text: "For other issues, please describe your problem on the Contact page or call support." }]);
        askMoreHelp();
        break;

      case "get_helpline":
        setMessages(prev => [...prev, { from: "bot", text: "You can reach our helpline at 1860-12383-458. Available 24/7." }]);
        askMoreHelp();
        break;

      case "end_chat":
  setMessages(prev => [...prev, { from: "bot", text: "Thank you for chatting with AI CityServe Support. Have a great day!" }]);
  setOptions([]);
  // Close the chatbot window automatically after a short delay
  setTimeout(() => {
    onClose();
  }, 500); // 0.5s delay to let the last message show
  break;

      case "showMainOptions":
        showMainOptions();
        break;

      default:
        askMoreHelp();
    }
  };

  return (
    <div className="chatbot-window">
      <div className="chat-header">
        <span>AI CityServe Support</span>
        <button className="close-chat" onClick={onClose}>&times;</button>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-container ${msg.from}`}>
            <div className={`msg-bubble ${msg.from}`}>
              {msg.text}
              {msg.image && <img src={msg.image} alt="Complaint" style={{ marginTop: '8px', maxWidth: '200px', borderRadius: '8px' }} />}
            </div>
          </div>
        ))}

        <div className="options-container">
          {options.map((opt, i) => (
            <button key={i} className="chat-btn" onClick={() => handleAction(opt.action, opt.label)}>
              {opt.label}
            </button>
          ))}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatBot;