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

  useEffect(() => {
    async function fetchTickets() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  return (
    <div className="page-container">
      <div className="card">
        <h1>Tickets</h1>
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
