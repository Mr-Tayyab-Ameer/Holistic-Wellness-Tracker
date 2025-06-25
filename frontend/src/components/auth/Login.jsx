import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export default function Login() {
  const { backendUrl } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem('token', data.token);
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-16">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Your Email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primaryhover transition duration-200"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <a href="/register" className="text-primary hover:underline">Register</a>
      </p>
    </div>
  );
}
