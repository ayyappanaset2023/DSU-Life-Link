import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, Phone, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (phone.length < 10) throw new Error('Enter a valid 10-digit phone number');
      await sendOTP(phone);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!otp) throw new Error('Enter the OTP');
      await verifyOTP(phone, otp);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Activity className="h-12 w-12 text-rose-lifelink mb-2" />
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-500 mt-2">Use your phone number to access your account</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-lifelink" placeholder="e.g. 9876543210" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-rose-lifelink hover:bg-rose-lifelink-hover text-white p-3 rounded-lg font-bold transition-colors disabled:opacity-50">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-5 h-5"/> OTP sent to {phone} (Use: 123456)
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-lifelink text-center tracking-widest text-lg font-bold" placeholder="• • • • • •" maxLength={6} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-rose-lifelink hover:bg-rose-lifelink-hover text-white p-3 rounded-lg font-bold transition-colors disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-gray-500 font-semibold p-2">
              Change Phone Number
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account? <Link to="/register" className="text-rose-lifelink hover:underline font-semibold">Register here</Link>
        </div>
      </div>
    </div>
  );
}
