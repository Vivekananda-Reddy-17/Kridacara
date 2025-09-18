import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { AuthForm } from './components/auth/AuthForm';
import { OnboardingForm } from './components/onboarding/OnboardingForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { FitnessAssessment } from './components/fitness/FitnessAssessment';
import { BadmintonAssessment } from './components/badminton/BadmintonAssessment';
import { Profile } from './components/profile/Profile';
import { TalentAssessment } from './components/assessment/TalentAssessment';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { Community } from './components/community/Community';
import { CoachDashboard } from './components/coach/CoachDashboard';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  // Check if user needs to complete onboarding
  if (!user.height || !user.weight) {
    return <OnboardingForm />;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<TalentAssessment />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/coach" element={<CoachDashboard />} />
        <Route path="/fitness" element={<FitnessAssessment />} />
        <Route path="/badminton" element={<BadmintonAssessment />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;