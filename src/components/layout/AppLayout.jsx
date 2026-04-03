import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Header from './Header';
import Topbar from './Topbar';
import Footer from './Footer';
import FloatingChatBot from '../common/FloatingChatBot';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans transition-all duration-500 overflow-x-hidden selection:bg-rose-500/10 selection:text-rose-600">
      
      {/* Desktop Horizontal Navigation Hub */}
      <Topbar />

      {/* Main Content Area (Full Width) */}
      <div className="flex-1 flex flex-col relative w-full transition-all duration-300">
        
        {/* Mobile Minimal Header */}
        <Header />

        {/* Dynamic Route Content with Modular Spacing */}
        <main className="flex-grow md:p-8 lg:p-12 pb-32 lg:pb-12 max-w-7xl mx-auto w-full transition-all duration-500 min-h-screen">
          <Outlet />
        </main>

        {/* Global Footer (Visible only on Desktop) */}
        <Footer className="hidden lg:block border-t border-slate-100 bg-white/50 backdrop-blur-md opacity-40 hover:opacity-100 transition-opacity" />
      </div>

      {/* Mobile Experience Nav */}
      <BottomNav />

      {/* AI Intelligence Hub (Z-indexed) */}
      <div className="fixed bottom-28 right-6 lg:bottom-12 lg:right-12 z-[100] animate-in fade-in zoom-in duration-700 delay-1000">
        <FloatingChatBot />
      </div>
    </div>
  );
}
