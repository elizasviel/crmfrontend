import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

function RoleManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "https://crmbackendnorman-85f274ff87d9.herokuapp.com/api/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to fetch users");
    }
  }

  async function updateUserRole(userId: string, newRole: string) {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://crmbackendnorman-85f274ff87d9.herokuapp.com/api/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update user role");
    }
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1>User Role Management</h1>
        {error && <div className="error-message">{error}</div>}

        <table className="role-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="AGENT">Agent</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RoleManagement;
