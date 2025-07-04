import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import PumpList from "./components/PumpList";

export default function App() {
  const [user, setUser] = useState(null);

  // If not logged in, always show login page
  if (!user) return <LoginPage setUser={setUser} />;

  // After login, enable routing between dashboard and pump list
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/pumps" element={<PumpList user={user} />} />
        {/* Redirect any unknown path to dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}