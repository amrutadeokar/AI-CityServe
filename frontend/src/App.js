import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import GetToKnowPage from "./pages/GetToKnowPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ComplaintForm from "./pages/ComplaintForm";
import HelpPage from "./pages/HelpPage";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import MyComplaints from "./pages/MyComplaints";
import Settings from "./pages/Settings";
import ChatPage from "./pages/ChatBot/ChatPage";
import FeedbackPage from "./pages/FeedbackPage";


// ✅ Protected Route
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Login />} />

        {/* Login Page */}
        <Route path="/login-form" element={<LoginForm />} />

         <Route path="/get-to-know" element={<GetToKnowPage />} />

         <Route path="/activities" element={<ActivitiesPage />} />

         <Route path="/announcements" element={<AnnouncementsPage />} />

         <Route path="/help" element={<HelpPage />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Complaint Form */}
        <Route
          path="/complaint"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ComplaintForm />
            </ProtectedRoute>
          }
        />

        {/* My Complaints */}
        <Route
          path="/mycomplaints"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyComplaints />
            </ProtectedRoute>
          }
        />

        {/* Register */}
        <Route path="/register-form" element={<RegisterForm />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

        {/* Chatbot */}
        <Route path="/chat" element={<ChatPage />} />

        {/* Feedback */}
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;