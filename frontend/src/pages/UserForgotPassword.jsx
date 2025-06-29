import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added navigation import
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

export default function UserForgotPassword() {
  const { backendUrl } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/auth/forgot-password`, { email });
      toast.success("Reset code sent to your email.");

      setTimeout(() => {
        navigate("/reset-password"); // ✅ Redirect after success
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-md mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-primary text-white py-2 rounded-md">
          Send Code
        </button>
      </form>
    </div>
  );
}
