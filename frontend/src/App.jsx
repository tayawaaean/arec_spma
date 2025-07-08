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
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'; 
import './styles/custom.css';
import './styles/login.css';
import './styles/dashboard.css';
import './styles/pump-table.css';
import './styles/modal-dark.css';
import './styles/data-analysis.css';
import './styles/data-analysis.css'; // Add this new import

// Create Dashboard Context for shared state
export const DashboardContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [dashboardSettings, setDashboardSettings] = useState({
    timeRange: 'month',
    refreshInterval: 30, // seconds
    lastRefreshed: new Date(),
    currentUser: 'DextieeThese', // Updated username
    currentDateTime: '2025-07-08 07:36:31' // Updated current date and time
  });
  
  // Listen for changes to localStorage
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(auth);
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

  return (
    <Router>
      {isAuthenticated ? (
        <DashboardContext.Provider value={{ dashboardSettings, setDashboardSettings }}>
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
                  <Route path="/users" element={<Users />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/logout" element={
                    <LogoutHandler setIsAuthenticated={setIsAuthenticated} />
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
    </Router>
  );
}

// Helper component to handle logout
function LogoutHandler({ setIsAuthenticated }) {
  React.useEffect(() => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);
  return <div>Logging out...</div>;
}

export default App;