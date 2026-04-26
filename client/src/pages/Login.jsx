import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, Settings } from 'lucide-react';
import { FaHandsPraying } from 'react-icons/fa6';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', formData);
      const userData = response.data;

      // Validate that the logged-in user's role matches the selected tab
      if (role === 'admin' && userData.role !== 'admin') {
        setError('You are not registered as an admin.');
        return;
      }
      if (role === 'user' && userData.role === 'admin') {
        setError('Please use the Admin login tab.');
        return;
      }

      login(userData);
      showToast(<span className="flex items-center gap-1">Namaste, {userData.name}! <FaHandsPraying /></span>, 'success');
      
      const from = location.state?.from;
      navigate(from || (userData.role === 'admin' ? '/admin' : '/dashboard'));
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-orange-100">
        {/* Role Toggle */}
        <div className="flex bg-orange-50 rounded-lg p-1 mb-6 border border-orange-200">
          {['user', 'admin'].map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 rounded-md font-semibold text-sm transition-all ${role === r ? 'bg-orange-600 text-white shadow' : 'text-gray-500 hover:text-orange-600'}`}>
              {r === 'user' ? <><User size={16} className="inline mr-1" /> Devotee</> : <><Settings size={16} className="inline mr-1" /> Admin</>}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-center text-orange-700 mb-5">{role === 'admin' ? 'Admin Login' : 'Welcome Back'}</h2>

        {error && <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com"
              className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••"
              className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition" />
          </div>
          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg shadow-lg transition-all mt-2">
            Login as {role === 'admin' ? 'Admin' : 'Devotee'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" state={location.state} className="text-orange-600 font-medium hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
