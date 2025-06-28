import { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UserResetPassword() {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // for toggling password visibility

  const handleReset = async (e) => {
    e.preventDefault();

    console.log("Sending reset request with:", {
      email,
      code: resetCode,
      newPassword,
    });

    try {
      await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        code: resetCode,
        newPassword,
      });

      toast.success("Password reset successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data);

      toast.error(error.response?.data?.message || "Failed to reset password", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4"
          required
        />
        <input
          type="text"
          placeholder="Reset Code"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4"
          required
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-gray-600"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Open eye icon SVG
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              // Closed eye icon SVG
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.964 9.964 0 012.224-3.658m1.382-1.383A9.969 9.969 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-1.88 3.297M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3l18 18"
                />
              </svg>
            )}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
