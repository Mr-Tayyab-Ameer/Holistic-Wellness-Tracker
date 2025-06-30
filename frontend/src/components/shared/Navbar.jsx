import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { toast } from 'react-toastify';
import logo from "../../assets/logo.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1500);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="shadow-sm bg-primary2 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="text-xl flex items-center font-bold text-black">
              <img className="w-20" src={logo} alt="Logo" />
              <h2>Holistic Wellness Tracker</h2>
            </NavLink>
          </div>

          {/* Desktop Links */}
          {isLoggedIn && (
            <div className="hidden mobileMenu:flex space-x-8 items-center">
              <NavLink to="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-4 text-medium font-medium">Dashboard</NavLink>
              <NavLink to="/fitness" className="inline-flex items-center px-1 pt-1 border-b-4 text-medium font-medium">Fitness</NavLink>
              <NavLink to="/nutrition" className="inline-flex items-center px-1 pt-1 border-b-4 text-medium font-medium">Nutrition</NavLink>
              <NavLink to="/stress" className="inline-flex items-center px-1 pt-1 border-b-4 text-medium font-medium">Stress</NavLink>
            </div>
          )}

          {/* Desktop Auth Button */}
          <div className="hidden mobileMenu:flex items-center">
            {isLoggedIn ? (
              <>
                <Link
                  to="/my-profile"
                  className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-primaryhover"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-primary text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-primaryhover"
                >
                  Logout
                </button>
              </>
            ) : (
              !["/login", "/admin", "/admin/login", "/admin/register","/admin/dashboard"].includes(location.pathname) && (
                <Link
                  to="/login"
                  className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-primaryhover"
                >
                  Login
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="mobileMenu:hidden flex items-center">
            <button onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 transition duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMenu}></div>
        <div className={`absolute top-0 right-0 h-full w-[70%] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-end p-4">
            <button onClick={toggleMenu}>
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <div className="flex flex-col px-6 space-y-4">
            <NavLink to="/dashboard" onClick={toggleMenu} className="text-gray-700 hover:text-primary text-base font-medium">Dashboard</NavLink>
            <NavLink to="/fitness" onClick={toggleMenu} className="text-gray-700 hover:text-primary text-base font-medium">Fitness</NavLink>
            <NavLink to="/nutrition" onClick={toggleMenu} className="text-gray-700 hover:text-primary text-base font-medium">Nutrition</NavLink>
            <NavLink to="/stress" onClick={toggleMenu} className="text-gray-700 hover:text-primary text-base font-medium">Stress</NavLink>

            {isLoggedIn ? (
              <>
                <Link
                  to="/my-profile"
                  onClick={toggleMenu}
                  className="mt-4 bg-primary text-white text-center py-2 rounded-full font-bold"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="mt-4 bg-primary text-white text-center py-2 rounded-full font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              !["/login", "/admin", "/admin/login", "/admin/register"].includes(location.pathname) && (
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="mt-4 bg-primary text-white text-center py-2 rounded-full font-bold"
                >
                  Login
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
