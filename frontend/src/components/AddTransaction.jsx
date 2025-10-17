// import { useState } from "react";
// import api from "../api/axios";

// export default function AddTransaction({ accountId, onAdded }) {
//   const [form, setForm] = useState({ amount: 0, category: "", type: "debit", merchant: "" });
//   const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async e => {
//     e.preventDefault();
//     try {
//       const body = { ...form, accountId };
//       const { data } = await api.post("/transactions", body);
//       onAdded && onAdded(data);
//       setForm({ amount: 0, category: "", type: "debit", merchant: "" });
//     } catch (err) { alert(err.response?.data?.message || "Error"); }
//   };

//   return (
//     <form onSubmit={submit}>
//       <input name="amount" type="number" value={form.amount} onChange={onChange} required/>
//       <input name="category" value={form.category} onChange={onChange} placeholder="Category" required/>
//       <select name="type" value={form.type} onChange={onChange}><option>debit</option><option>credit</option></select>
//       <input name="merchant" value={form.merchant} onChange={onChange} placeholder="Merchant"/>
//       <button>Add</button>
//     </form>
//   );
// }

import { useState } from "react";
import api from "../api/axios";

export default function AddTransaction({ accountId, onTransactionAdded }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "debit",
    merchant: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data } = await api.post("/transactions", {
        accountId,
        amount: Number(form.amount),
        category: form.category,
        type: form.type,
        merchant: form.merchant,
      });
      setMessage("✅ Transaction added successfully!");
      setForm({ amount: "", category: "", type: "debit", merchant: "" });
      onTransactionAdded && onTransactionAdded(data);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error adding transaction");
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem", marginTop: "1rem", borderRadius: "8px" }}>
      <h4>Add New Transaction</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label><br />
          <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
        </div>
        <div>
          <label>Category:</label><br />
          <input type="text" name="category" value={form.category} onChange={handleChange} required />
        </div>
        <div>
          <label>Type:</label><br />
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </div>
        <div>
          <label>Merchant (optional):</label><br />
          <input type="text" name="merchant" value={form.merchant} onChange={handleChange} />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>Add Transaction</button>
      </form>
      {message && <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}
    </div>
  );
}
