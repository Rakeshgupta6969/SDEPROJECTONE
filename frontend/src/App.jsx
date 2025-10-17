// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }
// export default App;

// App.jsx  
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";  
import Login from "./pages/Login";  
import Register from "./pages/Register";  
import Dashboard from "./pages/Dashboard";  

// ✅ This function checks if a token exists in localStorage  
const PrivateRoute = ({ children }) => {  
  const token = localStorage.getItem("token");  
  return token ? children : <Navigate to="/" replace />;  
};  

function App() {  
  return (  
    <Router>  
      <Routes>  
        {/* Public routes */}  
        <Route path="/" element={<Login />} />  
        <Route path="/register" element={<Register />} />  

        {/* ✅ Protected route (Dashboard only for logged-in users) */}  
        <Route  
          path="/dashboard"  
          element={  
            <PrivateRoute>  
              <Dashboard />  
            </PrivateRoute>  
          }  
        />  
      </Routes>  
    </Router>  
  );  
}  

export default App;


