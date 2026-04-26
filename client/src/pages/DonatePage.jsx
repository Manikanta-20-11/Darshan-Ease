import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Smartphone, CreditCard, Landmark, Wallet } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const DonatePage = () => {
  const [formData, setFormData] = useState({ donorName: '', email: '', amount: '', temple: '', message: '', paymentMethod: 'upi' });
  const [temples, setTemples] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { showToast } = useToast();

  React.useEffect(() => {
    api.get('/temples').then(res => setTemples(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/feedback/donate', formData);
      showToast('Thank you for your generous donation!', 'success');
      setFormData({ donorName: '', email: '', amount: '', temple: '', message: '', paymentMethod: 'upi' });
    } catch (err) {
      showToast('Donation failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-8 mb-8 text-white text-center shadow-md">
        <Heart className="w-16 h-16 mx-auto mb-3 text-orange-100" />
        <h1 className="text-3xl font-bold mb-2">Make a Donation</h1>
        <p className="text-orange-50">Your contribution supports temple maintenance, prasad, and community services.</p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-orange-100 p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input type="text" name="donorName" value={formData.donorName} onChange={handleChange} required placeholder="Full Name"
                className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com"
                className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="1" placeholder="e.g. 101"
                className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temple</label>
              <select name="temple" value={formData.temple} onChange={handleChange}
                className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 outline-none transition">
                <option value="">General Fund</option>
                {temples.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="grid grid-cols-4 gap-2">
              {['upi', 'card', 'netbanking', 'wallet'].map((m) => (
                <label key={m} className={`flex items-center justify-center gap-1 border-2 rounded-lg p-3 cursor-pointer text-sm font-medium transition ${formData.paymentMethod === m ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-orange-300'}`}>
                  <input type="radio" name="paymentMethod" value={m} checked={formData.paymentMethod === m} onChange={handleChange} className="hidden" />
                  {m === 'upi' ? <Smartphone size={16} /> : m === 'card' ? <CreditCard size={16} /> : m === 'netbanking' ? <Landmark size={16} /> : <Wallet size={16} />} {m.charAt(0).toUpperCase() + m.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows="3" placeholder="Leave a message with your donation..."
              className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition resize-none" />
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Quick Select:</p>
            <div className="flex gap-2 flex-wrap">
              {[51, 101, 251, 501, 1001].map((amt) => (
                <button key={amt} type="button" onClick={() => setFormData({ ...formData, amount: amt })}
                  className="px-4 py-1 rounded-full border border-orange-300 text-orange-700 text-sm hover:bg-orange-50 transition font-medium">
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-lg disabled:opacity-60">
            {loading ? 'Processing...' : `Donate ₹${formData.amount || '...'}`}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">This is a demo donation form. No real payment is processed.</p>
    </div>
  );
};

export default DonatePage;
