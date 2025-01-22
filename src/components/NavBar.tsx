import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/tickets" className="navbar-brand">
        My CRM
      </Link>
      <div className="navbar-links">
        <Link to="/tickets">Tickets</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default NavBar;
