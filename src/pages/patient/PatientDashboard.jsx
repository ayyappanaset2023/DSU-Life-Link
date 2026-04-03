import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';
import { 
  Truck, MapPin, PhoneCall, CheckCircle, Activity, 
  AlertCircle, Droplet, Zap, Navigation, Clock,
  ShieldCheck, Phone, X
} from 'lucide-react';
import BloodRequest from './BloodRequest';

export default function PatientDashboard() {
  const { currentUser } = useAuth();
  const { createBooking, getPatientBookings } = useDatabase();
  const [activeTab, setActiveTab] = useState('blood');
  const [bookingStatus, setBookingStatus] = useState(null);
  const [driverETA, setDriverETA] = useState(null);

  const bookings = currentUser ? getPatientBookings(currentUser.id) : [];
  const activeBooking = bookings.find(b => b.status !== 'Completed');

  const requestAmbulance = () => {
    setBookingStatus('searching');
    createBooking({ patient_id: currentUser.id, location: currentUser.location || 'Current Location' });
    
    setTimeout(() => {
      setBookingStatus('found');
      setDriverETA('10 mins');
    }, 2000);
  };

  if (!currentUser || !['patient', 'donor', 'hospital'].includes(currentUser.role)) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-rose-50 rounded-[40px] border border-rose-100 text-rose-600 font-black animate-in fade-in zoom-in duration-500">
        <ShieldCheck className="w-16 h-16 mb-4 animate-bounce" />
        SECURE PATIENT PORTAL ACCESS REQUIRED
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      {/* Premium Command Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="space-y-1 relative z-10">
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight">Patient <span className="text-blue-600">Command Center</span></h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest tracking-widest">Global Rescue Status Monitor</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-[24px] relative z-10 w-full lg:w-auto shadow-inner">
           <button 
             onClick={() => setActiveTab('blood')} 
             className={`flex-1 lg:flex-none px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2
               ${activeTab === 'blood' ? 'bg-indigo-950 text-white shadow-xl shadow-indigo-950/20' : 'text-slate-400 hover:text-indigo-950'}`}>
             <Droplet className={`w-3.5 h-3.5 ${activeTab === 'blood' ? 'fill-rose-500 text-rose-500' : ''}`} />
             Emergency Blood
           </button>
           <button 
             onClick={() => setActiveTab('ambulance')} 
             className={`flex-1 lg:flex-none px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2
               ${activeTab === 'ambulance' ? 'bg-indigo-950 text-white shadow-xl shadow-indigo-950/20' : 'text-slate-400 hover:text-indigo-950'}`}>
             <Truck className="w-3.5 h-3.5" />
             Ambulance Dispatch
           </button>
        </div>
      </div>

      {activeTab === 'blood' && (
         <div className="animate-in fade-in slide-in-from-right-10 duration-700">
           <BloodRequest />
         </div>
      )}

      {activeTab === 'ambulance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Dispatch Command Panel */}
          <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group">
             {bookingStatus === null && !activeBooking && (
                <div className="text-center space-y-10 animate-in fade-in zoom-in duration-500">
                  <div className="relative">
                    <div className="w-32 h-32 bg-blue-50 rounded-[40px] flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-700">
                      <Truck className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="absolute -top-4 -right-4 bg-emerald-500 p-3 rounded-2xl shadow-xl animate-[pulse_2s_infinite]">
                      <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-black text-indigo-950 tracking-tighter">Need Immediate <span className="text-blue-600">Dispatch</span>?</h2>
                    <p className="text-slate-400 font-medium text-base max-w-sm mx-auto leading-relaxed">
                      Tap the emergency broadcast button to instantly alert all available LifeLink drivers within 15km.
                    </p>
                  </div>

                  <button 
                    onClick={requestAmbulance} 
                    className="group relative bg-indigo-950 hover:bg-indigo-900 text-white font-black text-[10px] uppercase tracking-[0.3em] h-16 px-12 rounded-3xl shadow-2xl shadow-indigo-950/40 transition-all active:scale-90 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative z-10 flex items-center gap-3 justify-center">
                      <Activity className="w-4 h-4 animate-pulse text-blue-400" />
                      Initialize Dispatch
                    </span>
                  </button>
                </div>
             )}

             {(bookingStatus === 'searching' || activeBooking?.status === 'Pending') && (
                <div className="flex flex-col items-center space-y-10 py-10 animate-in fade-in zoom-in duration-700">
                   <div className="relative w-40 h-40 flex items-center justify-center">
                     <div className="absolute inset-0 bg-blue-600/10 rounded-full animate-[ping_2s_infinite]"></div>
                     <div className="absolute inset-4 bg-blue-500/10 rounded-full animate-[ping_3s_infinite] delay-500"></div>
                     <div className="bg-indigo-950 w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl z-10 relative">
                        <Truck className="w-8 h-8 text-white" />
                     </div>
                   </div>
                   <div className="text-center space-y-3">
                     <h2 className="text-2xl font-black text-indigo-950 tracking-tighter animate-pulse uppercase tracking-widest">Broadcasting Emergency Signal</h2>
                     <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Searching Global Grid Units...</p>
                   </div>
                </div>
             )}

             {(bookingStatus === 'found' || activeBooking?.status === 'On the way') && (
                <div className="w-full space-y-8 animate-in slide-in-from-bottom-10 duration-1000">
                  <div className="bg-emerald-50 text-emerald-700 p-6 rounded-[32px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 border border-emerald-100">
                    <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    Rescue Intercept Initiated
                  </div>
                  
                  <div className="bg-indigo-950 p-10 rounded-[48px] shadow-2xl shadow-indigo-900/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white font-black text-2xl px-8 py-5 rounded-bl-[40px] shadow-xl">
                      <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1 leading-none">ETA</div>
                      {driverETA || '7m'}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sky-400 font-black text-[10px] uppercase tracking-widest">Assigned Specialist</p>
                      <h3 className="text-3xl font-black text-white tracking-tight">Rajesh Kumar</h3>
                      <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest pt-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Licensed Paramedic
                      </div>
                    </div>
                    
                    <div className="mt-10 flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl max-w-max font-black tracking-[0.3em] text-white">
                      MH-02-ER-9911
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button className="flex-1 h-16 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 active:scale-95 transition-all transition-all">
                       <Phone className="w-4 h-4 fill-white" /> Contact Specialist
                     </button>
                     <button className="w-16 h-16 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-3xl flex items-center justify-center transition-all active:rotate-90">
                       <X className="w-6 h-6" />
                     </button>
                  </div>
                </div>
             )}
          </div>

          {/* Live GPRS Intel Feed */}
          <div className="bg-indigo-950 rounded-[56px] shadow-2xl relative overflow-hidden min-h-[500px]">
             {/* Map Background Simulation */}
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px]"></div>
             
             {bookingStatus === 'found' ? (
                <div className="relative z-10 w-full h-full p-12 flex flex-col justify-between">
                   <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl flex items-center gap-3 self-start">
                     <MapPin className="text-rose-500 fill-rose-500"/> Patient (Current GPS)
                   </div>
                   
                   <div className="flex-1 relative">
                       <svg className="absolute inset-0 w-full h-full overflow-visible">
                          <path 
                            d="M 50 150 Q 200 400 400 200" 
                            fill="transparent" 
                            stroke="url(#gradient)" 
                            strokeWidth="4" 
                            strokeDasharray="10 10" 
                            className="animate-[dash_2s_linear_infinite]"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#ef4444" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                          </defs>
                       </svg>
                   </div>

                   <div className="bg-blue-600 p-5 rounded-[28px] font-black text-xs uppercase tracking-widest text-white shadow-2xl shadow-blue-600/40 flex items-center gap-3 self-end animate-float">
                     <Truck className="w-5 h-5"/> LifeLink Unit #704
                   </div>
                </div>
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
                 <div className="w-20 h-20 border-2 border-white/10 rounded-full flex items-center justify-center animate-spin duration-3000">
                    <Navigation className="w-8 h-8 text-white/20" />
                 </div>
                 <div className="text-center space-y-1">
                   <p className="text-white font-black text-xs uppercase tracking-[0.3em]">Live Intelligence Feed</p>
                   <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Waiting for Unit Signal...</p>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
