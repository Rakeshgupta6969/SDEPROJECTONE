import { useEffect, useState } from "react";
import api, { setAuthToken } from "../api/axios";

export default function AccountsList() {
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);
    (async () => {
      try {
        const { data } = await api.get("/accounts");
        setAccounts(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div>
      <h3>Your accounts</h3>
      <ul>
        {accounts.map(a => (
          <li key={a._id}>
            <strong>{a.accountName}</strong> ({a.accountType}) — Balance: ₹{a.balance}
          </li>
        ))}
      </ul>
    </div>
  );
}