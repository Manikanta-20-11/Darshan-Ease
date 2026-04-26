import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Info, Calendar, Search } from 'lucide-react';

const TempleDirectory = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await api.get('/temples');
        setTemples(res.data);
      } catch (err) {
        console.error('Error fetching temples:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  const filteredTemples = temples.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.location.toLowerCase().includes(search.toLowerCase()) ||
    t.deity?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 opacity-0-init animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-500 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Temple Discovery Directory</h1>
          <p className="text-orange-100 max-w-2xl text-lg">Explore the sacred abodes, learn about their history, and plan your divine visit with ease.</p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <span className="text-9xl">🛕</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center opacity-0-init animate-fade-in-up animate-delay-100">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by temple name, location, or deity..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-orange-100 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-lg bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredTemples.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemples.map((temple, index) => (
            <div 
              key={temple._id} 
              className="bg-white rounded-2xl shadow-md border border-orange-50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group opacity-0-init animate-fade-in-up"
              style={{ animationDelay: `${(index % 6) * 100 + 200}ms` }}
            >
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-2xl group-hover:scale-110 transition-transform duration-300">🛕</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{temple.name}</h3>
                    <p className="text-orange-600 font-medium text-sm flex items-center gap-1">
                      <MapPin size={14} /> {temple.location}
                    </p>
                  </div>
                </div>

                {temple.deity && (
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-100 uppercase tracking-wider">
                    <Info size={12} /> {temple.deity}
                  </div>
                )}

                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4 flex-grow italic">
                  {temple.description || "Explore the divine presence and architectural beauty of this sacred temple. Plan your visit for a peaceful darshan experience."}
                </p>

                <div className="mt-auto space-y-3">
                   <button 
                    onClick={() => navigate('/book-slot', { state: { templeId: temple._id } })}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Calendar size={18} />
                    Book Darshan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-orange-100 opacity-0-init animate-fade-in">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No temples found</h3>
          <p className="text-gray-500">Try adjusting your search terms to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default TempleDirectory;
