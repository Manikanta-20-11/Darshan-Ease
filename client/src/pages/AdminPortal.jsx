import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart2, ClipboardList, BookOpen, Users, Star, Heart, Calendar, Ticket, Clock, TrendingUp, MapPin } from 'lucide-react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white border-l-4 ${color} rounded-xl p-5 shadow-sm`}>
    <div className="flex justify-between items-center">
      <div><p className="text-sm text-gray-500 mb-1">{label}</p><p className="text-3xl font-bold text-gray-800">{value ?? '—'}</p></div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

const EditSlotModal = ({ slot, onClose, onSave }) => {
  const [maxVisitors, setMaxVisitors] = useState(slot.maxVisitors);
  const [status, setStatus] = useState(slot.status);
  const handleSave = async () => {
    try {
      await api.put(`/slots/${slot._id}`, { maxVisitors: Number(maxVisitors), status });
      onSave(); onClose();
    } catch (err) { alert('Failed to update slot'); }
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-xl font-bold text-orange-700 mb-4">Edit Slot</h3>
        <p className="text-sm text-gray-500 mb-4">{new Date(slot.date).toLocaleDateString()} | {slot.startTime} - {slot.endTime}</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Visitors</label>
          <input type="number" min="1" value={maxVisitors} onChange={e => setMaxVisitors(e.target.value)}
            className="w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-orange-200 rounded-md outline-none">
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg">Save</button>
          <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const AdminPortal = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [slots, setSlots] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [temples, setTemples] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotForm, setSlotForm] = useState({ date: '', startTime: '', endTime: '', maxVisitors: 100, temple: '' });
  const [templeForm, setTempleForm] = useState({ name: '', location: '', deity: '', description: '' });

  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => { fetchAll(); }, []);

  const fetchAll = () => {
    api.get('/slots').then(r => setSlots(r.data.sort((a, b) => new Date(b.date) - new Date(a.date)))).catch(() => { });
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => { });
    api.get('/admin/bookings').then(r => setAllBookings(r.data)).catch(() => { });
    api.get('/admin/users').then(r => setAllUsers(r.data)).catch(() => { });
    api.get('/temples/all').then(r => setTemples(r.data)).catch(() => { });
    api.get('/feedback').then(r => setFeedbacks(r.data)).catch(() => { });
    api.get('/feedback/donations').then(r => setDonations(r.data)).catch(() => { });
  };

  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/slots', slotForm);
      showToast('Slot Created Successfully!', 'success');
      setSlotForm({ date: '', startTime: '', endTime: '', maxVisitors: 100, temple: '' });
      fetchAll();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to create slot', 'error'); }
  };

  const handleTempleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/temples', templeForm);
      showToast('Temple Added Successfully!', 'success');
      setTempleForm({ name: '', location: '', deity: '', description: '' });
      fetchAll();
    } catch (err) { showToast('Failed to add temple', 'error'); }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this user's booking?")) return;
    try {
      await api.put(`/admin/bookings/${id}/cancel`);
      showToast('Booking cancelled', 'success');
      fetchAll(); // refresh data
    } catch (err) { showToast('Failed to cancel booking', 'error'); }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      await api.delete(`/slots/${id}`);
      showToast('Slot deleted successfully', 'success');
      fetchAll();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to delete slot', 'error'); }
  };

  const tabs = [
    { id: 'overview', label: <><BarChart2 className="inline mr-2" size={16} /> Overview</> },
    { id: 'slots', label: <><ClipboardList className="inline mr-2" size={16} /> Slots</> },
    { id: 'temples', label: '🛕 Temples' },
    { id: 'bookings', label: <><BookOpen className="inline mr-2" size={16} /> Bookings</> },
    { id: 'users', label: <><Users className="inline mr-2" size={16} /> Devotees</> },
    { id: 'feedback', label: <><Star className="inline mr-2" size={16} /> Feedback</> },
    { id: 'donations', label: <><Heart className="inline mr-2" size={16} /> Donations</> },
  ];

  const inputCls = "w-full px-4 py-2 border border-orange-200 rounded-md focus:border-orange-500 focus:ring focus:ring-orange-200 outline-none transition";

  const getBookingStatusStyle = (status) => {
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'confirmed') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 opacity-0-init animate-fade-in-up">
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-8 mb-6 shadow-md text-white hover:shadow-lg transition-shadow duration-300">
        <h1 className="text-4xl font-bold mb-1">Admin Portal</h1>
        <p className="text-orange-50">Manage Slots, Temples, Bookings, Feedback & Donations</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 opacity-0-init animate-fade-in-up animate-delay-100">
          <StatCard label="Today's Bookings" value={stats.todayBookings} icon={<Calendar className="text-orange-600" size={32} />} color="border-orange-600" />
          <StatCard label="Total Bookings" value={stats.totalBookings} icon={<Ticket className="text-orange-400" size={32} />} color="border-orange-400" />
          <StatCard label="Registered Devotees" value={stats.totalUsers} icon={<Users className="text-orange-600" size={32} />} color="border-orange-600" />
          <StatCard label="Total Slots" value={stats.totalSlots} icon={<Clock className="text-orange-400" size={32} />} color="border-orange-400" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-orange-100 opacity-0-init animate-fade-in-up animate-delay-200">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 font-medium rounded-t-lg text-sm transition-colors duration-300 ${activeTab === tab.id ? 'bg-orange-600 text-white shadow' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Recent Bookings</h3>
              {allBookings.slice(0, 5).map(b => (
                <div key={b._id} className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                  <span className="font-medium text-gray-700">{b.user?.name}</span>
                  <span className="text-orange-600 font-mono font-bold">{b.darshanToken}</span>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Recent Feedback</h3>
              {feedbacks.slice(0, 5).map(f => (
                <div key={f._id} className="py-2 border-b border-gray-100 text-sm">
                  <div className="flex justify-between items-center"><span className="font-medium">{f.user?.name}</span><div className="flex">{[...Array(f.rating)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}</div></div>
                  <p className="text-gray-500 truncate">{f.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours Sidebar */}
          <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
            <h3 className="font-bold text-orange-700 text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={20} /> Peak Hours
            </h3>
            {stats?.peakHours?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {stats.peakHours.map((ph, idx) => (
                  <div key={ph._id} className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{ph._id}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-orange-200 rounded-full w-24">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min((ph.count / stats.peakHours[0].count) * 100, 100)}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 w-6 text-right">{ph.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Not enough data to determine peak hours.</p>
            )}
            <div className="mt-6 pt-4 border-t border-orange-100 text-xs text-gray-500 leading-relaxed">
              Based on historical booking volume. Use this data to adjust slot capacities and staff deployment.
            </div>
          </div>
        </div>
      )}

      {/* TAB: SLOTS */}
      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 sticky top-24">
              <h2 className="text-xl font-bold text-orange-700 mb-4 border-b border-orange-100 pb-2">Create Slot</h2>
              <form onSubmit={handleSlotSubmit} className="flex flex-col gap-3">
                <div><label className="block text-sm font-medium mb-1 text-gray-700">Date</label><input type="date" value={slotForm.date} onChange={e => setSlotForm({ ...slotForm, date: e.target.value })} required className={inputCls} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1 text-gray-700">Start</label><input type="time" value={slotForm.startTime} onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })} required className={inputCls} /></div>
                  <div><label className="block text-sm font-medium mb-1 text-gray-700">End</label><input type="time" value={slotForm.endTime} onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })} required className={inputCls} /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1 text-gray-700">Max Visitors</label><input type="number" min="1" value={slotForm.maxVisitors} onChange={e => setSlotForm({ ...slotForm, maxVisitors: e.target.value })} required className={inputCls} /></div>
                <div><label className="block text-sm font-medium mb-1 text-gray-700">Temple</label>
                  <select value={slotForm.temple} onChange={e => setSlotForm({ ...slotForm, temple: e.target.value })} className={inputCls}>
                    <option value="">No Temple / General</option>
                    {temples.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg shadow">Create Slot</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-orange-100 pb-2">All Slots ({slots.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left"><thead><tr className="bg-orange-50 text-orange-800">
                  <th className="p-3">Date</th><th className="p-3">Temple</th><th className="p-3">Time</th><th className="p-3">Capacity</th><th className="p-3">Status</th><th className="p-3">Actions</th>
                </tr></thead><tbody>
                    {slots.map(slot => {
                      const isFull = slot.bookedCount >= slot.maxVisitors;
                      return (<tr key={slot._id} className="border-b border-gray-100 hover:bg-[#FFFDF5]">
                        <td className="p-3 font-medium">{new Date(slot.date).toLocaleDateString()}</td>
                        <td className="p-3 text-orange-600 text-xs">{slot.temple?.name || '—'}</td>
                        <td className="p-3">{slot.startTime}-{slot.endTime}</td>
                        <td className="p-3"><span className="font-bold">{slot.bookedCount}</span>/{slot.maxVisitors}</td>
                        <td className="p-3"><span className={`text-xs font-bold px-2 py-1 rounded ${slot.status === 'cancelled' ? 'bg-gray-200 text-gray-600' : isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{slot.status === 'cancelled' ? 'CANCELLED' : isFull ? 'FULL' : 'ACTIVE'}</span></td>
                        <td className="p-3 whitespace-nowrap">
                        <button onClick={() => setEditingSlot(slot)} className="text-orange-600 border border-orange-300 px-2 py-1 rounded text-xs hover:bg-orange-600 hover:text-white transition-colors duration-300 mr-2">Edit</button>
                        <button onClick={() => handleDeleteSlot(slot._id)} className="text-red-600 border border-red-300 px-2 py-1 rounded text-xs hover:bg-red-600 hover:text-white transition-colors duration-300">Delete</button>
                      </td>
                      </tr>);
                    })}
                  </tbody></table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TEMPLES */}
      {activeTab === 'temples' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 sticky top-24">
              <h2 className="text-xl font-bold text-orange-700 mb-4 border-b border-orange-100 pb-2">Add Temple</h2>
              <form onSubmit={handleTempleSubmit} className="flex flex-col gap-3">
                <div><label className="block text-sm font-medium mb-1 text-gray-700">Temple Name</label><input type="text" value={templeForm.name} onChange={e => setTempleForm({ ...templeForm, name: e.target.value })} required placeholder="e.g. Tirupati Balaji" className={inputCls} /></div>
                <div><label className="block text-sm font-medium mb-1 text-gray-700">Location</label><input type="text" value={templeForm.location} onChange={e => setTempleForm({ ...templeForm, location: e.target.value })} required placeholder="City, State" className={inputCls} /></div>
                <div><label className="block text-sm font-medium mb-1 text-gray-700">Deity</label><input type="text" value={templeForm.deity} onChange={e => setTempleForm({ ...templeForm, deity: e.target.value })} placeholder="e.g. Lord Venkateswara" className={inputCls} /></div>
                <div><label className="block text-sm font-medium mb-1 text-gray-700">Description</label><textarea value={templeForm.description} onChange={e => setTempleForm({ ...templeForm, description: e.target.value })} rows="3" className={inputCls + ' resize-none'} /></div>
                <button type="submit" className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg shadow">Add Temple</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {temples.map(t => (
                <div key={t._id} className="bg-white border border-orange-100 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">{t.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{t.status.toUpperCase()}</span>
                  </div>
                  <p className="text-orange-600 text-sm font-medium flex items-center gap-1"><MapPin size={14} /> {t.location}</p>
                  {t.deity && <p className="text-gray-500 text-sm mt-1">🛕 {t.deity}</p>}
                  {t.description && <p className="text-gray-500 text-xs mt-2 line-clamp-2">{t.description}</p>}
                </div>
              ))}
              {temples.length === 0 && <p className="text-gray-400 italic col-span-2 text-center py-8">No temples added yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* TAB: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-orange-100 pb-2">All Bookings ({allBookings.length})</h2>
          <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr className="bg-orange-50 text-orange-800">
            <th className="p-3">Token</th><th className="p-3">Devotee</th><th className="p-3">Temple</th><th className="p-3">Date</th><th className="p-3">Time</th><th className="p-3">Status</th><th className="p-3">Actions</th>
          </tr></thead><tbody>
              {allBookings.map(b => (
                <tr key={b._id} className="border-b border-gray-100 hover:bg-[#FFFDF5]">
                  <td className="p-3 font-mono text-orange-700 font-bold text-xs">{b.darshanToken}</td>
                  <td className="p-3"><div className="font-medium text-gray-800">{b.user?.name}</div><div className="text-xs text-gray-400">{b.user?.email}</div></td>
                  <td className="p-3 text-orange-600 text-xs">{b.slot?.temple?.name || '—'}</td>
                  <td className="p-3">{b.slot ? new Date(b.slot.date).toLocaleDateString() : '—'}</td>
                  <td className="p-3">{b.slot ? `${b.slot.startTime}-${b.slot.endTime}` : '—'}</td>
                  <td className="p-3"><span className={`text-xs font-bold px-2 py-1 rounded ${getBookingStatusStyle(b.status)}`}>{b.status.toUpperCase()}</span></td>
                  <td className="p-3">
                    {b.status === 'confirmed' && (
                      <button onClick={() => handleCancelBooking(b._id)} className="text-red-600 border border-red-300 px-2 py-1 rounded text-xs hover:bg-red-50">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody></table></div>
        </div>
      )}

      {/* TAB: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-orange-100 pb-2">All Devotees ({allUsers.length})</h2>
          <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr className="bg-orange-50 text-orange-800">
            <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Joined</th>
          </tr></thead><tbody>
              {allUsers.map(u => (
                <tr key={u._id} className="border-b border-gray-100 hover:bg-[#FFFDF5]">
                  <td className="p-3 font-medium text-gray-800">{u.name}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3"><span className={`text-xs font-bold px-2 py-1 rounded ${u.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>{u.role.toUpperCase()}</span></td>
                  <td className="p-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody></table></div>
        </div>
      )}

      {/* TAB: FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-orange-100 pb-2">All Feedback ({feedbacks.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map(f => (
              <div key={f._id} className="border border-orange-100 rounded-xl p-4 bg-[#FFFDF5]">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-800">{f.user?.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < f.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
                {f.temple && <p className="text-xs text-orange-600 mb-1">🛕 {f.temple?.name}</p>}
                <p className="text-gray-600 text-sm">{f.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(f.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {feedbacks.length === 0 && <p className="text-gray-400 italic col-span-2 text-center py-8">No feedback submitted yet.</p>}
          </div>
        </div>
      )}

      {/* TAB: DONATIONS */}
      {activeTab === 'donations' && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <div className="flex justify-between items-center mb-4 border-b border-orange-100 pb-2">
            <h2 className="text-xl font-bold text-gray-800">All Donations ({donations.length})</h2>
            <span className="text-orange-700 font-bold text-lg">
              Total: ₹{donations.reduce((s, d) => s + d.amount, 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr className="bg-orange-50 text-orange-800">
            <th className="p-3">Donor</th><th className="p-3">Amount</th><th className="p-3">Temple</th><th className="p-3">Method</th><th className="p-3">Message</th><th className="p-3">Date</th>
          </tr></thead><tbody>
              {donations.map(d => (
                <tr key={d._id} className="border-b border-gray-100 hover:bg-[#FFFDF5]">
                  <td className="p-3"><div className="font-medium">{d.donorName}</div><div className="text-xs text-gray-400">{d.email}</div></td>
                  <td className="p-3 font-bold text-green-700">₹{d.amount}</td>
                  <td className="p-3 text-orange-600 text-xs">{d.temple?.name || 'General'}</td>
                  <td className="p-3 capitalize text-gray-600">{d.paymentMethod}</td>
                  <td className="p-3 text-gray-500 max-w-xs truncate">{d.message || '—'}</td>
                  <td className="p-3 text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {donations.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-400 italic">No donations yet.</td></tr>}
            </tbody></table></div>
        </div>
      )}

      {editingSlot && (
        <EditSlotModal slot={editingSlot} onClose={() => setEditingSlot(null)}
          onSave={() => { fetchAll(); showToast('Slot updated!', 'success'); }} />
      )}
    </div>
  );
};

export default AdminPortal;
