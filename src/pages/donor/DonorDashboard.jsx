import React from 'react';
import { 
  Award, HeartPulse, Download, FileText, CheckCircle, 
  Navigation, AlertTriangle, TrendingUp, Calendar,
  Star, Share2, ShieldCheck, Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';
import { generateCertificate } from '../../components/donor/RewardCertificate';

export default function DonorDashboard() {
  const { currentUser } = useAuth();
  const { bloodRequests, updateBloodRequestStatus } = useDatabase();

  const handleDownload = (date) => {
    generateCertificate(currentUser?.name || "Donor Hero", currentUser?.bloodGroup || "A+", date);
  };

  // Filter active and accepted requests
  const activeRequests = (bloodRequests || []).filter(r => 
    r.status === 'Pending' || 
    (r.status === 'Donor Accepted' && r.donor_id === currentUser?.id)
  );

  // Mock past donations
  const donations = [
    { id: 1, date: 'Mar 15, 2026', hospital: 'Apollo Hospital', bloodGroup: 'A+' },
  ];

  const handleAcceptRequest = (reqId) => {
    updateBloodRequestStatus(reqId, { status: 'Donor Accepted', donor_id: currentUser?.id });
  };

  if (!currentUser) return (
    <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[40px] border border-slate-100 text-slate-400 font-black animate-in fade-in zoom-in duration-500">
      <Users className="w-16 h-16 mb-4 opacity-20" />
      PLEASE SIGN IN TO ACCESS THE DONOR PORTAL
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Profile & Stats */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Life Saver Badge Card */}
          <div className="bg-indigo-950 p-10 rounded-[48px] text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-28 h-28 bg-white/10 rounded-[40px] flex items-center justify-center border border-white/20 shadow-glow animate-float">
                  <span className="text-4xl font-black text-rose-400 tracking-tighter">{currentUser.bloodGroup || 'A+'}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl shadow-lg border-2 border-indigo-950">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">Verified Life Saver</p>
                <h2 className="text-3xl font-black tracking-tight">{currentUser.name}</h2>
              </div>

              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest text-amber-400 shadow-xl">
                 <Star className="w-4 h-4 fill-amber-400" />
                 Silver Donor Rank
              </div>

              <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div className="text-center p-4 bg-white/5 rounded-3xl">
                  <div className="text-2xl font-black text-white leading-none">{donations.length}</div>
                  <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Donations</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-3xl">
                  <div className="text-2xl font-black text-sky-400 leading-none">{donations.length * 500}</div>
                  <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Points</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Bento */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-rose-50 rounded-2xl group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6 text-rose-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Request</span>
            </button>
            <button className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Refer</span>
            </button>
          </div>
        </div>

        {/* Right Column: Alerts & History */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Emergency Broadcast Monitor */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-indigo-950 tracking-tight">Active <span className="text-rose-500">Broadcasts</span></h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 tracking-widest">Scanning Local Hubs</span>
              </div>
            </div>

            {!activeRequests || activeRequests.length === 0 ? (
               <div className="bg-white p-20 rounded-[48px] border-2 border-slate-100 border-dashed text-center space-y-6 group">
                 <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[32px] flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform">
                    <Zap className="w-10 h-10" />
                 </div>
                 <div className="space-y-1">
                   <h3 className="text-xl font-black text-indigo-950 uppercase tracking-tight">No Urgent Needs Found</h3>
                   <p className="text-slate-400 font-medium text-sm">We'll notify you instantly when a match appears.</p>
                 </div>
               </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeRequests.map(req => (
                  <div key={req.request_id} className={`group relative p-10 rounded-[56px] border-2 transition-all duration-700
                    ${req.status === 'Donor Accepted' ? 'bg-emerald-950 text-white border-emerald-900 shadow-2xl shadow-emerald-900/40' : 
                      req.urgencyLevel === 'Urgent' ? 'bg-white border-rose-500 shadow-2xl shadow-rose-500/10' : 
                      'bg-white border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-xl'}`}>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest 
                            ${req.status === 'Donor Accepted' ? 'bg-emerald-500 text-white' : 
                              req.urgencyLevel === 'Urgent' ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                            {req.status === 'Donor Accepted' ? 'Mission Active' : req.urgencyLevel}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${req.status === 'Donor Accepted' ? 'text-white/40' : 'text-slate-300'}`}>
                            ID: #{req.request_id.slice(-4)}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className={`text-4xl font-black tracking-tighter transition-all group-hover:translate-x-2 ${req.status === 'Donor Accepted' ? 'text-white' : 'text-indigo-950'}`}>
                             {req.hospitalName}
                          </h3>
                          <div className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest ${req.status === 'Donor Accepted' ? 'text-emerald-400' : 'text-slate-400'}`}>
                             <Navigation className="w-4 h-4" /> {req.location}
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-auto">
                        <div className={`aspect-square w-24 h-24 rounded-[32px] flex flex-col items-center justify-center border-2 mb-6 md:mb-0 mx-auto
                          ${req.status === 'Donor Accepted' ? 'bg-white/10 border-white/20' : 'bg-rose-50 border-rose-100'}`}>
                          <span className={`text-3xl font-black tracking-tighter ${req.status === 'Donor Accepted' ? 'text-white' : 'text-rose-500'}`}>
                            {req.bloodGroup}
                          </span>
                        </div>
                      </div>

                      <div className="w-full md:w-auto">
                        {req.status === 'Pending' ? (
                          <button onClick={() => handleAcceptRequest(req.request_id)} className="w-full md:w-48 h-16 bg-indigo-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-950/40 hover:scale-[1.05] active:scale-95 transition-all overflow-hidden relative group/btn">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            <span className="relative z-10">Accept Mission</span>
                          </button>
                        ) : (
                          <div className="flex flex-col items-center gap-2 bg-emerald-500/10 px-8 py-4 rounded-3xl border border-emerald-500/20">
                             <CheckCircle className="w-6 h-6 text-emerald-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Head to Facility</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Life History Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-indigo-950 tracking-tight">Your <span className="text-blue-500">History</span></h2>
            <div className="grid grid-cols-1 gap-4">
              {donations.map((doc) => (
                <div key={doc.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-700">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                       <Award className="w-8 h-8" />
                     </div>
                     <div className="space-y-1">
                       <h4 className="text-xl font-black text-indigo-950 tracking-tight leading-none uppercase">{doc.hospital}</h4>
                       <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                         <Calendar className="w-3.5 h-3.5" /> {doc.date}
                       </div>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleDownload(doc.date)}
                    className="flex items-center gap-3 bg-indigo-50 hover:bg-blue-600 text-indigo-600 hover:text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm hover:shadow-xl shadow-blue-600/20"
                  >
                    <Download className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                    Certificate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
