import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookSlot from './pages/BookSlot';
import AdminPortal from './pages/AdminPortal';
import HomePage from './pages/HomePage';
import DonatePage from './pages/DonatePage';
import FeedbackPage from './pages/FeedbackPage';
import ProfilePage from './pages/ProfilePage';
import VerifyToken from './pages/VerifyToken';
import TempleDirectory from './pages/TempleDirectory';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div 
            className="min-h-screen text-gray-800 flex flex-col bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "linear-gradient(rgba(255, 253, 245, 0.75), rgba(255, 253, 245, 0.95)), url('/temple-bg.jpg')" }}
          >
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/book-slot" element={<BookSlot />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin/verify" element={<VerifyToken />} />
                <Route path="/temples" element={<TempleDirectory />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
