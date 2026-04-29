import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-orange-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-orange-700 font-bold text-xl flex items-center gap-2 hover:scale-105 transition-transform duration-300 origin-left">
          🛕 Darshan Ease
        </Link>

        <div className="flex gap-2 sm:gap-4 items-center">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-md font-medium transition-colors duration-300 text-sm">Admin Portal</Link>
                  <Link to="/admin/verify" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-md font-medium transition-colors duration-300 text-sm">Verify Gate</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-md font-medium transition-colors duration-300 text-sm">Dashboard</Link>
                  <Link to="/temples" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-md font-medium transition-colors duration-300 text-sm">Temples</Link>
                  <Link to="/book-slot" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-md font-medium transition-colors duration-300 text-sm">Book Slot</Link>
                  <Link to="/feedback" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-md font-medium transition-colors duration-300 text-sm">Feedback</Link>
                  <Link to="/donate" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-md font-medium transition-colors duration-300 text-sm">Donate</Link>
                </>
              )}
              <div className="flex items-center gap-2 ml-2">
                <Link to="/profile" className="hidden sm:flex items-center text-xs text-gray-700 hover:bg-orange-50 hover:text-orange-700 border border-gray-200 rounded-full px-3 py-1 transition cursor-pointer">
                  {user.role === 'admin' ? <Settings size={14} className="mr-1" /> : <User size={14} className="mr-1" />}
                  {user.name}
                </Link>
                <button onClick={handleLogout}
                  className="bg-orange-600 text-white px-4 py-1.5 rounded-md hover:bg-orange-700 transition font-medium text-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-md font-medium transition-colors duration-300 text-sm">Login</Link>
              <Link to="/register" className="bg-orange-600 text-white px-4 py-1.5 rounded-md hover:bg-orange-700 hover:shadow-md hover:scale-105 transition-all duration-300 font-medium text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
