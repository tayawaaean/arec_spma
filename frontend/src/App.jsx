import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/Map';
import DataPage from './pages/Data';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import PumpDetails from './pages/PumpDetails';
import PumpManagement from './pages/PumpManagement';
import { authService } from './utils/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'; 
import './styles/login.css';
import './styles/dashboard.css';
import './styles/pump-table.css';
import './styles/modal-dark.css';
import './styles/data-analysis.css';
import './styles/sidebar.css';
import './styles/component-panel-fixes.css';
import './styles/custom.css';

// Create Dashboard Context for shared state
export const DashboardContext = createContext();
// Create Auth Context for user details
export const AuthContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [dashboardSettings, setDashboardSettings] = useState({
    timeRange: 'month',
    refreshInterval: 30, // seconds
    lastRefreshed: new Date(),
    currentDateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
  });
  
  // Listen for changes to authentication
  useEffect(() => {
    const checkAuth = () => {
      const auth = authService.isAuthenticated();
      setIsAuthenticated(auth);
      
      const savedUser = localStorage.getItem('user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    
    // Check immediately and also set up event listener
    checkAuth();
    
    // Listen for storage events (in case another tab changes auth)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for auth changes within the same page
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setDashboardSettings(prev => ({
        ...prev,
        currentDateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }));
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <Router>
      <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
        {isAuthenticated ? (
          <DashboardContext.Provider value={{ 
            dashboardSettings, 
            setDashboardSettings,
            currentUser: user ? user.username : 'Guest'
          }}>
            <div className="app-container d-flex">
              <Sidebar />
              <div className="content-wrapper">
                <Header />
                <main className="main-content p-3">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/datas" element={<DataPage />} />
                    <Route path="/pumps" element={<PumpManagement />} />
                    <Route path="/pumps/:id" element={<PumpDetails />} />
                    {/* Only allow access to Users page for admin and superadmin */}
                    {user && ['admin', 'superadmin'].includes(user.userType) && (
                      <Route path="/users" element={<Users />} />
                    )}
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/logout" element={
                      <LogoutHandler />
                    } />
                    <Route path="/" element={<Navigate replace to="/dashboard" />} />
                    <Route path="*" element={<Navigate replace to="/dashboard" />} />
                  </Routes>
                </main>
              </div>
            </div>
          </DashboardContext.Provider>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate replace to="/login" />} />
          </Routes>
        )}
      </AuthContext.Provider>
    </Router>
  );
}

// Helper component to handle logout
function LogoutHandler() {
  React.useEffect(() => {
    authService.logout();
  }, []);
  return <div>Logging out...</div>;
}

export default App;