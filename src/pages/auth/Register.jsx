import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Activity, User, Phone, MapPin, 
  Truck, ShieldCheck, HeartPulse, 
  ChevronRight, ArrowLeft, Heart, 
  Hospital, Calendar, Zap
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('donor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '', phone: '', location: '', age: '', bloodGroup: 'A+', lastDonated: '',
    vehicleNumber: '', license: '', contactPerson: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.name || !formData.phone || !formData.location) throw new Error('Please fill all mandatory fields.');
      if (formData.phone.length < 10) throw new Error('Valid 10-digit phone number is required.');
      
      const userPayload = {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        role: role
      };

      if (role === 'donor') {
        userPayload.age = formData.age;
        userPayload.bloodGroup = formData.bloodGroup;
      } else if (role === 'driver') {
        userPayload.vehicleNumber = formData.vehicleNumber;
      }
      
      await register(userPayload);
      alert('Registration successful! You are now logged in.');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { id: 'donor', label: 'Blood Donor', icon: HeartPulse, color: 'rose' },
    { id: 'patient', label: 'Patient / Need Aid', icon: User, color: 'blue' },
    { id: 'hospital', label: 'LifeLink Hospital', icon: Hospital, color: 'indigo' },
    { id: 'driver', label: 'Emergency Pilot', icon: Truck, color: 'emerald' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-12 bg-slate-50 relative overflow-hidden animate-in fade-in duration-1000">
      
      {/* Background Hero blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-200/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-200/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
        
        {/* Top Header Card */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex p-4 bg-indigo-950 rounded-[28px] shadow-2xl shadow-indigo-900/40 rotate-12 scale-110 mb-4">
             <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-5xl font-black text-indigo-950 tracking-tighter leading-none">Become a <span className="text-blue-600">Hero</span></h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em]">Join the Global LifeLink Network</p>
        </div>

        {/* Global Register Card */}
        <div className="bg-white/80 backdrop-blur-3xl p-10 md:p-14 rounded-[56px] border border-white shadow-2xl shadow-indigo-950/5 w-full transition-all duration-700 hover:shadow-indigo-950/10">
          
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in shake duration-500">
               <ShieldCheck className="w-5 h-5 flex-shrink-0" />
               {error}
            </div>
          )}

          {/* Role Grid Redesign */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {roleOptions.map((opt) => (
              <button 
                key={opt.id} 
                onClick={() => setRole(opt.id)}
                className={`flex flex-col items-center text-center p-6 rounded-[32px] border-2 transition-all duration-500 group relative
                  ${role === opt.id 
                    ? 'bg-indigo-950 border-indigo-900 text-white shadow-2xl shadow-indigo-900/30' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
              >
                <div className={`p-3 rounded-2xl mb-3 transition-transform duration-500 group-hover:scale-110 
                  ${role === opt.id ? 'bg-white/10 text-rose-400' : 'bg-slate-50 text-slate-300 group-hover:text-blue-500'}`}>
                   <opt.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest leading-tight">{opt.label}</div>
                {role === opt.id && (
                   <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 rounded-full border-4 border-white shadow-lg animate-in zoom-in duration-300"></span>
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Bento Section: Vital Info */}
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4 px-4">Identification Hub</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name Block */}
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest px-1">Identity Display</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      required type="text" name="name" value={formData.name} onChange={handleChange} 
                      className="w-full h-16 pl-14 pr-6 bg-white border-2 border-slate-200 shadow-sm rounded-[24px] text-sm font-black text-indigo-950 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all outline-none" 
                      placeholder={role === 'hospital' ? 'Official Hospital Name' : 'Full Name'} 
                    />
                  </div>
                </div>

                {/* Phone Block */}
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest px-1">Mobile Access</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      required type="tel" name="phone" value={formData.phone} onChange={handleChange} 
                      className="w-full h-16 pl-14 pr-6 bg-white border-2 border-slate-200 shadow-sm rounded-[24px] text-sm font-black text-indigo-950 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all outline-none font-mono" 
                      placeholder="10-digit number" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest px-1">Rescue Zone (Location)</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  required type="text" name="location" value={formData.location} onChange={handleChange} 
                  className="w-full h-16 pl-14 pr-6 bg-white border-2 border-slate-200 shadow-sm rounded-[24px] text-sm font-black text-indigo-950 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all outline-none" 
                  placeholder="Street Address, City Name" 
                />
              </div>
            </div>

            {/* Role Specific Dynamic Section */}
            {role === 'donor' && (
              <div className="grid grid-cols-2 md:grid-cols-12 gap-6 animate-in slide-in-from-top-4 duration-500">
                <div className="col-span-1 md:col-span-3 space-y-2 group">
                  <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest px-1">Age</label>
                  <input required type="number" name="age" min="18" max="65" value={formData.age} onChange={handleChange} className="w-full h-16 px-6 bg-white border-2 border-slate-200 shadow-sm rounded-[24px] text-sm font-black text-indigo-950 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                </div>
                <div className="col-span-1 md:col-span-4 space-y-2 group">
                  <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest px-1">Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full h-16 px-6 bg-white border-2 border-slate-200 shadow-sm rounded-[24px] text-sm font-black text-indigo-950 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer">
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-5 space-y-2 group">
                  <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest px-1">Last Donated</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input type="date" name="lastDonated" value={formData.lastDonated} onChange={handleChange} className="w-full h-16 pl-14 pr-6 bg-white border-2 border-slate-200 shadow-sm rounded-[24px] text-sm font-black text-indigo-950 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" />
                  </div>
                </div>
              </div>
            )}

            {role === 'hospital' && (
              <div className="animate-in slide-in-from-top-4 duration-500 group">
                <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest px-1 mb-2 block">License Verification</label>
                <div className="h-32 border-2 border-dashed border-slate-300 p-8 rounded-[32px] bg-white text-center flex flex-col items-center justify-center gap-2 text-slate-500 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all cursor-pointer">
                  <ShieldCheck className="w-8 h-8 text-indigo-400"/> 
                  <span className="text-[10px] font-black uppercase tracking-widest">Click to Upload Medical License</span>
                </div>
              </div>
            )}

            {role === 'driver' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest px-1">Vehicle Registration</label>
                  <input required type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full h-16 px-6 bg-white border-2 border-slate-200 shadow-sm rounded-[24px] text-sm font-black text-indigo-950 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="MH 01 AB 1234" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-indigo-950 uppercase tracking-widest px-1">License Proof</label>
                  <div className="h-16 border-2 border-dashed border-slate-300 rounded-[24px] bg-white flex items-center justify-center text-slate-400 font-black text-[10px] uppercase tracking-widest group-hover:bg-indigo-50 transition-all cursor-pointer">
                    Upload Driver License
                  </div>
                </div>
              </div>
            )}

            {/* Submit Block */}
            <div className="pt-6">
              <button 
                type="submit" disabled={loading} 
                className="w-full h-20 bg-indigo-950 hover:bg-indigo-900 text-white rounded-[32px] font-black text-[10px] uppercase tracking-[0.4em] transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-indigo-950/20 relative group/btn overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/10 to-blue-600/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? 'Processing Mission...' : 'Register as Hero Profile'}
                  <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                </span>
              </button>
            </div>
          </form>

          {/* Bottom Nav */}
          <div className="mt-12 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-950 font-black text-[10px] uppercase tracking-widest transition-all">
              Already have high-level access? <span className="text-blue-600 ml-1">Portal Login</span>
            </Link>
          </div>
        </div>

        {/* Footer brand help */}
        <div className="mt-10 flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           <Zap className="w-5 h-5 text-amber-500" />
           <p className="text-[9px] font-black uppercase tracking-widest text-indigo-950 cursor-help">Secure HIPAA Compliant Processing</p>
        </div>
      </div>
    </div>
  );
}
