import { useState, useEffect } from "react";
import {
  BarChart,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Pie,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import axios from "axios";

function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view analytics");
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/api/analytics/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMetrics(response.data);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError("You need ADMIN or AGENT role to view analytics");
        } else {
          setError(err?.response?.data?.error || "Failed to fetch analytics");
        }
      }
    }
    fetchMetrics();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!metrics) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <h1>Dashboard</h1>

      <div className="metrics-grid">
        {/* Total Tickets Card */}
        <div className="metric-card">
          <h3>Total Tickets</h3>
          <div className="metric-value">{metrics.totalTickets}</div>
        </div>

        {/* Average Resolution Time */}
        <div className="metric-card">
          <h3>Avg. Resolution Time</h3>
          <div className="metric-value">
            {metrics.averageResolutionTime.toFixed(1)} hours
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="metric-card">
          <h3>Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.priorityDistribution}
                dataKey="_count"
                nameKey="priority"
                cx="50%"
                cy="50%"
                fill="#8884d8"
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="metric-card">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.statusDistribution}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="_count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
