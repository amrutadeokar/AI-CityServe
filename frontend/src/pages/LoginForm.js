import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleSelection, setRoleSelection] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!roleSelection) {
      alert("Please select a role: User or Admin");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const backendRole = (response.data.role || roleSelection).toLowerCase();

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", backendRole);
      localStorage.setItem("department", response.data.department || "");

      alert("Login Successful!");

      if (backendRole === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      alert(err.response?.data?.detail || "Invalid Credentials");
    }
  };

  return (
    <div className="login-form-page">

      {/* Header */}
      <header className="nav-bar">
        <div className="logo">🏙 Smart City Complaint Portal</div>
        <button
          className="home-btn"
          onClick={() => navigate("/")} // redirect to landing page
        >
          Home
        </button>
      </header>

      {/* Login Section */}
      <div className="login-container">
        <div className="login-card">

          <h2>Login</h2>

          <div className="role-buttons">
            <button
              className={roleSelection === "user" ? "active" : ""}
              onClick={() => setRoleSelection("user")}
            >
              User
            </button>

            <button
              className={roleSelection === "admin" ? "active" : ""}
              onClick={() => setRoleSelection("admin")}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="login-links">
            <a href="#">Forgot Password?</a>
            <p>
              Don’t have an account?{" "}
              <span
                className="register-link"
                onClick={() => navigate("/register-form")}
              >
                Register
              </span>
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        © 2026 Smart City Portal | All Rights Reserved
      </footer>

    </div>
  );
}

export default LoginForm;