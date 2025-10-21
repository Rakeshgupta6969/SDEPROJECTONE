// // function Dashboard() {
// //   return (
// //     <div style={{ textAlign: "center", marginTop: "50px" }}>
// //       <h1>Welcome to Your PFM Dashboard</h1>
// //       <p>This page will later show spending charts and account data.</p>
// //     </div>
// //   );
// // }

// // export default Dashboard;



// import { useEffect, useState } from "react";
// import api, { setAuthToken } from "../api/axios";
// import AddAccount from "../components/AddAccount";
// import TransactionsList from "../components/TransactionList";
// import AddTransaction from "../components/AddTransaction";
// import SummarySection from "../components/SummarySection";
// import Layout from "../components/Layout";


// function Dashboard() {
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("No token found. Please login again.");
//           setLoading(false);
//           return;
//         }

//         setAuthToken(token);
//         const { data } = await api.get("/accounts");
//         setAccounts(data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Error fetching accounts");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAccounts();
//   }, []);

//   if (loading) return <h2>Loading your accounts...</h2>;
//   if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

//   return (
//     <div style={{ padding: "2rem" }}>
//       <Layout/>
//       <h1>Welcome to Your Dashboard </h1>

      

//       {/* ✅ Summary Section */}
    
//       <SummarySection />

       
//       {/* ✅ Add Account Form */}
//       <AddAccount onAccountCreated={(newAcc) => setAccounts([newAcc, ...accounts])} />

//       {/* ✅ Show all accounts */}
//       {accounts.length === 0 ? (
//         <p>No accounts found yet.</p>
//       ) : (
//         <div>
//           <h2>Your Accounts</h2>
//           <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
//             {accounts.map((acc) => (
//               <li key={acc._id} style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
//                 <strong>{acc.accountName}</strong> ({acc.accountType})<br />
//                 Bank: {acc.bankName} <br />
//                 Balance: ₹{acc.balance}

//                 {/* ✅ Add Transaction Form */}
//                 <AddTransaction
//                   accountId={acc._id}
//                   onTransactionAdded={() => window.location.reload()}
//                 />

//                 {/* ✅ Show Transactions List */}
//                 <TransactionsList accountId={acc._id} />
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <button
//         onClick={() => {
//           localStorage.removeItem("token");
//           window.location.href = "/";
//         }}
//       >
//         Logout
//       </button>
//     </div>
//   );
// }

// export default Dashboard;



import { useEffect, useState } from "react";
import api, { setAuthToken } from "../api/axios";
import AddAccount from "../components/AddAccount";
import TransactionsList from "../components/TransactionList";
import AddTransaction from "../components/AddTransaction";
import SummarySection from "../components/SummarySection";
import Layout from "../components/Layout";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        setAuthToken(token);
        const { data } = await api.get("/accounts");
        setAccounts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading your accounts...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl font-semibold">
        {error}
      </div>
    );

  return (
    <Layout>
      <div className="bg-linear-to-r/srgb from-indigo-500 to-teal-400 w-full">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-1xl font-bold text-gray-800 ml-2 mr-2">
            Welcome to Your Dashboard 
          </h1>
        </div>

        {/* ✅ Summary Section */}
        <div className="bg-white p-6 rounded-xl shadow">
          <SummarySection />
        </div>

        {/* ✅ Add Account Form */}
        <div className="bg-white p-6 rounded-xl shadow">
          <AddAccount onAccountCreated={(newAcc) => setAccounts([newAcc, ...accounts])} />
        </div>

        {/* ✅ Accounts List */}
        <div className=" bg-linear-to-t from-sky-500 to-indigo-500p-6 rounded-xl shadow text-black">
          <h2 className="text-2xl font-semibold mb-4">Your Accounts</h2>

          {accounts.length === 0 ? (
            <p className="text-gray-500">No accounts found yet.</p>
          ) : (
            <ul className="space-y-6">
              {accounts.map((acc) => (
                <li
                  key={acc._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-700">{acc.accountName}</h3>
                    <p className="text-gray-500">
                      {acc.accountType} — {acc.bankName}
                    </p>
                    <p className="text-black font-semibold">
                      Balance: ₹{acc.balance}
                    </p>
                  </div>

                  {/* ✅ Add Transaction */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-3">
                    <AddTransaction
                      accountId={acc._id}
                      onTransactionAdded={() => window.location.reload()}
                    />
                  </div>

                  {/* ✅ Transactions List */}
                  <TransactionsList accountId={acc._id} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
