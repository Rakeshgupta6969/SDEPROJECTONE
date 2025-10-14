import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.heading}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={styles.button}>Login</button>
        <p style={styles.text}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex", justifyContent: "center", alignItems: "center",
    height: "100vh", backgroundColor: "#f0f2f5"
  },
  form: {
    backgroundColor: "#fff", padding: "2rem", borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "300px"
  },
  heading: { textAlign: "center", marginBottom: "1.5rem" },
  input: {
    width: "100%", padding: "0.5rem", marginBottom: "1rem",
    border: "1px solid #ccc", borderRadius: "5px"
  },
  button: {
    width: "100%", padding: "0.6rem", backgroundColor: "#007bff",
    color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer"
  },
  text: { marginTop: "0.5rem", textAlign: "center" }
};

export default Login;
