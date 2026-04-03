import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function EmergencyAlert() {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSOS = () => {
    setActive(true);
    setCountdown(5);
    // Simulate countdown and then trigger the massive alert
    let counter = 5;
    const interval = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter <= 0) {
        clearInterval(interval);
        alert("CRITICAL SOS DEPLOYED! All nearby donors have received an instant override notification.");
        setActive(false);
      }
    }, 1000);
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${active ? 'bg-red-600 border-red-700 shadow-[0_0_30px_rgba(220,38,38,0.6)]' : 'bg-white border-red-100 shadow-sm'}`}>
      <div className="text-center">
        <h3 className={`font-bold mb-4 text-xl ${active ? 'text-white' : 'text-red-600'}`}>
          1-Click Emergency
        </h3>
        
        <button 
          onClick={handleSOS} 
          disabled={active}
          className={`w-32 h-32 rounded-full flex flex-col items-center justify-center mx-auto shadow-xl transition-all duration-300 relative ${active ? 'bg-red-800 scale-95' : 'bg-red-lifelink hover:bg-red-600 hover:scale-105 animate-pulse'}`}
        >
          {active && (
            <span className="absolute inset-0 rounded-full border-4 border-white opacity-20 animate-ping"></span>
          )}
          <AlertTriangle className={`w-12 h-12 mb-1 ${active ? 'text-red-300' : 'text-white'}`} />
          <span className={`font-black text-xl ${active ? 'text-red-200' : 'text-white'}`}>
            {active ? countdown : 'SOS'}
          </span>
        </button>

        <p className={`mt-4 text-sm font-medium ${active ? 'text-red-100' : 'text-gray-500'}`}>
          {active ? 'Deploying network...' : 'Press only in critical situations!'}
        </p>
      </div>
    </div>
  );
}
