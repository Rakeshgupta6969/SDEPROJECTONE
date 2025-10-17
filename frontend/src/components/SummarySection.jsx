import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SummarySection() {
  const [summary, setSummary] = useState({ totalBalance: 0, monthlyExpenses: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get("/transactions/aggregate/monthly-by-category?year=2025");
        // Prepare data for chart
        const chartData = data.map((item) => ({
          month: item._id.month,
          total: item.totalAmount,
        }));

        setSummary((prev) => ({
          ...prev,
          monthlyExpenses: chartData,
        }));

        // Calculate total balance (optional endpoint or compute manually later)
        const accRes = await api.get("/accounts");
        const totalBalance = accRes.data.reduce((sum, a) => sum + a.balance, 0);
        setSummary((prev) => ({ ...prev, totalBalance }));
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching summary");
      }
    };

    fetchSummary();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div  style={{ marginBottom: "2rem" }} >
      <h2>Summary</h2>
      <h3>Total Balance: ₹{summary.totalBalance}</h3>

      {summary.monthlyExpenses.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary.monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No expense data yet.</p>
      )}
    </div>
  );
}
