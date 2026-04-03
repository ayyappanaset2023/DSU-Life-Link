import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, User, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { currentUser } = useAuth();

  return (
    <header className="lg:hidden h-20 bg-white/70 backdrop-blur-2xl border-b border-white/40 sticky top-0 z-[90] px-6 flex items-center justify-between transition-all duration-500 shadow-sm">
      <Link to="/" className="flex items-center gap-3 active:scale-95 transition-all">
        <div className="p-1.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30">
          <img src="/logo.png" alt="LifeLink" className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg text-slate-900 leading-none tracking-tight">LifeLink</span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-500">Premium Core</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <Link 
          to="/search" 
          className="relative group overflow-hidden bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-2xl shadow-rose-500/40 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <AlertCircle className="w-4 h-4 fill-white/20 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">SOS</span>
        </Link>
        
        <Link 
          to="/profile" 
          className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center active:scale-90 shadow-sm transition-all group"
        >
          <User className="w-5 h-5 text-indigo-500 transition-transform group-active:scale-110" />
        </Link>
      </div>
    </header>
  );
}
