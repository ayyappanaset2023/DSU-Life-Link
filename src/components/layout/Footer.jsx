import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="DSU LifeLink Logo" className="h-8 w-8 rounded-full shadow-sm border border-gray-100 grayscale hover:grayscale-0 transition-all opacity-80" />
            <span className="font-semibold text-lg text-gray-900">DSU LifeLink</span>
          </div>
          <div className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-lifelink fill-red-lifelink" /> for saving lives.
          </div>
        </div>
      </div>
    </footer>
  );
}
