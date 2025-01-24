import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateTicketPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM"); // default
  const [aiSuggestions, setAiSuggestions] = useState(null);
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
        "https://crmbackendnorman-85f274ff87d9.herokuapp.com/api/tickets",
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

  const handleAnalyzeTicket = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://crmbackendnorman-85f274ff87d9.herokuapp.com/api/ai/analyze-ticket",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiSuggestions(response.data);
      setPriority(response.data.priority);
    } catch (err) {
      setError("Failed to analyze ticket");
    }
  };

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

        <button
          type="button"
          onClick={handleAnalyzeTicket}
          disabled={!title || !description}
        >
          Analyze with AI
        </button>

        {aiSuggestions && (
          <div className="ai-suggestions">
            <h3>AI Suggestions</h3>
            <p>Suggested Priority: {aiSuggestions.priority}</p>
            <p>Category: {aiSuggestions.category}</p>
            <p>Suggested Team: {aiSuggestions.team}</p>
            <p>Est. Resolution Time: {aiSuggestions.estimatedTime}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateTicketPage;
