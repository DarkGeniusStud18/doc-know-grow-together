
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/sonner';

// Page imports
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Resources from '@/pages/Resources';
import Community from '@/pages/Community';
import CommunityDiscussion from '@/pages/CommunityDiscussion';
import Calendar from '@/pages/Calendar';
import Notes from '@/pages/Notes';
import StudyGroups from '@/pages/StudyGroups';
import StudyGroupDetail from '@/pages/StudyGroupDetail';
import Tools from '@/pages/Tools';
import ExamSimulator from '@/pages/ExamSimulator';
import ExamHistory from '@/pages/ExamHistory';
import ClinicalCases from '@/pages/ClinicalCases';
import ContinuingEducation from '@/pages/ContinuingEducation';
import MusicLibrary from '@/pages/MusicLibrary';
import Subscription from '@/pages/Subscription';
import KYCVerification from '@/pages/KYCVerification';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/:id" element={<CommunityDiscussion />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/study-groups" element={<StudyGroups />} />
              <Route path="/study-groups/:id" element={<StudyGroupDetail />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/exam-simulator" element={<ExamSimulator />} />
              <Route path="/exam-history" element={<ExamHistory />} />
              <Route path="/clinical-cases" element={<ClinicalCases />} />
              <Route path="/continuing-education" element={<ContinuingEducation />} />
              <Route path="/music-library" element={<MusicLibrary />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/kyc" element={<KYCVerification />} />
              <Route path="/kyc-verification" element={<KYCVerification />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
