import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';
import { Power, MapPin, Truck, AlertTriangle, PhoneCall } from 'lucide-react';

export default function AmbulanceDashboard() {
  const { currentUser } = useAuth();
  const { ambulanceBookings, updateBookingStatus } = useDatabase();
  
  const [isOnline, setIsOnline] = useState(false);

  // Get active requests (Pending) globally matching this driver's city/zone (mocked as 'all' for now)
  const incomingRequests = ambulanceBookings.filter(b => b.status === 'Pending');
  
  // Get active trip for THIS driver
  const myTrip = ambulanceBookings.find(b => b.driver_id === currentUser?.id && b.status === 'On the way');

  if (!currentUser || currentUser.role !== 'driver') {
    return <div className="p-8 text-center text-red-600 font-bold">Driver account required.</div>;
  }

  const handleAccept = (bookingId) => {
    updateBookingStatus(bookingId, { status: 'On the way', driver_id: currentUser.id });
  };

  const handleComplete = (bookingId) => {
    updateBookingStatus(bookingId, { status: 'Completed' });
    alert("Trip marked as completed. Ready for next dispatch.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-900 text-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-800">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
           <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center border-4 border-gray-700">
             <Truck className="w-8 h-8 text-white" />
           </div>
           <div>
             <h1 className="text-2xl font-bold">{currentUser.name}</h1>
             <div className="text-blue-400 font-mono font-medium">{currentUser.vehicleNumber || 'MH 02 ER 9911'}</div>
           </div>
        </div>
        
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-lg transition-colors ${isOnline ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          <Power className="w-5 h-5"/> {isOnline ? 'ONLINE' : 'GO ONLINE'}
        </button>
      </div>

      {!isOnline ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
           <Power className="w-16 h-16 mx-auto text-gray-300 mb-4" />
           <h2 className="text-2xl font-bold text-gray-400">You are Offline</h2>
           <p className="text-gray-500">Go online to receive emergency dispatch signals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          
          {/* Active Trip Context */}
          {myTrip && (
            <div className="bg-blue-50 border-2 border-blue-500 rounded-2xl p-6 shadow-lg shadow-blue-500/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-xl font-bold text-sm tracking-widest uppercase">
                 Active Trip
               </div>
               <h2 className="text-2xl font-black text-blue-900 mb-2 flex items-center gap-2">
                 <AlertTriangle fill="currentColor" className="text-red-500" /> Patient Emergency
               </h2>
               
               <div className="bg-white p-4 rounded-xl border border-blue-100 flex items-start gap-4 mb-6">
                 <MapPin className="text-red-500 shrink-0 mt-1" />
                 <div>
                   <div className="font-bold text-gray-900 text-lg">Pick up at:</div>
                   <div className="text-gray-600">{myTrip.location}</div>
                 </div>
               </div>

               <div className="flex gap-4">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm text-lg transition-transform active:scale-95">
                    <PhoneCall className="w-6 h-6"/> Call Patient
                  </button>
                  <button onClick={() => handleComplete(myTrip.booking_id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-sm text-lg transition-transform active:scale-95">
                    Mark Completed
                  </button>
               </div>
            </div>
          )}

          {/* Incoming Dispatch Queue */}
          {!myTrip && incomingRequests.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-500 mb-4 tracking-widest uppercase text-sm">Nearby Dispatch Signals</h3>
              <div className="space-y-4">
                {incomingRequests.map(req => (
                  <div key={req.booking_id} className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-500 flex flex-col md:flex-row justify-between items-center gap-4 animate-in slide-in-from-right">
                    <div>
                       <div className="font-black text-xl text-gray-900 mb-1 flex items-center gap-2">
                         <AlertTriangle className="text-red-500 w-5 h-5" /> Emergency SOS
                       </div>
                       <div className="text-gray-600 flex items-center gap-1 font-medium bg-gray-50 px-2 py-1 rounded">
                         <MapPin className="w-4 h-4 text-gray-400" /> {req.location}
                       </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                       <button className="flex-1 md:flex-none border border-gray-300 bg-gray-50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 font-bold px-6 py-3 rounded-xl transition-colors">
                         Decline
                       </button>
                       <button onClick={() => handleAccept(req.booking_id)} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-3 rounded-xl shadow-md transition-transform active:scale-95">
                         ACCEPT
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!myTrip && incomingRequests.length === 0 && (
             <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-inner">
               <div className="relative w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin opacity-30"></div>
                  <Truck className="w-8 h-8 text-green-600 relative z-10" />
               </div>
               <h3 className="font-bold text-gray-700 text-lg">Listening for Signals...</h3>
               <p className="text-gray-400 text-sm">You are online and ready.</p>
             </div>
          )}

        </div>
      )}
    </div>
  );
}
