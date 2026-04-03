import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateDistance } from '../utils/geolocation';

const DatabaseContext = createContext();

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }) {
  // Mock Base Users (with lat/lng for mapping)
  const initialUsers = [
    { id: 'admin-1', name: 'Super Admin', role: 'admin', phone: '0000000000', verification_status: 'verified' },
    { id: 'donor-1', name: 'Rahul S.', role: 'donor', bloodGroup: 'O-', phone: '9876543210', locName: 'New Delhi Center', lat: 28.6139, lng: 77.2090, isAvailable: true, lastDonated: null },
    { id: 'donor-2', name: 'Priya K.', role: 'donor', bloodGroup: 'A+', phone: '9876543211', locName: 'South Ex, Delhi', lat: 28.5678, lng: 77.2205, isAvailable: true, lastDonated: null },
    { id: 'donor-3', name: 'Inactive Hero', role: 'donor', bloodGroup: 'O-', phone: '9876543212', locName: 'Faridabad', lat: 28.4089, lng: 77.3178, isAvailable: false, lastDonated: '2026-03-01' },
    { id: 'hosp-1', name: 'Apollo Hospital', role: 'hospital', phone: '1111111111', locName: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  ];

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('lifelink_db_users');
      return saved ? JSON.parse(saved) : initialUsers;
    } catch (e) {
      console.error("Error loading users:", e);
      return initialUsers;
    }
  });

  const [bloodRequests, setBloodRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('lifelink_db_requests');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading requests:", e);
      return [];
    }
  });

  const [ambulanceBookings, setAmbulanceBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('lifelink_db_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading bookings:", e);
      return [];
    }
  });

  const [certificates, setCertificates] = useState(() => {
    try {
      const saved = localStorage.getItem('lifelink_db_certificates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading certificates:", e);
      return [];
    }
  });

  const [healthVideos, setHealthVideos] = useState(() => {
    const initialVideos = [
      { id: 'vid1', title: 'Relieving Headaches Naturally', category: 'headache', youtube_id: '5v1t942v_X8', thumbnail: 'https://img.youtube.com/vi/5v1t942v_X8/mqdefault.jpg' },
      { id: 'vid2', title: 'Understanding Fever & Home Care', category: 'fever', youtube_id: '2m6i7f0U9Fk', thumbnail: 'https://img.youtube.com/vi/2m6i7f0U9Fk/mqdefault.jpg' },
      { id: 'vid3', title: 'Daily Stretches for Back Pain', category: 'back_pain', youtube_id: 'Xe_tJdfqX5Y', thumbnail: 'https://img.youtube.com/vi/Xe_tJdfqX5Y/mqdefault.jpg' },
      { id: 'vid4', title: 'Emergency First Aid Guide', category: 'emergency', youtube_id: '0oE9U7oU5_Q', thumbnail: 'https://img.youtube.com/vi/0oE9U7oU5_Q/mqdefault.jpg' }
    ];
    try {
      const saved = localStorage.getItem('lifelink_db_videos');
      return saved ? JSON.parse(saved) : initialVideos;
    } catch (e) {
      console.error("Error loading videos:", e);
      return initialVideos;
    }
  });

  const [bmiRecords, setBmiRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('lifelink_db_bmi');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading BMI records:", e);
      return [];
    }
  });

  const [userGoals, setUserGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('lifelink_db_goals');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Error loading goals:", e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('lifelink_db_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('lifelink_db_requests', JSON.stringify(bloodRequests));
  }, [bloodRequests]);

  useEffect(() => {
    localStorage.setItem('lifelink_db_bookings', JSON.stringify(ambulanceBookings));
  }, [ambulanceBookings]);

  useEffect(() => {
    localStorage.setItem('lifelink_db_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('lifelink_db_videos', JSON.stringify(healthVideos));
  }, [healthVideos]);

  useEffect(() => {
    localStorage.setItem('lifelink_db_bmi', JSON.stringify(bmiRecords));
  }, [bmiRecords]);

  useEffect(() => {
    localStorage.setItem('lifelink_db_goals', JSON.stringify(userGoals));
  }, [userGoals]);

  // --- Users API ---
  const getUser = (phone) => users.find(u => u.phone === phone);
  
  const createUser = (userData) => {
    if (getUser(userData.phone)) throw new Error("Phone number already registered.");
    // Simulate assigning precise coordinates if none provided (for the sake of the mock)
    const newUser = { 
      ...userData, 
      id: 'user_' + Date.now(), 
      verification_status: 'pending',
      lat: userData.lat || 28.6139 + (Math.random() * 0.1 - 0.05), // random jitter near Delhi
      lng: userData.lng || 77.2090 + (Math.random() * 0.1 - 0.05),
      isAvailable: userData.role === 'donor' ? true : undefined
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const getDrivers = () => users.filter(u => u.role === 'driver');
  const getDonors = () => users.filter(u => u.role === 'donor');
  
  // Real-Time Matching Engine for Patients
  // Finds donors with exact blood group, within 10km radius.
  const getMatchingDonors = (bloodGroup, patientLat, patientLng, maxDistanceKm = 10) => {
    const allDonors = getDonors();
    const matches = [];

    for (let d of allDonors) {
      if (d.bloodGroup !== bloodGroup) continue;
      
      const distance = calculateDistance(patientLat, patientLng, d.lat, d.lng);
      if (distance <= maxDistanceKm) {
        matches.push({
          ...d,
          distanceKm: distance,
          distanceFormatted: distance < 1 ? '< 1 km' : distance.toFixed(1) + ' km'
        });
      }
    }
    // Sort by nearest first
    return matches.sort((a, b) => a.distanceKm - b.distanceKm);
  };

  // --- Blood Requests API ---
  const createBloodRequest = (data) => {
    const newReq = { 
       ...data, 
       request_id: 'req_' + Date.now(), 
       status: 'Pending', 
       timestamp: new Date().toISOString() 
    };
    setBloodRequests(prev => [newReq, ...prev]);
    return newReq;
  };
  
  const updateBloodRequestStatus = (id, updates) => {
    setBloodRequests(prev => prev.map(r => {
      if (r.request_id === id) {
        // Auto-Certificate Hook
        if (updates.status === 'Completed' && r.status !== 'Completed' && r.donor_id) {
           const donor = users.find(u => u.id === r.donor_id);
           if (donor) {
              import('../components/donor/RewardCertificate.js').then(({ generateCertificate }) => {
                 const dataUri = generateCertificate(donor.name, r.bloodGroup, new Date().toISOString().split('T')[0], "Blood Donation Certificate");
                 setCertificates(prevCerts => [{
                   certificate_id: 'cert_' + Date.now(),
                   user_id: r.donor_id,
                   type: "Blood Donation Certificate",
                   pdf_url: dataUri,
                   issue_date: new Date().toISOString().split('T')[0]
                 }, ...prevCerts]);
              }).catch(e => console.error(e));
           }
        }
        return { ...r, ...updates };
      }
      return r;
    }));
  };
  
  const getRequestsForHospital = (hospitalName) => bloodRequests.filter(r => r.hospitalName === hospitalName);
  
  // For Donor Dashboard Feed (Realtime mock sync happens because context triggers re-render)
  const getActiveRequestsMatchingDonor = (donorProfile, maxDistanceKm = 20) => {
    const active = bloodRequests.filter(r => r.status === 'Pending' || (r.status === 'Donor Accepted' && r.donor_id === donorProfile.id));
    
    // Filter by matching group and distance
    return active.filter(req => {
      // Basic check: exact blood group match
      if (req.bloodGroup !== donorProfile.bloodGroup) return false;
      if (!req.lat || !req.lng) return true; // If request has no precise coords, assume it's visible.
      const dist = calculateDistance(donorProfile.lat, donorProfile.lng, req.lat, req.lng);
      return dist <= maxDistanceKm;
    });
  };

  // --- Ambulance API --- 
  const createBooking = (data) => {
    const newBooking = { ...data, booking_id: 'book_' + Date.now(), status: 'Pending', timestamp: new Date().toISOString() };
    setAmbulanceBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };
  const updateBookingStatus = (id, updates) => setAmbulanceBookings(prev => prev.map(b => b.booking_id === id ? { ...b, ...updates } : b));
  const getPatientBookings = (patientId) => ambulanceBookings.filter(b => b.patient_id === patientId);

  // Global Manual Search Registry
  const searchDonors = (locationText = '', bloodGroup = '', userLat, userLng) => {
    let allDonors = getDonors().filter(d => d.isAvailable === true);
    
    // 1. Filter by Blood Group (if provided)
    if (bloodGroup && bloodGroup !== 'All') {
      allDonors = allDonors.filter(d => d.bloodGroup === bloodGroup);
    }
    
    // 2. Filter by Location Text Partial Match
    if (locationText.trim() !== '') {
      const term = locationText.toLowerCase();
      allDonors = allDonors.filter(d => {
        const strLoc = (d.location || d.locName || '').toLowerCase();
        return strLoc.includes(term);
      });
    }

    // 3. Compute Distance if user coords provided
    if (userLat != null && userLng != null) {
      allDonors = allDonors.map(d => {
        if (!d.lat || !d.lng) return { ...d, distanceKm: 9999, distanceFormatted: 'Unknown' };
        const dist = calculateDistance(userLat, userLng, d.lat, d.lng);
        return {
          ...d,
          distanceKm: dist,
          distanceFormatted: dist < 1 ? '< 1 km' : dist.toFixed(1) + ' km'
        };
      });
      // Sort nearest first
      allDonors.sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      // Just sort alphabetically if no location is available yet
      allDonors.sort((a, b) => a.name.localeCompare(b.name));
    }

    return allDonors;
  };

  // Certificates API (with duplicate prevention)
  const addCertificate = (userId, type, payloadDataUri, date) => {
    // Duplicate check: prevent issuing same certificate type to same user
    const existingCerts = certificates.filter(c => c.user_id === userId && c.type === type);
    if (type === 'Registered Blood Donor Certificate' && existingCerts.length > 0) {
      console.log("Certificate already exists for user:", userId, type);
      return existingCerts[0]; // Return existing one
    }

    const newCert = {
      certificate_id: 'cert_' + Date.now(),
      user_id: userId,
      type: type,
      pdf_url: payloadDataUri, // storing raw base64 dataURI
      issue_date: date || new Date().toISOString().split('T')[0]
    };
    
    setCertificates(prev => [newCert, ...prev]);
    return newCert;
  };

  const getUserCertificates = (userId) => {
    return certificates.filter(c => c.user_id === userId);
  };

  // Backfill: ensure existing donors who registered before this feature get their registration cert
  const ensureRegistrationCertificate = (user) => {
    if (!user || user.role !== 'donor') return;
    const existing = certificates.find(c => c.user_id === user.id && c.type === 'Registered Blood Donor Certificate');
    if (!existing) {
      import('../components/donor/RewardCertificate.js').then(({ generateCertificate }) => {
        const dataUri = generateCertificate(user.name, user.bloodGroup, new Date().toISOString().split('T')[0], "Registered Blood Donor Certificate");
        addCertificate(user.id, 'Registered Blood Donor Certificate', dataUri);
      }).catch(e => console.error("Backfill cert error:", e));
    }
  };

  const issueFirstAidCertificate = async (userId, userName) => {
    const { generateFirstAidCertificate } = await import('../components/health/FirstAidCertificate');
    const certId = 'LL-FA-' + Date.now().toString().slice(-6);
    const date = new Date().toLocaleDateString();
    const dataUri = generateFirstAidCertificate(userName, date, certId);
    
    return addCertificate(userId, 'First Aid Course Completion', dataUri, date);
  };

  // --- Health Videos API ---
  const getVideosByCategory = (category) => {
    if (!category || category === 'All') return healthVideos;
    return healthVideos.filter(v => v.category === category);
  };

  const addHealthVideo = (video) => {
    const newVideo = { 
      ...video, 
      id: 'vid_' + Date.now(),
      thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`
    };
    setHealthVideos(prev => [...prev, newVideo]);
    return newVideo;
  };

  const deleteHealthVideo = (id) => {
    setHealthVideos(prev => prev.filter(v => v.id !== id));
  };

  // --- BMI & Goals API ---
  const addBMIRecord = (userId, record) => {
    const newRecord = { ...record, id: 'bmi_' + Date.now(), timestamp: new Date().toISOString() };
    setBmiRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };

  const getBMIRecords = (userId) => bmiRecords.filter(r => r.userId === userId);

  const updateUserGoal = (userId, goalData) => {
    setUserGoals(prev => ({ ...prev, [userId]: { ...prev[userId], ...goalData } }));
  };

  const getUserGoal = (userId) => userGoals[userId] || { targetWeight: null };

  const value = {
    users,
    bloodRequests,
    ambulanceBookings,
    certificates,
    healthVideos,
    getUser,
    createUser,
    getDrivers,
    getDonors,
    getMatchingDonors,
    searchDonors,
    createBloodRequest,
    updateBloodRequestStatus,
    getRequestsForHospital,
    getActiveRequestsMatchingDonor,
    createBooking,
    updateBookingStatus,
    getPatientBookings,
    addCertificate,
    getUserCertificates,
    ensureRegistrationCertificate,
    getVideosByCategory,
    addHealthVideo,
    deleteHealthVideo,
    issueFirstAidCertificate,
    bmiRecords,
    addBMIRecord,
    getBMIRecords,
    updateUserGoal,
    getUserGoal
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}
