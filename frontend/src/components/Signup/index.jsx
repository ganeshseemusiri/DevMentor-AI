import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();

  if (!name || !email || !password || !confirmPassword) {
    setError("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Signup failed");
      return;
    }
    navigate("/login");
  } catch (err) {
    console.error(err);
    setError("Server error. Try again later.");
  }
};


  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="welcome-text">Welcome To DevMentor AI</h1>
        <h2>Create Account</h2>

        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Sign Up</button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
