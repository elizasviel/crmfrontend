import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        {
          email,
          password,
          firstName,
          lastName,
        }
      );

      // Optionally navigate to login on success
      // or automatically log the user in if you wish
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="card">
      <h1>Register</h1>
      <form className="form-container" onSubmit={handleRegister}>
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
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(evt) => setFirstName(evt.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(evt) => setLastName(evt.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
