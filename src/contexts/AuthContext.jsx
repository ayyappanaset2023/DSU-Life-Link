import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockSendOTP, mockVerifyOTP } from '../services/firebase/mockAuth';
import { useDatabase } from './DatabaseContext'; // We will create this next

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getUser, createUser, addCertificate } = useDatabase();

  useEffect(() => {
    const storedUser = localStorage.getItem('lifelink_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Try to get fresh data from DB using phone number as unique identifier
        const freshUser = getUser(parsed.phone);
        if (freshUser) {
          setCurrentUser(freshUser);
          localStorage.setItem('lifelink_user', JSON.stringify(freshUser));
        } else {
          setCurrentUser(parsed);
        }
      } catch (e) {
        console.error("Auth sync error:", e);
      }
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOTP = async (phone) => {
    return await mockSendOTP(phone);
  };

  const verifyOTP = async (phone, otp) => {
    // 1. ADMIN MASTER CREDENTIALS CHECK
    if (phone === '7845389827' && otp === '9827') {
      const adminUser = {
        id: 'admin_master_001',
        name: 'System Administrator',
        phone: '7845389827',
        role: 'admin',
        isVerified: true
      };
      setCurrentUser(adminUser);
      localStorage.setItem('lifelink_user', JSON.stringify(adminUser));
      return adminUser;
    }

    const authUser = await mockVerifyOTP(phone, otp);
    console.log("Auth User:", authUser);
    
    // Check if user exists in our mock DB
    const dbUser = getUser(phone);
    if (!dbUser) {
      throw new Error('User not registered. Please register first.');
    }
    
    console.log("User Data:", dbUser);
    
    // Valid DB User
    setCurrentUser(dbUser);
    localStorage.setItem('lifelink_user', JSON.stringify(dbUser));
    return dbUser;
  };

  const register = async (userData) => {
    // In real app: send OTP to verify phone, then save to DB.
    // For mock: just save to DB immediately.
    const newUser = createUser(userData);
    
    // Auto-issue Certificate for new Donors
    if (newUser.role === 'donor') {
       import('../components/donor/RewardCertificate.js').then(({ generateCertificate }) => {
          const dataUri = generateCertificate(newUser.name, newUser.bloodGroup);
          addCertificate(newUser.id, 'Registered Blood Donor Certificate', dataUri);
       }).catch(e => console.error("Failed to generate certificate", e));
    }

    console.log("User Data:", newUser);
    setCurrentUser(newUser);
    localStorage.setItem('lifelink_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lifelink_user');
  };

  const value = {
    currentUser,
    sendOTP,
    verifyOTP,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600 mb-4"></div>
          <p className="text-gray-500 font-bold text-lg">Loading Dashboard...</p>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}
