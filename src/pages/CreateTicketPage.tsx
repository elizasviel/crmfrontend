import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateTicketPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:3000/api/tickets",
        {
          title,
          description,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/tickets");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAnalyzeTicket = async () => {
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/ai/analyze-ticket",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiSuggestions(response.data);
      setPriority(response.data.priority);
    } catch (err) {
      setError("Failed to analyze ticket");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card create-ticket-form">
        <div className="form-header">
          <h1>Create Support Ticket</h1>
          <p className="text-muted">
            Please provide detailed information about your issue to help us
            assist you better
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="form-container" onSubmit={handleCreateTicket}>
          <div className="form-grid">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <div className="input-group">
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(evt) => setTitle(evt.target.value)}
                    placeholder="Brief summary of the issue"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <div className="input-group">
                  <textarea
                    id="description"
                    rows={8}
                    value={description}
                    onChange={(evt) => setDescription(evt.target.value)}
                    placeholder="Please provide detailed information about your issue..."
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority Level</label>
                <div className="input-group">
                  <select
                    id="priority"
                    value={priority}
                    onChange={(evt) => setPriority(evt.target.value)}
                  >
                    <option value="LOW">Low - Minor issue, no urgency</option>
                    <option value="MEDIUM">Medium - Standard priority</option>
                    <option value="HIGH">High - Urgent issue</option>
                    <option value="URGENT">Urgent - Critical issue</option>
                  </select>
                </div>
              </div>
            </div>

            {aiSuggestions && (
              <div className="ai-suggestions-panel">
                <h3>
                  <span className="ai-icon">🤖</span> AI Analysis Results
                </h3>
                <div className="suggestions-content">
                  <div className="suggestion-item">
                    <span className="suggestion-label">
                      Suggested Priority:
                    </span>
                    <span
                      className={`badge priority-badge priority-${aiSuggestions.priority}`}
                    >
                      {aiSuggestions.priority}
                    </span>
                  </div>
                  {aiSuggestions.category && (
                    <div className="suggestion-item">
                      <span className="suggestion-label">Category:</span>
                      <span className="suggestion-value">
                        {aiSuggestions.category}
                      </span>
                    </div>
                  )}
                  {aiSuggestions.team && (
                    <div className="suggestion-item">
                      <span className="suggestion-label">Suggested Team:</span>
                      <span className="suggestion-value">
                        {aiSuggestions.team}
                      </span>
                    </div>
                  )}
                  {aiSuggestions.estimatedTime && (
                    <div className="suggestion-item">
                      <span className="suggestion-label">
                        Est. Resolution Time:
                      </span>
                      <span className="suggestion-value">
                        {aiSuggestions.estimatedTime} hours
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleAnalyzeTicket}
              disabled={!title || !description || isAnalyzing}
              className="button button-secondary"
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="icon">🤖</span>
                  Analyze with AI
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="button button-primary"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                "Create Ticket"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicketPage;
