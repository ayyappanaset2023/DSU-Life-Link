import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';
import { 
  User, Phone, MapPin, HeartPulse, Activity, 
  Award, Eye, Download, LogOut, ShieldAlert,
  ChevronRight, X, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { getUserCertificates, ensureRegistrationCertificate } = useDatabase();
  const [selectedCert, setSelectedCert] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Backfill: auto-generate registration cert for existing donors
  useEffect(() => {
    if (currentUser && currentUser.role === 'donor') {
      ensureRegistrationCertificate(currentUser);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-pulse">
        <div className="text-xl font-black text-slate-300 flex items-center gap-4 uppercase tracking-[0.3em]">
          <Activity className="animate-spin w-8 h-8 text-indigo-950" /> Syncing Identity...
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const name = currentUser?.name ?? "No Name";
  const phone = currentUser?.phone ?? "Not Available";
  const role = currentUser?.role ?? "Unknown Role";
  const bloodGroup = currentUser?.bloodGroup ?? "N/A";
  const location = currentUser?.location ?? "Location not set";
  const userCerts = getUserCertificates(currentUser.id) || [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      {/* Premium Profile Glass Card */}
      <div className="bg-white p-10 md:p-14 rounded-[56px] border border-slate-100 shadow-2xl shadow-indigo-950/5 relative overflow-hidden group">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
        
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12 relative z-10">
          <div className="relative">
            <div className="w-40 h-40 bg-indigo-950 rounded-[48px] flex items-center justify-center shadow-2xl relative overflow-hidden group/avatar">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-rose-600/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
               {role === 'donor' || role === 'patient' ? (
                  <span className="text-5xl font-black text-white tracking-widest leading-none drop-shadow-xl">{bloodGroup}</span>
               ) : (
                  <User className="w-16 h-16 text-white" />
               )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-3 rounded-2xl shadow-xl border-4 border-white animate-float">
               <ShieldAlert className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-3">
            <h1 className="text-5xl font-black text-indigo-950 tracking-tighter capitalize">{name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {role} Core Account
              </span>
              {role === 'donor' && currentUser?.isAvailable === false && (
                <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                  Mission On Hold
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid Bento Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-16">
          <div className="bg-slate-50 p-8 rounded-[36px] border border-indigo-50 hover:bg-white hover:shadow-xl transition-all duration-500 group">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" /> Secure Mobile Line
            </div>
            <div className="text-xl font-black text-indigo-950 tracking-tight">{phone}</div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[36px] border border-indigo-50 hover:bg-white hover:shadow-xl transition-all duration-500 group">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" /> Home Sector
            </div>
            <div className="text-xl font-black text-indigo-950 tracking-tight">{location}</div>
          </div>

          {(role === 'donor' || role === 'patient') && (
            <div className="bg-rose-50/30 p-8 rounded-[36px] border border-rose-100 md:col-span-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <HeartPulse className="w-12 h-12 text-rose-500/10 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3 relative z-10">Vital Signature</div>
              <div className="text-4xl font-black text-indigo-950 tracking-tighter relative z-10">{bloodGroup} Type</div>
            </div>
          )}
        </div>

        {/* Automated Certificates Section */}
        {userCerts.length > 0 && (
           <div className="border-t border-slate-100 pt-16 relative z-10">
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-3xl font-black text-indigo-950 tracking-tight flex items-center gap-3">
                    <Award className="w-8 h-8 text-amber-500" /> My <span className="text-blue-600">Badges</span>
                 </h2>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Verified Credentials</span>
              </div>

              {!userCerts || userCerts.length === 0 ? (
                 <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[48px] p-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                       <Award className="w-10 h-10 text-slate-200" />
                    </div>
                    <div>
                      <p className="text-indigo-950 text-sm font-black uppercase tracking-widest">No Medals Collected</p>
                      <p className="text-slate-400 text-xs font-bold mt-2">Finish a rescue mission to earn your first badge!</p>
                    </div>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {userCerts.map((cert) => (
                       <div key={cert.certificate_id} className="bg-white border border-slate-100 shadow-sm rounded-[40px] p-8 flex flex-col hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 group">
                          
                          <div className="flex justify-between items-start mb-8">
                             <div className="bg-amber-50 text-amber-600 w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 border border-amber-100 shadow-sm group-hover:rotate-12 transition-transform">
                                <Award className="w-8 h-8" />
                             </div>
                             <div className="text-right">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Authenticated</span>
                                <span className="text-sm font-black text-indigo-950">{cert.issue_date}</span>
                             </div>
                          </div>

                          <h3 className="font-black text-2xl text-indigo-950 tracking-tight leading-tight mb-8 flex-1 uppercase">
                             {cert.type}
                          </h3>

                          <div className="flex gap-4 pt-6 border-t border-slate-50">
                             <button
                                onClick={() => setSelectedCert(cert.pdf_url)}
                                className="flex-1 h-14 bg-slate-100 hover:bg-indigo-950 hover:text-white text-indigo-950 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                             >
                                <Eye className="w-4 h-4"/> View
                             </button>
                             <a
                                href={cert.pdf_url}
                                download={`${name.replace(/\s+/g, '_')}_${cert.type.replace(/\s+/g, '_')}.pdf`}
                                className="flex-1 h-14 bg-indigo-950 hover:bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-950/20 flex items-center justify-center gap-2"
                             >
                                <Download className="w-4 h-4"/> Save
                             </a>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        )}

        {/* Professional Logout Section */}
        <div className="mt-16 border-t border-slate-100 pt-10 flex justify-center lg:justify-end relative z-10">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="group flex items-center gap-3 bg-rose-50 hover:bg-rose-600 px-10 py-5 rounded-3xl text-rose-600 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] border border-rose-100 hover:border-transparent transition-all duration-500 active:scale-90 shadow-xl shadow-rose-500/5 hover:shadow-rose-500/20"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Terminate Session
          </button>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {selectedCert && (
         <div className="fixed inset-0 bg-indigo-950/95 z-[200] flex flex-col p-6 md:p-12 animate-in fade-in zoom-in duration-300 backdrop-blur-xl">
            <div className="w-full max-w-6xl mx-auto flex justify-between items-center mb-8 px-4">
               <h2 className="text-white font-black text-xl uppercase tracking-widest">Document Intel</h2>
               <button onClick={() => setSelectedCert(null)} className="text-white hover:text-rose-500 bg-white/10 p-4 rounded-3xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
                  <X className="w-5 h-5" /> Exit Preview
               </button>
            </div>
            <div className="flex-1 w-full max-w-6xl mx-auto bg-white rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-700">
               <iframe src={selectedCert} className="w-full h-full border-0" title="Certificate Viewer"></iframe>
            </div>
         </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-indigo-950/80 z-[300] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white max-w-sm w-full p-12 rounded-[56px] shadow-2xl border border-white text-center space-y-10 animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-rose-100">
              <LogOut className="w-10 h-10" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-indigo-950 tracking-tighter">Terminate Session?</h3>
              <p className="text-slate-400 font-bold text-sm leading-relaxed">
                Are you sure you want to exit the high-security portal? Unsaved coordination data may be lost.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleLogout}
                className="w-full h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-rose-600/30 transition-all active:scale-95"
              >
                Yes, Terminate
              </button>
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full h-16 bg-slate-50 hover:bg-slate-100 text-indigo-950 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
