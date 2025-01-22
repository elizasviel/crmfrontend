import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateTicketPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM"); // default
  const [error, setError] = useState("");

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:3000/api/tickets",
        { title, description, priority },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/tickets");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create ticket");
    }
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1>Create Ticket</h1>
        {error && <div className="error-message">{error}</div>}
        <form className="form-container" onSubmit={handleCreateTicket}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(evt) => setDescription(evt.target.value)}
              required
            />
          </div>
          <div>
            <label>Priority</label>
            <select
              value={priority}
              onChange={(evt) => setPriority(evt.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}

export default CreateTicketPage;
