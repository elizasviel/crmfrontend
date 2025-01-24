import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/tickets");
    }
  }, [isLoggedIn, navigate]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Register new user
      await axios.post(
        "https://crmbackendnorman-85f274ff87d9.herokuapp.com/api/users/register",
        {
          email,
          password,
          firstName,
          lastName,
          role,
        }
      );
      // Immediately login
      const loginResponse = await axios.post(
        "https://crmbackendnorman-85f274ff87d9.herokuapp.com/api/users/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", loginResponse.data.token);
      navigate("/tickets");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1>Register</h1>
        <form className="form-container" onSubmit={handleRegister}>
          {error && <div className="error-message">{error}</div>}
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Role (Development Only)</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="CUSTOMER">Customer</option>
              <option value="AGENT">Agent</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
