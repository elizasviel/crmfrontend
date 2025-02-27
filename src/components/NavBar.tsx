import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./NavBar.css";

function NavBar() {
  const location = useLocation();
  const { isAdmin, isLoggedIn } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/tickets" className="navbar-brand">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          My CRM
        </Link>
        <div className="navbar-links">
          {isLoggedIn && (
            <Link
              to="/tickets"
              className={location.pathname === "/tickets" ? "active" : ""}
            >
              Tickets
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin/roles"
              className={location.pathname === "/admin/roles" ? "active" : ""}
            >
              Manage Roles
            </Link>
          )}
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className={location.pathname === "/login" ? "active" : ""}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={location.pathname === "/register" ? "active" : ""}
              >
                Register
              </Link>
            </>
          ) : (
            <Link to="/login" onClick={() => localStorage.removeItem("token")}>
              Logout
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
