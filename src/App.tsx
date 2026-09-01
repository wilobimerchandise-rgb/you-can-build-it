import { Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import VibeMode from './pages/VibeMode';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding" replace />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/vibe" element={<VibeMode />} />
      {/* /parent-hq, /editor/:projectId, /badges follow the same pattern
          — intentionally not padded out per the Week 1-2 scope note. */}
    </Routes>
  );
}
