import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import { UserPresence } from "../components/UserPresence";

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

function StatusUpdateModal({
  isOpen,
  onClose,
  onStatusSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onStatusSelect: (status: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Update Ticket Status</h3>
        <div className="status-options">
          {["OPEN", "IN_PROGRESS", "PENDING", "RESOLVED", "CLOSED"].map(
            (status) => (
              <button
                key={status}
                className="status-option-button"
                onClick={() => onStatusSelect(status)}
              >
                {status.replace("_", " ")}
              </button>
            )
          )}
        </div>
        <button className="button button-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function TicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [error, setError] = useState("");
  const socket = useSocket();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

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

  useEffect(() => {
    if (!socket || !ticketId) return;

    socket.emit("join-ticket", ticketId);

    socket.on("comment-added", (newComment: Comment) => {
      setComments((prev) => [...prev, newComment]);
    });

    socket.on("ticket-updated", (updatedTicket: Ticket) => {
      setTicket(updatedTicket);
    });

    socket.on("sla-alert", (alert) => {
      // You could use a toast notification library here
      alert(
        `SLA Warning: Ticket ${alert.ticketId} has exceeded its response time threshold`
      );
    });

    return () => {
      socket.emit("leave-ticket", ticketId);
      socket.off("comment-added");
      socket.off("ticket-updated");
    };
  }, [socket, ticketId]);

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

  const handleCloseTicket = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !ticketId || !ticket) return;

      await axios.put(
        `http://localhost:3000/api/tickets/${ticketId}/status`,
        { status: "CLOSED" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Create updated ticket object
      const updatedTicket = {
        ...ticket,
        status: "CLOSED",
      };

      // Update local state
      setTicket(updatedTicket);

      // Add this line to emit the socket event
      socket?.emit("ticket-updated", { ticketId, status: "CLOSED" });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to close ticket");
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !ticketId) return;

      await axios.put(
        `http://localhost:3000/api/tickets/${ticketId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setTicket((prev) => (prev ? { ...prev, status: newStatus } : null));

      // Notify other users through socket
      socket?.emit("ticket-updated", { ...ticket, status: newStatus });

      setIsStatusModalOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update ticket status");
    }
  };

  if (!ticket) {
    return (
      <div className="page-container">
        <div className="card">
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading ticket details...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="ticket-detail-layout">
        {/* Ticket Header Section */}
        <div className="card ticket-header-card">
          <div className="ticket-header-content">
            <div className="ticket-title-section">
              <h1>{ticket?.title}</h1>
              <div className="ticket-id">#{ticket?.id}</div>
            </div>
            <div className="ticket-actions">
              <button
                className="button button-secondary"
                onClick={handleCloseTicket}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 4l-8 8M4 4l8 8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Close Ticket
              </button>
              <button
                className="button button-primary"
                onClick={() => setIsStatusModalOpen(true)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M8 4v8M4 8h8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Update Status
              </button>
            </div>
          </div>

          <div className="ticket-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Status</span>
              <span className={`badge status-badge status-${ticket?.status}`}>
                {ticket?.status}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Priority</span>
              <span
                className={`badge priority-badge priority-${ticket?.priority}`}
              >
                {ticket?.priority}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Created</span>
              <span className="meta-value">
                {ticket?.createdAt &&
                  new Date(ticket.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last Updated</span>
              <span className="meta-value">
                {ticket?.updatedAt &&
                  new Date(ticket.updatedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="ticket-content-grid">
          {/* Left Column - Description and Comments */}
          <div className="ticket-main-column">
            <div className="card ticket-description-card">
              <h2>Description</h2>
              <p className="ticket-description-content">
                {ticket?.description}
              </p>
            </div>

            <div className="card ticket-comments-card">
              <div className="comments-header">
                <h2>Comments</h2>
                <span className="comment-count">
                  {comments.length} comments
                </span>
              </div>

              <div className="comments-list">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`comment-item ${
                      comment.isInternal ? "internal-comment" : ""
                    }`}
                  >
                    <div className="comment-header">
                      <div className="comment-author">
                        <div className="author-avatar">
                          {comment.user.firstName[0]}
                          {comment.user.lastName[0]}
                        </div>
                        <div className="author-info">
                          <span className="author-name">
                            {comment.user.firstName} {comment.user.lastName}
                          </span>
                          <span className="comment-timestamp">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      {comment.isInternal && (
                        <span className="internal-badge">Internal Note</span>
                      )}
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))}
              </div>

              <form className="comment-form" onSubmit={handlePostComment}>
                <div className="form-group">
                  <textarea
                    className="comment-input"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your comment..."
                    required
                  />
                </div>
                <div className="comment-form-actions">
                  <label className="internal-toggle">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                    />
                    <span>Internal Note</span>
                  </label>
                  <button type="submit" className="button button-primary">
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="ticket-sidebar">
            <div className="card active-users-card">
              <h3>Active Users</h3>
              {ticketId && <UserPresence ticketId={ticketId} />}
            </div>

            <div className="card ticket-details-card">
              <h3>Ticket Details</h3>
              <div className="details-list">
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">Technical Support</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Assigned To</span>
                  <span className="detail-value">John Smith</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">Customer Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onStatusSelect={handleStatusUpdate}
      />
    </div>
  );
}

export default TicketDetailPage;
