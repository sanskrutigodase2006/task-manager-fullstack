import { useState } from "react";
import {
  sendOtp,
  verifyOtp
} from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [step, setStep] =
    useState(1);

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const handleSendOtp =
    async (e) => {

      e.preventDefault();

      try {

        await sendOtp(email);

        alert(
          "OTP sent to email"
        );

        setStep(2);

      } catch {

        alert(
          "Email not found"
        );
      }
    };

  const handleReset =
    async (e) => {

      e.preventDefault();

      if (
        password !==
        confirmPassword
      ) {
        alert(
          "Passwords do not match"
        );
        return;
      }

      try {

        await verifyOtp(
          email,
          otp,
          password
        );

        alert(
          "Password Reset Successful"
        );

        navigate("/login");

      } catch {

        alert(
          "Invalid OTP"
        );
      }
    };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-logo">
            ✓
          </div>

          <h1>
            Forgot Password
          </h1>

          <p>
            Reset your password
          </p>

        </div>

        {step === 1 ? (

          <form
            onSubmit={
              handleSendOtp
            }
          >

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <button
              className="auth-btn"
            >
              Send OTP
            </button>

          </form>

        ) : (

          <form
            onSubmit={
              handleReset
            }
          >

            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />

            <button
              className="auth-btn"
            >
              Reset Password
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;