import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Search, Heart, Globe, 
  User, LayoutDashboard, Bell, 
  HelpCircle, ChevronDown, Zap,
  ShieldAlert, Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Topbar() {
  const { currentUser } = useAuth();
  const location = useLocation();

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

  const navItems = currentUser?.role === 'admin' 
    ? [
        { label: 'Overview', icon: Home, path: '/' },
        { label: 'Command Center', icon: ShieldAlert, path: '/admin' },
        { label: 'User Console', icon: Users, path: '/admin' },
        { label: 'System Analytics', icon: Zap, path: '/admin' },
      ]
    : [
        { label: 'Home', icon: Home, path: '/' },
        { label: 'Find Donors', icon: Search, path: '/search' },
        { label: 'Community', icon: Globe, path: '/community' },
        { label: 'Health Center', icon: Heart, path: '/health' },
        { label: 'My Dashboard', icon: LayoutDashboard, path: getDashboardLink() },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="hidden lg:flex h-20 bg-white/70 backdrop-blur-2xl border-b border-slate-200 sticky top-0 z-[100] px-8 items-center justify-between transition-all duration-500 shadow-sm">
      
      {/* Brand & Logo Section */}
      <div className="flex items-center gap-4 min-w-max">
        <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
          <div className="p-2 bg-indigo-950 rounded-xl shadow-lg shadow-indigo-950/20 group-hover:shadow-indigo-900/40 transition-all">
            <img src="/logo.png" alt="Logo" className="h-7 w-7" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-indigo-950 tracking-tight leading-none">LifeLink</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">Premium Core</span>
          </div>
        </Link>
      </div>

      {/* Center Horizontal Navigation */}
      <nav className="flex-1 flex justify-center px-10 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all duration-500 relative group
              ${isActive(item.path) 
                ? 'bg-indigo-950 text-white shadow-xl shadow-indigo-950/30 overflow-hidden' 
                : 'text-slate-500 hover:text-indigo-950 hover:bg-slate-100'}
            `}
          >
            {isActive(item.path) && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            )}
            <item.icon className="w-4 h-4" />
            <span className="text-sm tracking-tight">{item.label}</span>
            {isActive(item.path) && (
              <span className="absolute bottom-1 w-1 h-1 bg-sky-400 rounded-full animate-pulse shadow-glow shadow-sky-400"></span>
            )}
          </Link>
        ))}
      </nav>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-6 min-w-max">
        {/* Compact Search Toggle Icon */}
        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse shadow-lg"></span>
        </button>

        <div className="h-8 w-px bg-slate-200"></div>

        {/* User Badge Profile */}
        {currentUser ? (
          <Link to="/profile" className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl group transition-all hover:bg-white hover:shadow-xl hover:border-transparent active:scale-95">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-black text-indigo-950 tracking-tight leading-none uppercase">
                {currentUser.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Zap className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />
                <span className="text-[8px] font-black uppercase tracking-wider text-emerald-600">Session Active</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 ml-1 group-hover:translate-y-0.5 transition-transform" />
          </Link>
        ) : (
          <Link to="/login" className="bg-indigo-950 text-white px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-950/20 hover:scale-[1.03] active:scale-95 transition-all">
             Portal Login
          </Link>
        )}
      </div>
    </div>
  );
}
