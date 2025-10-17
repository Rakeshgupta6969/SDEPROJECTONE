// import { useEffect, useState } from "react";
// import api from "../api/axios";

// export default function TransactionsList({ accountId }) {
//   const [txs, setTxs] = useState([]);
//   useEffect(() => {
//     if (!accountId) return;
//     (async () => {
//       try {
//         const { data } = await api.get(`/transactions?accountId=${accountId}&limit=50`);
//         setTxs(data);
//       } catch (err) { console.error(err); }
//     })();
//   }, [accountId]);

//   return (
//     <div>
//       <h4>Transactions</h4>
//       <ul>
//         {txs.map(t => (
//           <li key={t._id}>
//             {new Date(t.date).toLocaleDateString()} • {t.category} • {t.type} • ₹{t.amount} • {t.merchant}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import api from "../api/axios";

export default function TransactionsList({ accountId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get(`/transactions?accountId=${accountId}&limit=20`);
        setTransactions(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountId]);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (transactions.length === 0) return <p>No transactions found.</p>;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h4>Transactions:</h4>
      <ul>
        {transactions.map((txn) => (
          <li key={txn._id}>
            <strong>{txn.category}</strong> — ₹{txn.amount} ({txn.type})
            <br />
            Merchant: {txn.merchant || "N/A"} <br />
            Date: {new Date(txn.createdAt).toLocaleDateString()}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
