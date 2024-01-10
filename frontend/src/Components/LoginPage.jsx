import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import "../style.css"; 

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
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
      console.log(data)
      if (response.ok) {
        // Login successful
        alert("Login successful!");
        navigate("/home");
        Cookies.set('authToken', data.authToken);
      } else {
        // Login failed
        if (data.message === "Invalid credentials") {
          alert("Invalid credentials. Please check your username and password.");
        } else {
          alert("Login failed. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed. Please try again later.");
    }
  };

  return (
    <div className="login-container">
    <div className="login-form">
      <h1>Login</h1>

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
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>

      <br />
      <p>OR</p>
      <br />

      <Link to="/signup">Signup Page</Link>
      </div>
    </div>
  );
}

export default LoginPage;
