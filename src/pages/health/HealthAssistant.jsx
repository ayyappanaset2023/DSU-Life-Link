import React, { useState } from 'react';
import { Search, Play, Heart, AlertCircle, Info, ArrowRight, User, Activity, Award, CheckCircle, Bot } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDatabase } from '../../contexts/DatabaseContext';
import { mapSymptomToCategory, getCategoryLabel } from '../../utils/symptomMapper';
import HealthAnalyzer from './HealthAnalyzer';
import HealthBotTab from './HealthBotTab';

export default function HealthAssistant() {
  const { currentUser } = useAuth();
  const { getVideosByCategory, healthVideos, issueFirstAidCertificate } = useDatabase();
  const [activeTab, setActiveTab] = useState('bot'); // 'education' | 'analyzer' | 'bot'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    const category = mapSymptomToCategory(query);
    const vids = getVideosByCategory(category);
    setResults(vids);
    setHasSearched(true);
  };

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleClaimCertificate = async () => {
    if (!currentUser) {
      alert("Please login to claim your certificate.");
      return;
    }
    setIsClaiming(true);
    try {
      await issueFirstAidCertificate(currentUser.id, currentUser.name);
      setClaimed(true);
      setTimeout(() => setClaimed(false), 5000); // Reset UI after 5s
    } catch (error) {
      console.error("Failed to claim certificate:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-indigo-900 pt-32 pb-20 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 text-sm font-medium mb-6 animate-slide-up">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Reliable Medical Guidance</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            How are you feeling <span className="text-blue-300">today?</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Enter your symptoms to find curated health advice and exercises from trusted medical experts.
          </p>

          {/* Tab Specific Active UI */}
          {activeTab === 'education' ? (
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
              <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-3xl border border-white/20 shadow-2xl flex items-center transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-500/30">
                <div className="pl-6 pr-4">
                  <Search className="w-6 h-6 text-blue-200" />
                </div>
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type symptoms (e.g., 'head pain', 'fever')..."
                  className="flex-1 bg-transparent border-none py-4 text-lg text-white placeholder:text-blue-100/50 outline-none focus:ring-0"
                />
                <button 
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/40 active:scale-95 flex items-center gap-2"
                >
                  Find Advice
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {['Headache', 'Fever', 'Back Pain', 'Stress'].map(s => (
                  <button 
                    key={s}
                    type="button"
                    onClick={() => { setQuery(s); handleSearch({ preventDefault: () => {} }); }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-blue-100 hover:bg-white/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </form>
          ) : activeTab === 'analyzer' ? (
            <div className="max-w-2xl mx-auto">
               <div className="bg-emerald-500/10 border border-emerald-400/20 p-4 rounded-3xl backdrop-blur inline-flex items-center gap-3 animate-in zoom-in duration-500">
                  <Activity className="w-6 h-6 text-emerald-400" />
                  <span className="text-emerald-50 text-sm font-medium italic underline underline-offset-4 decoration-emerald-500/50">
                    Smart AI Analysis Engine Engaged
                  </span>
               </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
               <div className="bg-blue-500/10 border border-blue-400/20 p-4 rounded-3xl backdrop-blur inline-flex items-center gap-3 animate-in zoom-in duration-500">
                  <Bot className="w-6 h-6 text-blue-400" />
                  <span className="text-blue-50 text-sm font-medium italic underline underline-offset-4 decoration-blue-500/50">
                    LifeLink Intelligent Assistant Ready
                  </span>
               </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="max-w-xl mx-auto -mt-8 relative z-20">
           <div className="bg-white p-2 rounded-[32px] shadow-2xl border border-slate-100 flex gap-2">
              <button 
                onClick={() => setActiveTab('bot')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all duration-500
                ${activeTab === 'bot' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:text-blue-600'}`}
              >
                <Bot className="w-4 h-4" /> Ask AI
              </button>
              <button 
                onClick={() => setActiveTab('education')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all duration-500
                ${activeTab === 'education' ? 'bg-indigo-950 text-white shadow-xl shadow-indigo-950/20' : 'text-slate-400 hover:text-indigo-950'}`}
              >
                <Play className="w-4 h-4" /> Education
              </button>
              <button 
                onClick={() => setActiveTab('analyzer')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all duration-500
                ${activeTab === 'analyzer' ? 'bg-indigo-950 text-white shadow-xl shadow-indigo-950/20' : 'text-slate-400 hover:text-indigo-950'}`}
              >
                <Activity className="w-4 h-4" /> Smart Analyzer
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {activeTab === 'education' ? (
          <>
            {!hasSearched ? (
              <div className="text-center space-y-12 animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-slate-800">Popular Health Topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {['headache', 'fever', 'back_pain'].map((cat) => (
                    <div key={cat} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                        {cat === 'headache' ? <Info className="w-8 h-8" /> : cat === 'fever' ? <Activity className="w-8 h-8" /> : <User className="w-8 h-8" />}
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-3">{getCategoryLabel(cat)}</h3>
                      <p className="text-slate-500 mb-6 leading-relaxed">
                        Explore curated medical tips and physical exercises to manage {cat.replace('_', ' ')} naturally.
                      </p>
                      <button 
                        onClick={() => { const vids = getVideosByCategory(cat); setResults(vids); setHasSearched(true); }}
                        className="text-blue-600 font-bold flex items-center gap-1 group-hover:gap-3 transition-all"
                      >
                        View Videos <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-500">
                <div className="flex justify-between items-end mb-12">
                  <div className="space-y-4">
                    <button onClick={() => setHasSearched(false)} className="text-blue-600 font-bold flex items-center gap-2 hover:underline tracking-tight">
                       <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
                    </button>
                    <h2 className="text-3xl font-black text-slate-800">Recommended <span className="text-blue-600">Health Videos</span></h2>
                  </div>
                  <span className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-full text-sm">{results.length} Resources Found</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((video) => (
                    <div key={video.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => openVideo(video)} className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xl scale-75 group-hover:scale-100 transition-all">
                              <Play className="w-6 h-6 fill-blue-600" />
                           </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <span className="text-[10px] font-black bg-slate-50 px-3 py-1 rounded-full text-slate-500 mb-3 block w-fit">{getCategoryLabel(video.category)}</span>
                        <h3 className="font-bold text-slate-800 line-clamp-2 mb-6">{video.title}</h3>
                        <button onClick={() => openVideo(video)} className="w-full py-3 bg-slate-50 hover:bg-blue-950 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                           <Play className="w-4 h-4" /> Watch Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'analyzer' ? (
          <HealthAnalyzer />
        ) : (
          <HealthBotTab />
        )}

        <div className="mt-32 p-12 bg-amber-50 rounded-[50px] border border-amber-100 flex flex-col md:flex-row items-center gap-8 shadow-inner">
           <div className="bg-amber-100 p-6 rounded-full text-amber-600 shadow-xl shadow-amber-900/5">
              <AlertCircle className="w-10 h-10" />
           </div>
           <div>
              <h4 className="font-black text-amber-900 text-2xl mb-2 tracking-tight">Legal Medical Disclaimer</h4>
              <p className="text-amber-800/70 leading-relaxed text-sm max-w-3xl">
                 The information provided through this portal is for educational and emergency support coordination purposes ONLY. It is not a substitute for professional clinical advice, diagnosis, or treatments. DSU LifeLink encourages users to verify all medical guidance with a certified physician or in emergency situations, contact local hospital services immediately.
              </p>
           </div>
        </div>

        <div className="mt-24 relative overflow-hidden bg-indigo-950 rounded-[50px] p-12 lg:p-20 text-white shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Award className="w-64 h-64 -rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-6 py-2 rounded-full text-blue-300 text-sm font-bold uppercase tracking-widest">
                <CheckCircle className="w-4 h-4" /> <span>LifeLink Academic Verified</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">Mastered the <span className="text-blue-400">Survival Basics?</span></h2>
              <p className="text-indigo-100/60 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 font-medium">
                Complete your knowledge track and download the **Official First Aid Course Completion Certificate**. Demonstrate your commitment to community safety.
              </p>
            </div>
            
            <div className="shrink-0 flex flex-col items-center gap-6">
              <button 
                onClick={handleClaimCertificate}
                disabled={isClaiming || claimed}
                className={`group min-w-[280px] flex items-center justify-center gap-3 px-12 py-8 rounded-[36px] font-black text-xl transition-all duration-500 
                  ${claimed ? 'bg-emerald-500 scale-95 cursor-default' : 
                    isClaiming ? 'bg-indigo-700 cursor-wait' : 
                    'bg-white text-indigo-950 hover:bg-blue-400 hover:text-white hover:scale-105 active:scale-95 shadow-2xl shadow-white/10'}`}
              >
                {claimed ? (
                  <><CheckCircle className="w-6 h-6" /> Issued to Profile</>
                ) : isClaiming ? (
                  <div className="w-6 h-6 border-4 border-indigo-300 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><Award className="w-7 h-7 group-hover:rotate-12 transition-transform" /> Claim Certificate</>
                )}
              </button>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100/40">Secured with Blockchain ID</p>
            </div>
          </div>
        </div>
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="bg-black w-full max-w-6xl aspect-video rounded-[40px] shadow-3xl overflow-hidden relative border border-white/10 group">
              <button onClick={() => setSelectedVideo(null)} className="absolute top-6 right-6 z-50 p-5 bg-white/10 hover:bg-rose-600 rounded-full text-white transition-all">
                 <ArrowRight className="w-6 h-6 rotate-180" />
              </button>
              <iframe 
                src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1`} 
                className="w-full h-full" 
                frameBorder="0" 
                allow="autoplay; encrypted-media" 
                allowFullScreen
              ></iframe>
           </div>
        </div>
      )}
    </div>
  );
}
