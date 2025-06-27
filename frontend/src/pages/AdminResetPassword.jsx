import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AdminResetPassword() {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/reset-password', {
        email,
        code: resetCode,
        newPassword,
      });

      toast.success('Password reset successfully!', {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate('/admin/login'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
          <input 
            type="text"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
            minLength={6}
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primaryhover transition duration-200"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
