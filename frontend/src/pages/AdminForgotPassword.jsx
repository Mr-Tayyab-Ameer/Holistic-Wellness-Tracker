import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/forgot-password', { email });
      toast.success('Temporary password sent to your email. It expires in 1 hour.', {
        position: "top-right",
        autoClose: 4000,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send temporary password', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your admin email"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primaryhover transition duration-200"
        >
          Send Temporary Password
        </button>
      </form>
    </div>
  );
}
