import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo.svg';
import { toast } from 'react-toastify';

export default function AdminNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Admin logged out successfully');
    navigate('/admin/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="shadow-sm bg-primary2 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <NavLink to="/admin/dashboard" className="text-xl flex items-center font-bold text-black">
            <img className="w-20" src={logo} alt="Logo" />
            <h2 className="ml-2">Admin Panel</h2>
          </NavLink>

          {isLoggedIn && (
            <div className="hidden mobileMenu:flex space-x-8 items-center">
              <NavLink to="/admin/dashboard" className="inline-flex items-center px-1 pt-1 border-b-4 text-medium font-medium">Dashboard</NavLink>
              <NavLink to="/admin/users" className="inline-flex items-center px-1 pt-1 border-b-4 text-medium font-medium">Users</NavLink>
              <NavLink to="/admin/admins" className="inline-flex items-center px-1 pt-1 border-b-4 text-medium font-medium">Admins</NavLink>
            </div>
          )}

          {isLoggedIn && (
            <div className="hidden mobileMenu:flex items-center">
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-primaryhover"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Button */}
          <div className="mobileMenu:hidden flex items-center">
            <button onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 transition duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMenu}></div>
        <div className={`absolute top-0 right-0 h-full w-[70%] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-end p-4">
            <button onClick={toggleMenu}>
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <div className="flex flex-col px-6 space-y-4">
            <NavLink to="/admin/dashboard" onClick={toggleMenu} className="text-gray-700 hover:text-primary text-base font-medium">Dashboard</NavLink>
            <NavLink to="/admin/users" onClick={toggleMenu} className="text-gray-700 hover:text-primary text-base font-medium">Users</NavLink>
            <NavLink to="/admin/admins" onClick={toggleMenu} className="text-gray-700 hover:text-primary text-base font-medium">Admins</NavLink>

            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="mt-4 bg-primary text-white text-center py-2 rounded-full font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
