import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Star } from 'lucide-react';
import { FaHandsPraying } from 'react-icons/fa6';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get('/bookings/mybookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      showToast('Booking cancelled successfully', 'success');
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel booking', 'error');
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'confirmed') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 mb-8 opacity-0-init animate-slide-in-right">
        <h1 className="text-4xl font-bold text-orange-700 mb-1 flex items-center gap-2">Namaste, {user?.name} <FaHandsPraying className="text-orange-600 inline" size={32} /></h1>
        <p className="text-gray-600">Your personal Darshan dashboard</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { to: '/book-slot', icon: <Calendar size={28} />, label: 'Book Darshan', color: 'bg-orange-600' },
          { to: '/donate', icon: <Heart size={28} />, label: 'Donate', color: 'bg-orange-500' },
          { to: '/feedback', icon: <Star size={28} />, label: 'Give Feedback', color: 'bg-orange-600' },
          { to: '/temples', icon: '🛕', label: 'View Temples', color: 'bg-orange-500' },
        ].map(({ to, icon, label, color }, index) => (
          <Link 
            key={to} 
            to={to}
            className={`${color} text-white p-4 rounded-xl text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-semibold flex flex-col items-center gap-2 opacity-0-init animate-fade-in-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-2xl flex items-center justify-center h-8 hover:scale-110 transition-transform duration-300">{icon}</span>
            <span className="text-sm">{label}</span>
          </Link>
        ))}
      </div>

      {/* Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 opacity-0-init animate-fade-in-up animate-delay-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-orange-100 pb-2">Your Darshan Bookings</h2>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 py-4">
            <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            Loading your bookings...
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <div 
                key={booking._id} 
                className="border-2 border-orange-200 rounded-lg p-5 bg-[#FFFDF5] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col opacity-0-init animate-fade-in-up"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${getStatusStyle(booking.status)}`}>{booking.status}</span>
                  <span className="text-xs text-gray-400">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>

                {booking.slot?.temple && (
                  <p className="text-xs text-orange-600 font-semibold mb-1">🛕 {booking.slot.temple?.name}</p>
                )}
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  {booking.slot ? new Date(booking.slot.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date Unavailable'}
                </h3>
                <p className="text-orange-600 font-semibold text-lg mb-3">
                  {booking.slot ? `${booking.slot.startTime} – ${booking.slot.endTime}` : 'Time Unavailable'}
                </p>

                {booking.darshanToken && (
                  <div className="bg-orange-50 border border-orange-200 rounded-md px-3 py-2 mb-3">
                    <p className="text-xs text-gray-500 mb-0.5">Darshan Token</p>
                    <p className="font-mono font-bold text-orange-700 tracking-widest text-sm">{booking.darshanToken}</p>
                  </div>
                )}

                <div className="mt-auto pt-2">
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="w-full bg-white border border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold py-1.5 rounded transition text-sm">
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <p className="text-xs text-center text-green-600 font-medium">Darshan Completed</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-orange-300">
            <p className="text-gray-600 mb-4 text-lg">No bookings yet. Start your spiritual journey!</p>
            <Link to="/book-slot" className="inline-block bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-orange-700 transition">
              Book Darshan Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
