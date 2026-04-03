import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Users, ShieldCheck, ArrowRight, Heart, Activity, MapPin, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="w-full relative overflow-hidden bg-slate-50 min-h-screen">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] animate-blob -mr-40 -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-[140px] animate-blob delay-5000 -ml-40 -mb-40"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-32 px-4 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="text-center lg:text-left space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-950 text-white shadow-2xl shadow-indigo-950/20 text-xs font-black uppercase tracking-[0.2em] transform transition-transform hover:scale-105 cursor-default">
                <Zap className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                Real-Time Rescue Platform
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-indigo-950 leading-[1.05] tracking-tight">
                Save a Life Today. <br className="hidden lg:block"/> 
                <span className="text-rose-500 relative">
                  Donate Blood
                  <div className="absolute -bottom-2 left-0 w-full h-2 bg-rose-500/10 rounded-full blur-sm"></div>
                </span>
                <span className="text-rose-500 text-6xl">.</span>
              </h1>

              <p className="text-lg lg:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                DSU LifeLink is the world's first <span className="text-indigo-900 font-bold">Intelligent Emergency Engine</span> connecting donors directly to hospitals when every second matters most.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
                <Link to="/patient/request" className="group relative bg-rose-500 hover:bg-rose-600 text-white px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-rose-500/40 transition-all active:scale-95 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  Emergency Request
                </Link>
                <Link to="/register" className="flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-950 px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200/40 transition-all active:scale-95 group">
                  Become a Donor
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </div>

            {/* Hero Graphic - Interactive Widget Style */}
            <div className="hidden lg:block relative group animate-in fade-in zoom-in duration-1000 delay-500">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-[60px] blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
              
              <div className="relative bg-white/70 backdrop-blur-3xl p-12 rounded-[56px] border border-white shadow-[0_50px_100px_-20px_rgba(30,27,75,0.2)] flex flex-col items-center gap-10">
                <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center shadow-lg animate-float">
                  <Droplet className="w-12 h-12 text-rose-500 fill-rose-500 shadow-rose-500/20" />
                </div>

                <div className="text-center">
                  <h3 className="text-3xl font-black text-indigo-950 tracking-tighter">Live Support Engine</h3>
                  <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">Active Monitoring Active</p>
                </div>

                <div className="w-full space-y-4">
                  {[
                    { group: 'O- Negative', urgency: 'Critical', color: 'rose' },
                    { group: 'A+ Positive', urgency: 'Healthy', color: 'emerald' },
                    { group: 'B- Negative', urgency: 'Moderate', color: 'amber' }
                  ].map((inv) => (
                    <div key={inv.group} className="w-full bg-white/50 border border-slate-100 p-5 rounded-3xl flex justify-between items-center transition-all hover:scale-[1.02] hover:bg-white hover:shadow-xl group/inv">
                       <span className="font-black text-indigo-950 tracking-tight">{inv.group}</span>
                       <span className={`text-[10px] font-black uppercase tracking-widest bg-${inv.color}-100 text-${inv.color}-700 px-4 py-1.5 rounded-full`}>
                         {inv.urgency}
                       </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Grid */}
      <section className="py-20 bg-white/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { label: 'Lives Saved', value: '450+', icon: Heart },
                { label: 'Verified Donors', value: '1.2k', icon: Users },
                { label: 'Partner Hospitals', value: '30+', icon: Activity },
                { label: 'Response Time', value: '98%', icon: Zap }
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500 group text-center">
                   <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
                     <stat.icon className="w-6 h-6" />
                   </div>
                   <div className="text-3xl font-black text-indigo-950 mb-1 tracking-tighter">{stat.value}</div>
                   <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Modern Workflow Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-indigo-950 tracking-tight">How It Works</h2>
            <p className="text-slate-500 font-medium text-lg">Our decentralized engine connects you to help in 3 simple phases.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {[
              { 
                step: 'Phase 01', 
                title: 'Broadcast Need', 
                desc: 'Hospitals post emergency blood requests with precise GPS coordinates.',
                icon: MapPin,
                color: 'rose'
              },
              { 
                step: 'Phase 02', 
                title: 'Intelligent Match', 
                desc: 'Our AI instantly notifies verified donors within a 15km radius of the hospital.',
                icon: Zap,
                color: 'blue'
              },
              { 
                step: 'Phase 03', 
                title: 'Verified Support', 
                desc: 'Donor proceeds to safe clinical centers, earning certificates and reward points.',
                icon: ShieldCheck,
                color: 'emerald'
              }
            ].map((item) => (
              <div key={item.step} className="group relative flex flex-col items-center text-center space-y-6 animate-in slide-in-from-bottom-5 duration-700">
                <div className={`w-28 h-28 bg-${item.color}-50 rounded-[40px] flex items-center justify-center shadow-lg transition-all group-hover:scale-110 duration-500 group-hover:bg-${item.color}-100`}>
                  <item.icon className={`w-10 h-10 text-${item.color}-500`} />
                </div>
                <div className="space-y-3">
                  <span className={`text-${item.color}-500 font-black text-[10px] uppercase tracking-[0.3em]`}>{item.step}</span>
                  <h3 className="text-2xl font-black text-indigo-950 tracking-tight">{item.title}</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
