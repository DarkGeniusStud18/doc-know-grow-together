
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { createGroupMessageRpcFunctions } from './integrations/supabase/rpc-functions';
import MusicNotification from './components/music/MusicNotification';
import { MusicSync } from './components/music/MusicSync';

// Pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EmailConfirmation from './pages/EmailConfirmation';
import StudyGroups from './pages/StudyGroups';
import StudyGroupDetail from './pages/StudyGroupDetail';
import Resources from './pages/Resources';
import ResourceArticle from './pages/ResourceArticle';
import ClinicalCases from './pages/ClinicalCases';
import Community from './pages/Community';
import Calendar from './pages/Calendar';
import Notes from './pages/Notes';
import MyCourses from './pages/MyCourses';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Tools from './pages/Tools';
import ExamSimulator from './pages/ExamSimulator';
import KYCVerification from './pages/KYCVerification';
import ContinuingEducation from './pages/ContinuingEducation';
import MusicLibrary from './pages/MusicLibrary';
import Subscription from './pages/Subscription';
import ForgotPassword from './pages/ForgotPassword';
import PasswordRecovery from './pages/PasswordRecovery';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// Component to scroll to top on route change
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [window.location.pathname]);
  
  return null;
};

function App() {
  useEffect(() => {
    // Initialize custom RPC functions
    createGroupMessageRpcFunctions().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/password-recovery" element={<PasswordRecovery />} />
              <Route path="/study-groups" element={<StudyGroups />} />
              <Route path="/study-groups/:groupId" element={<StudyGroupDetail />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:resourceId" element={<ResourceArticle />} />
              <Route path="/clinical-cases" element={<ClinicalCases />} />
              <Route path="/community" element={<Community />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/exam-simulator" element={<ExamSimulator />} />
              <Route path="/kyc" element={<KYCVerification />} />
              <Route path="/kyc-verification" element={<KYCVerification />} />
              <Route path="/continuing-education" element={<ContinuingEducation />} />
              <Route path="/my-courses" element={<MyCourses />} /> 
              <Route path="/music-library" element={<MusicLibrary />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-center" />
            <MusicNotification />
            <MusicSync />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
