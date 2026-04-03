import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Search, Heart, Globe, 
  User, LayoutDashboard, LogOut, 
  Settings, ShieldAlert, Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
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

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Find Donors', icon: Search, path: '/search' },
    { label: 'Community', icon: Globe, path: '/community' },
    { label: 'Health Center', icon: Heart, path: '/health' },
    { label: 'My Dashboard', icon: LayoutDashboard, path: getDashboardLink() },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 bg-slate-50 p-6 z-50">
      <div className="flex flex-col h-full bg-indigo-950 rounded-[40px] shadow-2xl shadow-indigo-900/40 relative overflow-hidden transition-all duration-700">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -ml-16 -mb-16"></div>

        {/* Brand Section */}
        <div className="p-10 relative z-10">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-500 shadow-glow">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-xl" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl text-white tracking-tight">LifeLink</span>
              <span className="font-extrabold text-[10px] text-sky-400 uppercase tracking-widest">Premium Core</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-6 space-y-3 relative z-10 custom-scrollbar overflow-y-auto pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-4 mb-4">Main Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`
                flex items-center gap-4 px-6 py-4 rounded-[24px] font-bold transition-all duration-500 group relative
                ${isActive(item.path) 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'}
              `}
            >
              {isActive(item.path) && (
                <div className="absolute left-0 w-1 h-6 bg-white rounded-full -ml-3 animate-in fade-in duration-500"></div>
              )}
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive(item.path) ? 'text-white' : 'text-white/40 group-hover:text-sky-400'}`} />
              <span className="text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}
          
          <div className="h-px bg-white/5 mx-4 my-8"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-4 mb-4">System</p>
          <Link to="/profile" className="flex items-center gap-4 px-6 py-4 rounded-[24px] font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <Sparkles className="w-5 h-5 text-white/20" />
            <span className="text-sm tracking-tight">Settings</span>
          </Link>
        </nav>

        {/* User Badge */}
        <div className="p-8 relative z-10">
          <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-5 border border-white/10 shadow-xl">
            {currentUser ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 group cursor-pointer hover:shadow-glow transition-all">
                    <User className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white font-black text-sm truncate uppercase tracking-tight">{currentUser.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-emerald-400/80 text-[10px] font-black uppercase tracking-wider">Active</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-400 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/5 hover:border-rose-500/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link to="/login" className="flex items-center justify-center h-12 bg-white text-indigo-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                  Access Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
