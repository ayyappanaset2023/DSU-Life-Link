import React, { useState } from 'react';
import { 
  Activity, CheckCircle, XCircle, Droplet, 
  Users, ShieldAlert, TrendingUp, Search,
  Filter, MoreVertical, ExternalLink, Zap,
  Play, Trash2, Plus, Film
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { 
    bloodRequests, updateBloodRequestStatus, users,
    healthVideos, addHealthVideo, deleteHealthVideo
  } = useDatabase();
  
  const allUsers = users || [];
  const allRequests = bloodRequests || [];

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'users' | 'analytics' | 'health'
  const [newVideo, setNewVideo] = useState({ title: '', youtube_id: '', category: 'headache' });

  const handleApprove = (id) => {
    updateBloodRequestStatus(id, { status: 'Verified' });
  };

  const handleReject = (id) => {
    updateBloodRequestStatus(id, { status: 'Rejected' });
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.youtube_id) return;

    // Helper to extract ID from full URL
    const extractId = (input) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = input.match(regExp);
      return (match && match[2].length === 11) ? match[2] : input;
    };

    const finalId = extractId(newVideo.youtube_id);
    addHealthVideo({ ...newVideo, youtube_id: finalId });
    setNewVideo({ title: '', youtube_id: '', category: 'headache' });
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-rose-50 rounded-[40px] border border-rose-100 text-rose-600 font-black animate-in fade-in zoom-in duration-500">
        <ShieldAlert className="w-16 h-16 mb-4 animate-bounce" />
        ADMIN COMMAND CENTER ACCESS DENIED
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      {/* Admin Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Donors', value: allUsers.filter(u => u.role === 'donor').length, icon: Users, bgColor: 'bg-blue-50', textColor: 'text-blue-500' },
          { label: 'Pending Requests', value: allRequests.filter(r => r.status === 'Pending').length, icon: Droplet, bgColor: 'bg-rose-50', textColor: 'text-rose-500' },
          { label: 'Active Hospitals', value: allUsers.filter(u => u.role === 'hospital').length, icon: Activity, bgColor: 'bg-indigo-50', textColor: 'text-indigo-500' },
          { label: 'Platform Load', value: 'Live', icon: Zap, bgColor: 'bg-emerald-50', textColor: 'text-emerald-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-6 ${stat.textColor} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-indigo-950 tracking-tighter">{stat.value}</div>
            <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Command Bento */}
      <div className="bg-white p-10 md:p-14 rounded-[56px] border border-slate-100 shadow-sm relative overflow-hidden">
        
        {/* Header with Tab Switching */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 relative z-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-indigo-950 tracking-tight">System <span className="text-blue-600">Commander</span></h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Master Operations Control</p>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-[24px] shadow-inner w-full lg:w-auto overflow-x-auto no-scrollbar">
             {['requests', 'users', 'analytics', 'health'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 lg:flex-none px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap
                    ${activeTab === tab ? 'bg-indigo-950 text-white shadow-xl shadow-indigo-950/20' : 'text-slate-400 hover:text-indigo-950'}`}
                >
                  {tab === 'health' ? 'Health Content' : tab}
                </button>
             ))}
          </div>
        </div>

        {/* Dynamic Table Content */}
        <div className="relative z-10">
          {activeTab === 'requests' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] border-b border-slate-50">
                      <th className="pb-6 px-4">Request Intel</th>
                      <th className="pb-6 px-4">Blood Group</th>
                      <th className="pb-6 px-4">Status</th>
                      <th className="pb-6 px-4 text-right">System Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allRequests.map((req) => (
                      <tr key={req.request_id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-8 px-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 
                              ${req.urgencyLevel === 'Urgent' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                              <Activity className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-indigo-950 tracking-tight leading-tight uppercase">{req.hospitalName}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.location}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-4">
                          <span className="text-xl font-black text-indigo-950 tracking-tighter">{req.bloodGroup}</span>
                        </td>
                        <td className="py-8 px-4">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-flex items-center gap-2
                            ${req.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                              req.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'Pending' ? 'bg-amber-400 animate-pulse' : 'bg-current'}`}></div>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-8 px-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {req.status === 'Pending' && (
                              <>
                                <button onClick={() => handleApprove(req.request_id)} className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all" title="Verify Request">
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleReject(req.request_id)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all" title="Terminate Request">
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button className="p-3 text-slate-300 hover:text-indigo-950 rounded-2xl transition-all">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
               {allUsers.map((user) => (
                 <div key={user.id} className="bg-slate-50 p-8 rounded-[40px] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl transition-all duration-700 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full 
                         ${user.role === 'donor' ? 'bg-blue-50 text-blue-500' : 'bg-indigo-50 text-indigo-500'}`}>
                         {user.role}
                       </span>
                    </div>
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-950 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                       <Users className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-indigo-950 tracking-tight uppercase leading-none">{user.name}</h4>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{user.phone}</p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Verified</span>
                       </div>
                       <button className="text-blue-600 hover:text-blue-700 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               ))}
             </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Add Video Form */}
              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                <h3 className="text-xl font-black text-indigo-950 mb-6 flex items-center gap-2 uppercase tracking-tight">
                  <Plus className="w-5 h-5 text-blue-600" /> Deploy New Media
                </h3>
                <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Video Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Headache Relief 101"
                      className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newVideo.title}
                      onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">YouTube ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. XWvWve7_IUI"
                      className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newVideo.youtube_id}
                      onChange={e => setNewVideo({...newVideo, youtube_id: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                      value={newVideo.category}
                      onChange={e => setNewVideo({...newVideo, category: e.target.value})}
                    >
                      <option value="headache">Headache</option>
                      <option value="fever">Fever</option>
                      <option value="back_pain">Back Pain</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <button type="submit" className="bg-indigo-950 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-indigo-950/10">
                    Add Video
                  </button>
                </form>
              </div>

              {/* Video List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(healthVideos || []).map((video) => (
                  <div key={video.id} className="bg-white rounded-[40px] overflow-hidden border border-slate-100 group hover:shadow-2xl transition-all duration-700">
                    <div className="relative aspect-video">
                      <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-indigo-950/20 group-hover:bg-transparent transition-colors"></div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button 
                          onClick={() => deleteHealthVideo(video.id)}
                          className="p-3 bg-white/90 backdrop-blur shadow-xl rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-8">
                       <div className="flex items-center gap-2 mb-4">
                          <Film className="w-3 h-3 text-blue-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{video.category}</span>
                       </div>
                       <h4 className="text-lg font-black text-indigo-950 tracking-tight leading-tight uppercase line-clamp-2">{video.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
