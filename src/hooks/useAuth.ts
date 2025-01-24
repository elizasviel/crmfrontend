import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return {
    role,
    isAdmin: role === "ADMIN",
    isAgent: role === "AGENT",
    isLoggedIn: !!role,
  };
}
