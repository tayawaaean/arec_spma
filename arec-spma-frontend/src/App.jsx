import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Overview from "./components/Overview";
import Dashboard from "./components/Dashboard";
import PumpList from "./components/PumpList";
import Data from "./components/Data";
import Users from "./components/Users";
import Settings from "./components/Settings";

export default function App() {
  const [user, setUser] = useState(null);

  // If not logged in, always show login page
  if (!user) return <LoginPage setUser={setUser} />;

  // After login, default route is overview
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" />} />
        <Route path="/overview" element={<Overview user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/pumps" element={<PumpList user={user} />} />
        <Route path="/data" element={<Data user={user} />} />
        <Route path="/users" element={<Users user={user} />} />
        <Route path="/settings" element={<Settings user={user} />} />
        {/* Redirect any unknown path to overview */}
        <Route path="*" element={<Navigate to="/overview" />} />
      </Routes>
    </Router>
  );
}