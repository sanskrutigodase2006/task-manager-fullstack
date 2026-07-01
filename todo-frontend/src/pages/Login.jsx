import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await loginUser(form);

      localStorage.setItem(
        "token",
        response.data.token
      );


      localStorage.setItem(
        "email",
        response.data.email
      );

      localStorage.setItem(
        "name",
        response.data.name
      );
      navigate("/tasks");

    } catch (error) {

      alert("Invalid Email or Password");

      console.error(error);
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

        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email Address"
            required
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
            required
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          <div className="text-end mb-3">
            <span
              className="auth-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>
          <button
            type="submit"
            className="auth-btn"
          >
            Login
          </button>

        </form>

        <div className="auth-footer">

          Don't have an account?

          <span
            className="auth-link"
            onClick={() => navigate("/")}
          >
            Register
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;