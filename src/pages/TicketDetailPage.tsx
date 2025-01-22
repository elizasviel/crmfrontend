import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  isInternal: boolean;
  createdAt: string;
  user: User;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // You can add more fields such as assignedTo, etc.
}

function TicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [error, setError] = useState("");

  // Fetch the ticket data
  useEffect(() => {
    async function fetchTicket() {
      try {
        const token = localStorage.getItem("token");
        if (!token || !ticketId) return;

        const response = await axios.get(
          `http://localhost:3000/api/tickets/${ticketId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTicket(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to fetch ticket");
      }
    }

    fetchTicket();
  }, [ticketId]);

  // Fetch the comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const token = localStorage.getItem("token");
        if (!token || !ticketId) return;

        const response = await axios.get(
          `http://localhost:3000/api/tickets/${ticketId}/comments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComments(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to fetch comments");
      }
    }

    fetchComments();
  }, [ticketId]);

  // Post a new comment
  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token || !ticketId) return;

      const res = await axios.post(
        `http://localhost:3000/api/tickets/${ticketId}/comments`,
        {
          content: newComment,
          isInternal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments([...comments, res.data]);
      setNewComment("");
      setIsInternal(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to post comment");
    }
  }

  if (!ticket) {
    return (
      <div className="page-container">
        <div className="card">
          {error ? <p>{error}</p> : <p>Loading ticket...</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1>{ticket.title}</h1>
        <p>Status: {ticket.status}</p>
        <p>Priority: {ticket.priority}</p>
        <p>{ticket.description}</p>
        <hr />

        <h2>Comments</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="ticket-comment">
            <p>
              <strong>
                {comment.user.firstName} {comment.user.lastName}
              </strong>{" "}
              {comment.isInternal && <em>(Internal)</em>}
            </p>
            <p>{comment.content}</p>
            <small>
              Posted on: {new Date(comment.createdAt).toLocaleString()}
            </small>
            <hr />
          </div>
        ))}

        <form className="form-container" onSubmit={handlePostComment}>
          <label>New Comment</label>
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <div>
            <label>Mark as Internal?</label>
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
            />
          </div>
          <button type="submit">Post Comment</button>
        </form>
      </div>
    </div>
  );
}

export default TicketDetailPage;
