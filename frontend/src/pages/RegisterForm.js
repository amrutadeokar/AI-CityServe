// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./RegisterForm.css";

// function RegisterForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/auth/register", {
//         email,
//         password,
//       });
//       alert("Registration Successful!");
//       navigate("/login-form");
//     } catch (err) {
//       alert(err.response?.data?.detail || "Registration Failed");
//     }
//   };

//   return (
//     <div className="register-card">
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit" className="register-btn">Register</button>
//       </form>
//       <p>
//         Already have an account?{" "}
//         <span className="login-link" onClick={() => navigate("/login-form")}>
//           Login
//         </span>
//       </p>
//     </div>
//   );
// }

// export default RegisterForm;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterForm.css";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/register",
        {
          email,
          password,
        }
      );

      setSuccessMessage("Registration Successful!");

      // Redirect after 1 second
      setTimeout(() => {
        navigate("/login-form");
      }, 1000);

    } catch (err) {
      console.log("Register Error:", err.response?.data);

      const message =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail?.msg ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Registration Failed";

      setErrorMessage(message);
    }
  };

  return (
    <div className="register-card">
      <h2>Register</h2>

      {/* ✅ Success Message */}
      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}

      {/* ✅ Error Message */}
      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      <form onSubmit={handleRegister}>
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

        <button type="submit" className="register-btn">
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <span
          className="login-link"
          onClick={() => navigate("/login-form")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default RegisterForm;