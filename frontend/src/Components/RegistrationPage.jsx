import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style.css";

function RegistrationPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistration = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Registration successful
        alert("Registration successful!");
        navigate("/");
      } else {
        // Registration failed
        if (data.message === "User already exists") {
          alert("User already registered. Please login.");
          navigate("/");
        } else if (
          data.message ===
            "Invalid username format, username is at least 3 characters long" ||
          data.message ===
            "Invalid password format, Password is at least 6 characters long and includes at least one uppercase letter, one lowercase letter, and one digit, and one special character"
        ) {
          alert("Wrong username or password. Please check your credentials.");
        } else {
          alert("Registration failed. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
      alert("Registration failed. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Signup</h1>
        <form>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </label>
          <button type="button" onClick={handleRegistration}>
            Register
          </button>
        </form>
        <p>OR</p>
        <Link to="/">Login Page</Link>
      </div>
    </div>
  );
}

export default RegistrationPage;