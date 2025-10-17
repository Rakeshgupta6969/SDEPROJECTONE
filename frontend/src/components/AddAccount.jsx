import { useState } from "react";
import api from "../api/axios";

export default function AddAccount({ onAccountCreated }) {
  const [form, setForm] = useState({
    accountName: "",
    accountType: "Savings",
    balance: "",
    bankName: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data } = await api.post("/accounts", {
        accountName: form.accountName,
        accountType: form.accountType,
        balance: Number(form.balance),
        bankName: form.bankName,
      });

      setMessage("✅ Account created successfully!");
      setForm({ accountName: "", accountType: "Savings", balance: "", bankName: "" });

      // Refresh parent Dashboard data
      onAccountCreated && onAccountCreated(data);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error creating account");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem", borderRadius: "8px" }}>
      <h3>Add New Account</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Account Name:</label><br />
          <input
            type="text"
            name="accountName"
            value={form.accountName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Account Type:</label><br />
          <select name="accountType" value={form.accountType} onChange={handleChange}>
            <option>Savings</option>
            <option>Checking</option>
            <option>Credit Card</option>
            <option>Investment</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label>Balance:</label><br />
          <input
            type="number"
            name="balance"
            value={form.balance}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Bank Name:</label><br />
          <input
            type="text"
            name="bankName"
            value={form.bankName}
            onChange={handleChange}
          />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>
          Create Account
        </button>
      </form>

      {message && <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}
    </div>
  );
}
