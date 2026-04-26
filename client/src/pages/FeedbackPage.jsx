import React, { useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { Star } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const FeedbackPage = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [temple, setTemple] = useState('');
  const [temples, setTemples] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/temples').then(res => setTemples(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/feedback', { rating, message, temple: temple || undefined });
      showToast('Thank you for your feedback!', 'success');
      setMessage('');
      setRating(5);
      setTemple('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit feedback.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-md border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-orange-700 mb-1">Share Your Experience</h1>
        <p className="text-gray-500 text-sm mb-6">Your feedback helps us improve the darshan experience for everyone.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="text-4xl transition-transform hover:scale-110">
                  <Star size={36} className={star <= (hoveredStar || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500 self-center font-medium">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoveredStar || rating]}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temple (Optional)</label>
            <select value={temple} onChange={(e) => setTemple(e.target.value)}
              className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 outline-none transition">
              <option value="">General Feedback</option>
              {temples.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows="5"
              placeholder="Tell us about your experience with Darshan Ease..."
              className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition resize-none" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg shadow-lg transition-all disabled:opacity-60">
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
