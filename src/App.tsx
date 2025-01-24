import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/Login";
import TicketsPage from "./pages/Tickets";
import RegisterPage from "./pages/Register";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import RoleManagement from "./components/RoleManagement";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/tickets/new" element={<CreateTicketPage />} />
        <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/admin/roles" element={<RoleManagement />} />
      </Routes>
    </>
  );
}

export default App;
