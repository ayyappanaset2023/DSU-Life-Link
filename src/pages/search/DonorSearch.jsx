import React, { useState, useEffect } from 'react';
import { Search, MapPin, HeartPulse, Navigation, PhoneCall, AlertCircle, Users } from 'lucide-react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getCurrentLocation } from '../../utils/geolocation';
import { useAuth } from '../../contexts/AuthContext';

export default function DonorSearch() {
  const { searchDonors } = useDatabase();
  const { currentUser } = useAuth();
  
  const [searchParams, setSearchParams] = useState({
    location: '',
    bloodGroup: 'All',
  });
  
  const [results, setResults] = useState([]);
  const [myLocation, setMyLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Optionally pre-fetch user real lat/lng for accurate distances if available
    getCurrentLocation()
      .then(coords => {
        setMyLocation(coords);
      })
      .catch(e => console.warn("GPS Location skipped for search mode.", e));
  }, []);

  // Real-time effect bindings
  useEffect(() => {
    setIsSearching(true);
    // Debounce simulating slight network delay for realism if desired
    const timeoutId = setTimeout(() => {
      // Prioritize GPS location if acquired, otherwise rely on the text search filter
      const fetched = searchDonors(
        searchParams.location, 
        searchParams.bloodGroup, 
        myLocation?.lat, 
        myLocation?.lng
      );
      setResults(fetched);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchParams, myLocation, searchDonors]);


  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  if (!currentUser) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Users className="w-16 h-16 text-gray-300"/>
          <h2 className="text-2xl font-bold text-gray-500">Global Donor Directory</h2>
          <p className="text-gray-400">Please log in to access the community registry.</p>
       </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Top Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
           <Search className="w-8 h-8 text-red-500"/> Find Nearby Donors
        </h1>
        <p className="text-gray-500 font-medium tracking-wide mt-2">
           Manually search your city or area to find matching Blood Heroes ready to help.
        </p>
      </div>

      {/* Search Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 w-full flex flex-col md:flex-row gap-4 items-center">
        
        <div className="w-full md:flex-1 relative">
           <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
           <input 
             type="text" 
             name="location" 
             value={searchParams.location} 
             onChange={handleChange}
             placeholder="Search by area or city (e.g. 'Chennai', 'Anna Nagar')" 
             className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none font-medium text-lg shadow-inner bg-gray-50"
           />
        </div>

        <div className="w-full md:w-64 relative shrink-0">
           <HeartPulse className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5"/>
           <select 
             name="bloodGroup" 
             value={searchParams.bloodGroup} 
             onChange={handleChange}
             className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none font-bold text-lg cursor-pointer bg-white appearance-none"
           >
             <option value="All">All Blood Types</option>
             <option value="A+">A+</option>
             <option value="A-">A-</option>
             <option value="B+">B+</option>
             <option value="B-">B-</option>
             <option value="AB+">AB+</option>
             <option value="AB-">AB-</option>
             <option value="O+">O+</option>
             <option value="O-">O-</option>
           </select>
        </div>

      </div>

      {/* GPS Context Warning */}
      {!myLocation && (
         <div className="bg-yellow-50 text-yellow-800 p-4 flex items-start gap-4 rounded-xl mb-6 border border-yellow-200">
            <Navigation className="w-5 h-5 shrink-0 mt-0.5 text-yellow-600"/>
            <div className="text-sm font-medium">GPS location is disabled or still fetching. Precise distances are hidden and donors are sorted alphabetically. Enable location services for accurate proximity ranking.</div>
         </div>
      )}

      {/* Grid Results */}
      {isSearching ? (
         <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-500"></div>
             <p className="font-bold text-gray-500 tracking-widest uppercase">Scanning Directory...</p>
         </div>
      ) : results.length === 0 ? (
         <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
             <AlertCircle className="w-16 h-16 text-gray-300 mb-4"/>
             <h3 className="text-xl font-bold text-gray-700">No Matching Donors Found</h3>
             <p className="text-gray-500 mt-2 max-w-sm">
                Try adjusting your location text, expanding your search area, or selecting 'All Blood Types'.
             </p>
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {results.map((donor) => (
               <div key={donor.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-red-lifelink transition-all overflow-hidden flex flex-col group relative">
                  
                  {/* Active Indicator Top Tag */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 group-hover:bg-green-400 transition-colors"></div>

                  <div className="p-6 pb-4 flex-1">
                     <div className="flex justify-between items-start mb-4">
                        <div className="text-2xl font-black text-red-lifelink bg-red-50 w-12 h-12 flex items-center justify-center rounded-xl border border-red-100 shadow-sm">
                           {donor.bloodGroup}
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs font-black uppercase tracking-wider px-2 py-1 rounded-full border border-green-200">
                           Active Hero
                        </span>
                     </div>
                     
                     <h3 className="text-xl font-bold text-gray-900 mb-1 truncate" title={donor.name}>
                        {donor.name}
                     </h3>
                     
                     <div className="text-gray-500 text-sm font-medium flex items-center gap-1 mt-3">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0"/> 
                        <span className="truncate" title={donor.location || donor.locName}>{donor.location || donor.locName || 'No Specific Location'}</span>
                     </div>
                     
                     {myLocation && donor.distanceFormatted && (
                        <div className="text-blue-600 text-sm font-bold flex items-center gap-1 mt-1 bg-blue-50 px-2 py-1 rounded w-max border border-blue-100">
                           <Navigation className="w-3 h-3"/> {donor.distanceFormatted}
                        </div>
                     )}
                  </div>
                  
                  <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                     <a 
                        href={`tel:${donor.phone}`} 
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                     >
                        <PhoneCall className="w-5 h-5"/> Call Donor
                     </a>
                  </div>
               </div>
            ))}
            
         </div>
      )}

    </div>
  );
}
