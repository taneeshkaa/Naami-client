import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingLayout } from './components/layout/LandingLayout';
import { ShellLayout } from './components/layout/ShellLayout';
import { LandingPage } from './pages/LandingPage';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { DashboardV2 } from './pages/DashboardV2';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing — standalone with top navbar */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* New Premium Dashboard V2 / Feed — standalone 3-column layout */}
        <Route path="/feed" element={<DashboardV2 />} />
        <Route path="/event/:eventId" element={<DashboardV2 />} />

        {/* App shell — sidebar + bottom bar for utility pages */}
        <Route element={<ShellLayout />}>
          <Route path="/explore" element={<div className="p-8 text-center text-gray-500 font-medium tracking-wide">Explore (Coming Soon)</div>} />
          <Route path="/events" element={<div className="p-8 text-center text-gray-500 font-medium tracking-wide">My Events (Coming Soon)</div>} />
          <Route path="/notifications" element={<div className="p-8 text-center text-gray-500 font-medium tracking-wide">Notifications (Coming Soon)</div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/:username" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

