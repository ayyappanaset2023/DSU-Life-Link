import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, User, Globe, LayoutDashboard, Search, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/';
    switch (currentUser.role) {
      case 'admin': return '/admin';
      case 'hospital': return '/hospital';
      case 'driver': return '/driver';
      case 'patient': return '/patient/request';
      default: return '/donor';
    }
  };
  const dashboardLink = getDashboardLink();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="DSU LifeLink Logo" className="h-10 w-10 rounded-full shadow-sm border border-gray-200" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">DSU LifeLink</span>
            </Link>
            
            <div className="hidden md:flex gap-6 border-l border-gray-200 pl-6">
               <Link to="/search" className="flex items-center gap-1 text-gray-600 hover:text-red-lifelink font-medium transition-colors">
                  <Search className="w-4 h-4" /> Find Donors
               </Link>
               <Link to="/community" className="flex items-center gap-1 text-gray-600 hover:text-red-lifelink font-medium transition-colors">
                  <Globe className="w-4 h-4" /> Community Wall
               </Link>
               <Link to="/health" className="flex items-center gap-1 text-gray-600 hover:text-red-lifelink font-medium transition-colors">
                  <Heart className="w-4 h-4" /> Health Assistant
               </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to={dashboardLink} className="hidden md:flex items-center gap-1 text-gray-600 hover:text-red-lifelink font-medium mr-2 transition-colors">
                   <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/profile" className="hidden sm:flex items-center gap-2 mr-4 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="capitalize">{currentUser.name || 'User'} ({currentUser.role || 'guest'})</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-lifelink font-medium p-2 flex items-center gap-1 transition-colors bg-red-50 hover:bg-red-100 rounded-lg">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-red-lifelink hover:bg-red-lifelink-hover text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
