import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { CalendarCheck, Ticket, Sparkles, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const features = [
  {
    icon: <CalendarCheck className="text-orange-600" size={36} />,
    title: 'Smart Slot Booking',
    desc: 'Choose your preferred date and time slot in advance. No more endless queues at the temple gates.',
  },
  {
    icon: <Ticket className="text-orange-600" size={36} />,
    title: 'Digital Darshan Token',
    desc: 'Receive a unique, verifiable Darshan Token instantly upon booking. Present it at the temple for entry.',
  },
  {
    icon: <Sparkles className="text-orange-600" size={36} />,
    title: 'Real-Time Availability',
    desc: 'See live capacity information for every slot. Green means go - experience peace of mind before you travel.',
  },
  {
    icon: <ShieldCheck className="text-orange-600" size={36} />,
    title: 'Secure & Verified',
    desc: 'Your bookings are secured with JWT authentication and bcrypt encryption. Your data is always safe.',
  },
];

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-32 px-8 text-center border-b border-orange-100 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(rgba(255, 253, 245, 0.5), rgba(255, 253, 245, 0.95)), url('/temple-bg.jpg')" }}
      >
        <div className="max-w-4xl mx-auto opacity-0-init animate-fade-in-up">

          <h1 className="text-5xl font-bold text-orange-800 mb-4 leading-tight">
            Seek Blessings,<br /> Not Long Queues
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Darshan Ease is a digital pilgrimage management platform. Book your sacred darshan slot in seconds and arrive at the temple with peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user?.role === 'admin' ? (
              <Link
                to="/admin"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
              >
                Manage Admin Portal
              </Link>
            ) : (
              <Link
                to={user ? "/book-slot" : "/register"}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
              >
                Book Darshan Now
              </Link>
            )}
            {!user && (
                <Link
                  to="/login"
                  className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-bold py-4 px-10 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg"
                >
                  Sign In
                </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Everything You Need for a Blessed Visit</h2>
          <p className="text-center text-gray-500 mb-12">From booking to temple entry - fully digital, fully divine.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-[#FFFDF5] border border-orange-100 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-orange-300 opacity-0-init animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-orange-700 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-t border-orange-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Book in 3 Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Register & Login', desc: 'Create a free account with your name and email in under a minute.' },
              { step: '2', title: 'Pick a Slot', desc: 'Choose your visit date and select an available time slot that suits you.' },
              { step: '3', title: 'Visit the Temple', desc: 'Show your unique Darshan Token at the gate and enter without any wait.' },
            ].map(({ step, title, desc }, index) => (
              <div 
                key={step} 
                className="flex flex-col items-center opacity-0-init animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-orange-600 text-white font-bold text-2xl flex items-center justify-center mb-4 shadow-md hover:scale-110 transition-transform duration-300">
                  {step}
                </div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            {!user ? (
              <Link
                to="/register"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
              >
                Get Started - It's Free
              </Link>
            ) : (
              <Link
                to={user.role === 'admin' ? "/admin" : "/dashboard"}
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
              >
                {user.role === 'admin' ? "Go to Admin Portal" : "Go to Dashboard"}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-600 text-orange-50 py-12 px-8 mt-auto shadow-inner">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-orange-500 pb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🛕 Darshan Ease
            </h3>
            <p className="text-orange-100 text-sm leading-relaxed max-w-sm">
              Digitizing the pilgrimage experience. We strive to provide a seamless, peaceful, and organized darshan booking process for devotees worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {user?.role === 'admin' ? (
                <>
                  <li><Link to="/admin" className="hover:text-white transition">Admin Portal</Link></li>
                  <li><Link to="/admin/verify" className="hover:text-white transition">Verify Tokens</Link></li>
                  <li><Link to="/profile" className="hover:text-white transition">Admin Profile</Link></li>
                </>
              ) : (
                <>
                  <li><Link to={user ? "/book-slot" : "/login"} state={!user ? { from: "/book-slot" } : null} className="hover:text-white transition">Book a Darshan</Link></li>
                  <li><Link to={user ? "/donate" : "/login"} state={!user ? { from: "/donate" } : null} className="hover:text-white transition">Make a Donation</Link></li>
                  <li><Link to={user ? "/feedback" : "/login"} state={!user ? { from: "/feedback" } : null} className="hover:text-white transition">Share Feedback</Link></li>
                  <li><Link to={user ? "/dashboard" : "/login"} className="hover:text-white transition">{user ? "My Dashboard" : "Devotee Login"}</Link></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact & Support</h4>
            <ul className="space-y-2 text-sm text-orange-100">
              <li className="flex items-center gap-2"><Mail size={16} /> support.darshanease@gmail.com</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +91 8364795288</li>
              <li className="flex items-start gap-2"><MapPin size={16} className="shrink-0 mt-0.5" /> <span>Sri Raghavendra Swamy Temple, jayanagar, Banglore</span></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-orange-200">
          <p>&copy; {new Date().getFullYear()} Darshan Ease. All rights reserved. Built for peace of mind.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
