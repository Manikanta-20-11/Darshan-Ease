import React, { useState, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const { user, login } = useContext(AuthContext);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const updateData = { name: formData.name };
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      const response = await api.put('/auth/profile', updateData);
      
      // Update AuthContext and LocalStorage
      login(response.data);
      showToast('Profile updated successfully!', 'success');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-md border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-orange-700 mb-6 border-b border-orange-100 pb-2">Your Profile</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
            <input type="email" value={user?.email || ''} disabled
              className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition" />
          </div>

          <div className="pt-4 border-t border-gray-100 mt-2">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Change Password (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} minLength="6"
                  className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 outline-none transition" placeholder="Leave blank to keep current" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} minLength="6"
                  className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 outline-none transition" placeholder="Confirm new password" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg shadow-lg transition-all disabled:opacity-60">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
