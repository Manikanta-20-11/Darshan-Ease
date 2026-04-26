import React, { useState } from 'react';
import api from '../utils/api';
import { CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const VerifyToken = () => {
  const [token, setToken] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setBooking(null);
    try {
      const response = await api.post('/admin/verify', { token: token.trim() });
      setBooking(response.data);
      showToast('Token verified and entry logged!', 'success');
      setToken('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Verification failed. Invalid token.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-gradient-to-r from-orange-600 to-yellow-500 rounded-xl p-8 mb-6 text-center shadow-md">
        <h1 className="text-3xl font-bold text-white mb-2">Gate Verification</h1>
        <p className="text-orange-100">Scan or enter the Darshan Token to allow entry.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-orange-100 mb-6">
        <form onSubmit={handleVerify} className="flex gap-4">
          <input 
            type="text" 
            value={token} 
            onChange={(e) => setToken(e.target.value)} 
            placeholder="e.g. DE-A1B2C3D4" 
            className="flex-1 px-4 py-3 border-2 border-orange-200 rounded-lg text-lg uppercase tracking-wider font-mono focus:border-orange-500 outline-none transition"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg shadow transition disabled:opacity-70">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>

      {booking && (
        <div className="bg-[#FFFDF5] border-2 border-green-500 rounded-xl p-6 shadow-md animate-slideIn">
          <div className="flex justify-between items-center mb-4 border-b border-green-200 pb-3">
            <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2"><CheckCircle size={28} className="text-green-600" /> Valid Entry!</h2>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Devotee Name</p>
              <p className="text-lg font-bold text-gray-800">{booking.user.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Temple</p>
              <p className="text-lg font-bold text-orange-700">{booking.slot?.temple?.name || 'General'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
              <p className="text-gray-800 font-medium">{new Date(booking.slot.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Time Slot</p>
              <p className="text-gray-800 font-medium">{booking.slot.startTime} – {booking.slot.endTime}</p>
            </div>
          </div>
          
          <div className="mt-6 text-center pt-4 border-t border-green-200">
             <p className="text-sm text-green-700 font-medium">The system has marked this booking as completed.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyToken;
