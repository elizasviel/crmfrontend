/*
import { useSocket } from "../contexts/SocketContext";
import { useState, useEffect } from "react";

function LiveCollaboration({ ticketId }: { ticketId: string }) {
  const socket = useSocket();
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    socket?.on("user-joined", (userId: string) => {
      setActiveUsers((prev) => [...prev, userId]);
    });

    socket?.on("user-typing", ({ userId, status }) => {
      setIsTyping((prev) => ({ ...prev, [userId]: status }));
    });

    return () => {
      socket?.off("user-joined");
      socket?.off("user-typing");
    };
  }, [socket, ticketId]);

  return (
    <div className="live-collaboration">
      <div className="active-users">
        {activeUsers.map((user) => (
          <UserAvatar key={user} userId={user} />
        ))}
      </div>
      {Object.entries(isTyping).map(
        ([userId, status]) =>
          status && <TypingIndicator key={userId} userId={userId} />
      )}
    </div>
  );
}

*/
