import React, { useState, useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export function UserPresence({ ticketId }: { ticketId: string }) {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-ticket", ticketId);

    socket.on("user-joined", (user: User) => {
      setActiveUsers((prev) => [...prev, user]);
    });

    socket.on("user-left", (userId: string) => {
      setActiveUsers((prev) => prev.filter((u) => u.id !== userId));
    });

    return () => {
      socket.emit("leave-ticket", ticketId);
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [socket, ticketId]);

  return (
    <div className="user-presence">
      <h4>Currently Viewing:</h4>
      <div className="active-users">
        {activeUsers.map((user) => (
          <div key={user.id} className="user-badge">
            {user.firstName} {user.lastName}
          </div>
        ))}
      </div>
    </div>
  );
}
