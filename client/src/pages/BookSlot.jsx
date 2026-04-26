import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

import { useToast } from '../context/ToastContext';

const BookSlot = () => {
  const location = useLocation();
  const [temples, setTemples] = useState([]);
  const [selectedTemple, setSelectedTemple] = useState(location.state?.templeId || '');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  // Load temples on mount
  useEffect(() => {
    api.get('/temples').then(res => setTemples(res.data)).catch(() => {});
  }, []);

  const fetchSlots = useCallback(async (silent = false) => {
    if (!date) return;
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const params = new URLSearchParams({ date });
      if (selectedTemple) params.append('temple', selectedTemple);
      const response = await api.get(`/slots?${params}`);
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [date, selectedTemple]);

  // Fetch on date/temple change
  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  // Live queue polling every 30 seconds
  useEffect(() => {
    if (!date) return;
    const interval = setInterval(() => fetchSlots(true), 30000);
    return () => clearInterval(interval);
  }, [fetchSlots, date]);

  const isExpired = (slot) => {
    const slotDateTime = new Date(slot.date);
    const [hours, minutes] = slot.endTime.split(':');
    slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return slotDateTime < new Date();
  };

  const handleBook = async (slotId) => {
    try {
      const response = await api.post('/bookings', { slotId });
      showToast(`Darshan Booked! Token: ${response.data.darshanToken}`, 'success');
      fetchSlots(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to book slot', 'error');
    }
  };

  const fillPercent = (slot) => Math.round((slot.bookedCount / slot.maxVisitors) * 100);

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Step 1: Select Temple */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-orange-100 mb-6 opacity-0-init animate-slide-in-right">
        <h1 className="text-3xl font-bold text-orange-700 mb-6">Book Darshan Slot</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Step 1: Select Temple</label>
            <select value={selectedTemple} onChange={(e) => setSelectedTemple(e.target.value)}
              className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition">
              <option value="">All Temples</option>
              {temples.map(t => <option key={t._id} value={t._id}>{t.name} — {t.location}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Step 2: Select Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition" />
          </div>
        </div>
      </div>

      {/* Step 3: Slot Grid */}
      {date && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-orange-100 opacity-0-init animate-fade-in-up animate-delay-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Available Slots — {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {refreshing && <div className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>}
              <span className="hidden sm:block">Live updates every 30s</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-gray-500 py-6">
              <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
              Loading slots...
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {slots.map((slot, index) => {
                const isFull = slot.bookedCount >= slot.maxVisitors;
                const expired = isExpired(slot);
                const cancelled = slot.status === 'cancelled';
                const disabled = isFull || expired || cancelled;
                const fill = fillPercent(slot);

                let cardStyle = 'bg-[#FFFDF5] border-orange-200 hover:shadow-lg hover:border-orange-300';
                if (expired || cancelled) cardStyle = 'bg-gray-50 border-gray-200 opacity-70';
                else if (isFull) cardStyle = 'bg-red-50 border-red-200';

                let badge = { text: 'Available', cls: 'bg-green-100 text-green-700' };
                if (cancelled) badge = { text: 'Cancelled', cls: 'bg-gray-200 text-gray-600' };
                else if (expired) badge = { text: 'Expired', cls: 'bg-gray-200 text-gray-500' };
                else if (isFull) badge = { text: 'Slot Full', cls: 'bg-red-100 text-red-700' };

                return (
                  <div 
                    key={slot._id} 
                    className={`border-2 rounded-xl p-5 transition-all duration-300 flex flex-col ${cardStyle} opacity-0-init animate-fade-in-up hover:-translate-y-1`}
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-gray-800 font-bold text-lg">{slot.startTime} – {slot.endTime}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${badge.cls}`}>{badge.text}</span>
                    </div>

                    {slot.temple && <p className="text-xs text-orange-600 font-medium mb-2">🛕 {slot.temple?.name || ''}</p>}

                    {/* Live Queue Status */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Queue: {slot.bookedCount} / {slot.maxVisitors}</span>
                        <span className={`font-semibold ${fill >= 90 ? 'text-red-600' : fill >= 60 ? 'text-yellow-600' : 'text-green-600'}`}>{fill}% filled</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full transition-all ${fill >= 90 ? 'bg-red-500' : fill >= 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${fill}%` }}></div>
                      </div>
                    </div>

                    <button onClick={() => handleBook(slot._id)} disabled={disabled}
                      className={`w-full mt-auto py-2 px-4 rounded-lg font-bold transition-all ${disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md'}`}>
                      {disabled ? badge.text : 'Book Now'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 italic">No slots found for this date/temple. Try another date.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSlot;
