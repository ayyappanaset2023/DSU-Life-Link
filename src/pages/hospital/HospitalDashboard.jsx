import React, { useState } from 'react';
import { 
  Droplet, AlertTriangle, CheckCircle, PackageSearch, 
  Users, TrendingUp, History, Info, Plus, Minus,
  Activity, Zap, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';

export default function HospitalDashboard() {
  const { currentUser } = useAuth();
  const { bloodRequests, updateBloodRequestStatus, healthVideos } = useDatabase();
  
  const [stock, setStock] = useState({
    'A+': { count: 12, status: 'sufficient' },
    'A-': { count: 3, status: 'low' },
    'O+': { count: 8, status: 'low' },
    'O-': { count: 0, status: 'critical' },
  });

  if (!currentUser || currentUser.role !== 'hospital') {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-rose-50 rounded-[40px] border border-rose-100 text-rose-600 font-black animate-in fade-in zoom-in duration-500">
        <AlertTriangle className="w-16 h-16 mb-4 animate-bounce" />
        HOSPITAL COMMAND CENTER ACCESS REQUIRED
      </div>
    );
  }

  // Filter requests for THIS specific hospital
  const myRequests = (bloodRequests || []).filter(r => 
    r.hospitalName?.toLowerCase() === currentUser.name?.toLowerCase() && 
    r.status !== 'Completed'
  );

  const updateStock = (group, delta) => {
    setStock(prev => {
      const newCount = Math.max(0, prev[group].count + delta);
      let newStatus = 'sufficient';
      if (newCount === 0) newStatus = 'critical';
      else if (newCount < 10) newStatus = 'low';
      return { ...prev, [group]: { count: newCount, status: newStatus } };
    });
  };

  const verifyArrival = (reqId) => {
    updateBloodRequestStatus(reqId, { status: 'Hospital Confirmed' });
  };

  const completeDonation = (reqId, group) => {
    updateBloodRequestStatus(reqId, { status: 'Completed' });
    if (stock[group]) updateStock(group, 1);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      {/* Dashboard Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Requests', value: myRequests.length, icon: Activity, color: 'rose' },
          { label: 'Units Dispensed', value: '124', icon: Droplet, color: 'indigo' },
          { label: 'Response Rate', value: '98%', icon: Zap, color: 'blue' },
          { label: 'Total Verified', value: '850', icon: ShieldCheck, color: 'emerald' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
            <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center mb-6 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-indigo-950 tracking-tighter">{stat.value}</div>
            <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Modular Bento: Inventory Overview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="flex justify-between items-end mb-12 relative z-10">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-indigo-950 tracking-tight">Blood Inventory <span className="text-blue-500">Center</span></h2>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Real-Time Stock Monitoring</p>
              </div>
              <button className="bg-indigo-950 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-950/20 active:scale-95 transition-all">
                Export Report
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {Object.keys(stock).map((group) => (
                <div key={group} className={`p-6 rounded-[32px] border-2 flex flex-col items-center justify-center transition-all duration-500 hover:scale-[1.03] group/card
                  ${stock[group].status === 'critical' ? 'bg-rose-50 border-rose-100 text-rose-600' : 
                    stock[group].status === 'low' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                    'bg-slate-50 border-slate-200 text-slate-800'}`}>
                  
                  <div className="text-2xl font-black tracking-tighter mb-1 uppercase">{group}</div>
                  <div className="text-4xl font-black text-indigo-950 my-2">{stock[group].count}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Units Available</div>
                  
                  <div className="grid grid-cols-2 gap-2 w-full">
                     <button onClick={() => updateStock(group, -1)} className="aspect-square bg-white border border-black/5 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all">
                        <Minus className="w-4 h-4" />
                     </button>
                     <button onClick={() => updateStock(group, 1)} className="aspect-square bg-white border border-black/5 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all">
                        <Plus className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights Section */}
          <div className="bg-indigo-950 p-10 rounded-[48px] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
             <TrendingUp className="w-20 h-20 text-sky-400 absolute opacity-10 -right-4 -bottom-4 rotate-12" />
             <div className="flex-1 space-y-4">
               <h3 className="text-2xl font-black tracking-tight leading-none">System Optimization Advised</h3>
               <p className="text-white/60 text-sm font-medium max-w-sm">
                 Blood Group <span className="text-rose-400 font-black">O- Negative</span> is currently trending at critical levels. Automated broadcasts are active.
               </p>
             </div>
             <button className="bg-white text-indigo-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
               View Trends
             </button>
          </div>
        </div>

        {/* Live Event Feed & Interactions */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-4 px-4">
             <h2 className="text-xl font-black text-indigo-950 tracking-tight uppercase tracking-widest">Active Requests</h2>
             <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          </div>
          
          {myRequests.length === 0 ? (
            <div className="bg-white border-2 border-slate-100 border-dashed rounded-[40px] p-16 text-center space-y-6">
               <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto">
                  <PackageSearch className="w-10 h-10" />
               </div>
               <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No Active Broadcasts</p>
            </div>
          ) : (
             <div className="grid grid-cols-1 gap-6">
               {myRequests.map(req => (
                 <div key={req.request_id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative group overflow-hidden">
                   <div className="absolute top-0 right-0 w-2 h-full bg-blue-500 group-hover:w-4 transition-all"></div>
                   
                   <div className="flex justify-between items-start mb-6">
                     <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full
                       ${req.urgencyLevel === 'Urgent' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                        {req.urgencyLevel}
                     </span>
                     <span className="text-slate-300 text-[10px] font-black">#{req.request_id.slice(-4)}</span>
                   </div>

                   <h3 className="text-3xl font-black text-indigo-950 tracking-tighter mb-1 uppercase">
                     {req.bloodGroup} <span className="text-blue-500">Needed</span>
                   </h3>
                   <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-8 uppercase tracking-widest tracking-widest">
                     <History className="w-4 h-4" /> Received 2m ago
                   </div>

                   <div className="space-y-4">
                      {req.status === 'Donor Accepted' ? (
                        <button onClick={() => verifyArrival(req.request_id)} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4 fill-white" /> Verify Donor Arrival
                        </button>
                      ) : req.status === 'Hospital Confirmed' ? (
                        <button onClick={() => completeDonation(req.request_id, req.bloodGroup)} className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-3xl transition-all active:scale-95 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5"/> Collect Complete
                        </button>
                      ) : (
                        <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 justify-center py-4 bg-slate-50 rounded-2xl">
                          <Activity className="w-4 h-4 animate-pulse" /> Scanning for Donors
                        </div>
                      )}
                   </div>
                 </div>
               ))}
             </div>
          )}

          {/* Activity Insight */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 flex items-center gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <Info className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                Hospital profile is being viewed by 2 donors nearby.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
