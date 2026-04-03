import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import DonorDashboard from './pages/donor/DonorDashboard';
import AmbulanceDashboard from './pages/driver/AmbulanceDashboard';
import CommunityFeed from './pages/community/CommunityFeed';
import UserProfile from './pages/profile/UserProfile';
import DonorSearch from './pages/search/DonorSearch';
import HealthAssistant from './pages/health/HealthAssistant';
import { AuthProvider } from './contexts/AuthContext';
import { DatabaseProvider } from './contexts/DatabaseContext';

function App() {
  return (
    <Router>
      <DatabaseProvider>
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/patient/request" element={<PatientDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/hospital" element={<HospitalDashboard />} />
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/driver" element={<AmbulanceDashboard />} />
              <Route path="/community" element={<CommunityFeed />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/search" element={<DonorSearch />} />
              <Route path="/health" element={<HealthAssistant />} />
            </Route>
          </Routes>
        </AuthProvider>
      </DatabaseProvider>
    </Router>
  );
}

export default App;
