import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function BottomNav() {
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

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Find', icon: Search, path: '/search' },
    { label: 'Health', icon: Heart, path: '/health' },
    { label: 'Board', icon: LayoutDashboard, path: getDashboardLink() },
    { label: 'Me', icon: User, path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-6 left-6 right-6 lg:hidden z-[100] animate-in fade-in slide-in-from-bottom-5 duration-700">
      <nav className="bg-white/70 backdrop-blur-3xl border border-white/40 shadow-[0_20px_50px_-20px_rgba(30,27,75,0.4)] rounded-[32px] h-[72px] flex items-center justify-around px-4 relative overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 via-transparent to-rose-50/20 pointer-events-none"></div>

        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`
              flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-500 relative group
              ${isActive(item.path) ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600 active:scale-90'}
            `}
          >
            {isActive(item.path) && (
              <div className="absolute -top-4 w-12 h-8 bg-blue-500/10 blur-xl rounded-full"></div>
            )}
            <item.icon className={`w-5 h-5 transition-all duration-300 ${isActive(item.path) ? 'fill-blue-600/10' : 'group-hover:translate-y-[-2px]'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
