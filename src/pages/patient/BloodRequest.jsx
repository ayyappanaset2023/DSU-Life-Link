import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Droplet, Hospital, AlertCircle, Users, Activity, PhoneCall } from 'lucide-react';
import { getCurrentLocation } from '../../utils/geolocation';
import EmergencyAlert from '../../components/emergency/EmergencyAlert';
import { useDatabase } from '../../contexts/DatabaseContext';
import { useAuth } from '../../contexts/AuthContext';

export default function BloodRequest() {
  const navigate = useNavigate();
  const { createBloodRequest, getMatchingDonors } = useDatabase();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    bloodGroup: 'A+',
    hospitalName: '',
    urgencyLevel: 'medium',
    contactNumber: '',
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync nearby donors dynamically based on selected group & location
  const [nearbyDonors, setNearbyDonors] = useState([]);

  useEffect(() => {
    getCurrentLocation().then(coords => setLocation(coords)).catch(console.error);
  }, []);

  useEffect(() => {
    // Only query if we have a location
    if (location) {
      const donors = getMatchingDonors(formData.bloodGroup, location.lat, location.lng, 10); // 10km radius
      setNearbyDonors(donors);
    }
  }, [formData.bloodGroup, location, getMatchingDonors]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Create actual request in global state
    createBloodRequest({
      ...formData,
      patient_id: currentUser?.id || 'guest',
      requester_role: currentUser?.role || 'patient',
      location: location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Unknown Location',
      lat: location?.lat,
      lng: location?.lng,
    });

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000); 
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-green-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Request Broadcasted!</h2>
          <p className="text-gray-600 mb-6">
            We have instantly notified {nearbyDonors.length} matching donors within a 10km radius of your location.
          </p>
          <p className="text-sm border-t pt-4 text-gray-500">Redirecting to Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Main Request Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-red-lifelink p-6 text-white text-center">
             <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
               <Droplet className="fill-white w-6 h-6" /> Need Blood Now?
             </h2>
             <p className="opacity-90 mt-1">Fill out the details below to notify matching donors instantly.</p>
          </div>
          
          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group Required</label>
                <div className="relative">
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-red-lifelink font-bold">
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                  <Droplet className="absolute right-3 top-3 h-5 w-5 text-red-lifelink pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Urgency Level</label>
                <select name="urgencyLevel" value={formData.urgencyLevel} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-lifelink font-bold">
                  <option value="low">Low (Next 48 hrs)</option>
                  <option value="medium">Medium (Next 24 hrs)</option>
                  <option value="critical">Critical (Immediate!)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Name & City</label>
              <div className="relative">
                <Hospital className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input required type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-lifelink font-medium" placeholder="e.g. Apollo Hospital, New Delhi" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                <input required type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-lifelink font-medium" placeholder="+91 9876543210" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Location</label>
                <div className="flex bg-gray-50 border border-gray-300 rounded-lg p-3 items-center text-sm font-medium text-gray-700">
                  <Navigation className="h-4 w-4 mr-2 text-blue-500" /> 
                  {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Fetching location...'}
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-lifelink hover:bg-red-lifelink-hover text-white text-lg p-4 rounded-xl font-bold transition-transform active:scale-95 disabled:opacity-70 mt-4 flex justify-center items-center gap-2 shadow-xl shadow-red-500/20">
              {loading ? (
                <>Broadcasting Signal... <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span></>
              ) : (
                <>Broadcast Request to {nearbyDonors.length} Donors</>
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2 font-medium">By submitting this, an alert will instantly appear on the dashboards of compatible nearby donors.</p>
          </form>
        </div>
      </div>

      {/* Sidebar - Quick SOS & Matching Engine Results */}
      <div className="space-y-6">
        <EmergencyAlert />
        
        {/* Real-Time Database Display View */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <Activity className="w-5 h-5 text-red-500" /> Live Match Radar
              </h3>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200 animate-pulse">
                 SYNCING
              </span>
           </div>
           
           <div className="p-4">
              <p className="text-sm font-medium text-gray-600 mb-4 flex gap-1">
                 Searching 10km radius for <span className="font-black text-red-lifelink mx-1">{formData.bloodGroup}</span>
              </p>
              
              {nearbyDonors.length === 0 ? (
                 <div className="text-center py-6 border border-dashed rounded-xl">
                    <Users className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-semibold text-gray-500">No compatible donors available nearby.</p>
                 </div>
              ) : (
                <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[300px] pr-2">
                   {nearbyDonors.map((donor, idx) => (
                      <div key={idx} className="flex flex-col p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-red-50 transition-colors">
                         <div className="flex justify-between items-start mb-2">
                             <div>
                                <div className="font-bold text-gray-800 text-sm">{donor.name}</div>
                                <div className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-red-400"/> {donor.distanceFormatted} away
                                </div>
                             </div>
                             <div className="text-right">
                               <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border inline-block mb-1 ${donor.isAvailable ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                 {donor.isAvailable ? 'Active' : 'Not Available'}
                               </span>
                             </div>
                         </div>
                         
                         {donor.isAvailable ? (
                           <div className="flex gap-2 w-full mt-1">
                             <a href={`tel:${donor.phone}`} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded border border-green-600 flex items-center justify-center gap-2 text-xs transition-colors shadow-sm">
                               <PhoneCall className="w-3 h-3"/> {donor.phone}
                             </a>
                           </div>
                         ) : (
                           <div className="text-[11px] text-gray-400 font-medium italic mt-1 bg-gray-100 p-1.5 rounded text-center border border-gray-200">
                             Contact hidden &mdash; user has recently donated.
                           </div>
                         )}
                      </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
