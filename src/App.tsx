
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ThemeProvider from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { createGroupMessageRpcFunctions } from './integrations/supabase/rpc-functions';

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
import ClinicalCases from './pages/ClinicalCases';
import Community from './pages/Community';
import Calendar from './pages/Calendar';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              <Route path="/study-groups" element={<StudyGroups />} />
              <Route path="/study-groups/:groupId" element={<StudyGroupDetail />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/clinical-cases" element={<ClinicalCases />} />
              <Route path="/community" element={<Community />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-center" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
