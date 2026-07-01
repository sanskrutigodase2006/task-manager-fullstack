// Register.jsx
import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);
      navigate("/login");
    } catch {
      alert("Registration Failed");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-logo">
            ✓
          </div>

          <h1>Task Manager</h1>

          <p>
            Organize your work and stay productive
          </p>

        </div>

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          <button
            type="submit"
            className="auth-btn"
          >
            Create Account
          </button>

        </form>

        <div className="auth-footer">

          Already have an account?

          <span
            className="auth-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>

        </div>

      </div>

    </div>
  );
}

export default Register;