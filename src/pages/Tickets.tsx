import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
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
        <h1>Tickets</h1>
        {searchForm}
        {error && <div className="error-message">{error}</div>}

        <div style={{ marginBottom: "1rem" }}>
          <Link to="/tickets/new">Create New Ticket</Link>
          <Link to="/analytics" style={{ marginLeft: "1rem" }}>
            View Analytics
          </Link>
        </div>

        <ul className="ticket-list">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link to={`/tickets/${ticket.id}`} className="ticket-title">
                {ticket.title}
              </Link>
              <div className="ticket-info">
                Priority: {ticket.priority} | Status: {ticket.status}
              </div>
              <p>{ticket.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TicketsPage;
