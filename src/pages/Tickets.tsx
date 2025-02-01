import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: User;
  createdBy: User;
  commentCount: number;
  category?: string;
  estimatedTime?: number;
  dueDate?: string;
}

function TicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    teamId: "",
    assignedToId: "",
  });

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `https://crmbackendnorman-85f274ff87d9.herokuapp.com/api/tickets/search?query=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            ...filters,
            query: searchQuery,
          },
        }
      );

      setTickets(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to search tickets");
    }
  };

  useEffect(() => {
    async function fetchTickets() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "https://crmbackendnorman-85f274ff87d9.herokuapp.com/api/tickets",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!Array.isArray(response.data)) {
          throw new Error(
            "Invalid response format: Expected an array of tickets"
          );
        }
        setTickets(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to fetch tickets");
      }
    }
    fetchTickets();
  }, [navigate]);

  const searchForm = (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search tickets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Statuses</option>
        <option value="OPEN">Open</option>
        <option value="CLOSED">Closed</option>
        <option value="PENDING">Pending</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
      >
        <option value="">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <button onClick={handleSearch}>Search</button>
    </div>
  );

  return (
    <div className="page-container">
      <div className="card">
        <h1>Support Tickets</h1>
        {searchForm}

        <div className="actions-container">
          <Link
            to="/tickets/new"
            className="action-button action-button-primary"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10 5v10M5 10h10" />
            </svg>
            Create New Ticket
          </Link>
          <Link
            to="/analytics"
            className="action-button action-button-secondary"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 2v16h16M6 10l4-4 4 4 4-4" />
            </svg>
            View Analytics
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <ul className="ticket-list">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="ticket-item">
              <div className="ticket-header">
                <Link to={`/tickets/${ticket.id}`} className="ticket-title">
                  {ticket.title}
                </Link>
              </div>

              <p className="ticket-description">{ticket.description}</p>

              <div className="ticket-metadata">
                <div className="metadata-row">
                  <span className="metadata-label">Created by:</span>
                  <span className="metadata-value">
                    {ticket.createdBy.firstName} {ticket.createdBy.lastName}
                  </span>
                </div>

                {ticket.assignedTo && (
                  <div className="metadata-row">
                    <span className="metadata-label">Assigned to:</span>
                    <span className="metadata-value">
                      {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                    </span>
                  </div>
                )}

                <div className="metadata-row">
                  <span className="metadata-label">Created:</span>
                  <span className="metadata-value">
                    {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {ticket.category && (
                  <div className="metadata-row">
                    <span className="metadata-label">Category:</span>
                    <span className="metadata-value">{ticket.category}</span>
                  </div>
                )}

                {ticket.dueDate && (
                  <div className="metadata-row">
                    <span className="metadata-label">Due:</span>
                    <span
                      className={`metadata-value ${
                        new Date(ticket.dueDate) < new Date() ? "overdue" : ""
                      }`}
                    >
                      {new Date(ticket.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="ticket-stats">
                  {ticket.estimatedTime && (
                    <span className="estimated-time" title="Estimated time">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1-6.41V4c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .28.11.53.29.71l2.7 2.7c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L9 7.59z" />
                      </svg>
                      {ticket.estimatedTime}h
                    </span>
                  )}
                </div>
              </div>

              <div className="ticket-footer">
                <div className="ticket-meta">
                  <span
                    className={`badge status-badge status-${ticket.status}`}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className={`badge priority-badge priority-${ticket.priority}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TicketsPage;
