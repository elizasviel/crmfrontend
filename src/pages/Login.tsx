import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/tickets");
    }
  }, [isLoggedIn, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://crmbackendnorman-85f274ff87d9.herokuapp.com/api/users/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/tickets");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1>Login</h1>
        <form className="form-container" onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
