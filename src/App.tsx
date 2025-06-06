/* eslint-disable react-hooks/exhaustive-deps */
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
import Functionalities from './pages/Functionalities';

// Tool pages
import ToolsHub from './pages/tools/ToolsHub';
import StudyPlanner from './pages/tools/StudyPlanner';
import TaskList from './pages/tools/TaskList';
import StudyTimer from './pages/tools/StudyTimer';
import FlashcardGenerator from './pages/tools/FlashcardGenerator';
import InteractivePresentations from './pages/tools/InteractivePresentations';
import ClinicalCasesExplorer from './pages/tools/ClinicalCasesExplorer';
import PomodoroTimer from './pages/tools/PomodoroTimer';
import MedicalCalculators from './pages/tools/MedicalCalculators';
import ResearchAssistant from './pages/tools/ResearchAssistant';
import QuizGenerator from './pages/tools/QuizGenerator';
import StudyGoals from './pages/tools/StudyGoals';
import PerformanceTracker from './pages/tools/PerformanceTracker';

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
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/functionalities" element={<Functionalities />} />
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
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/tools" element={<ToolsHub />} />
              <Route path="/tools/pomodoro" element={<PomodoroTimer />} />
              <Route path="/tools/study-planner" element={<StudyPlanner />} />
              <Route path="/tools/flashcard-generator" element={<FlashcardGenerator />} />
              <Route path="/tools/flashcards/flashcard-generator" element={<FlashcardGenerator />} />
              <Route path="/tools/study-goals" element={<StudyGoals />} />
              <Route path="/tools/medical-calculators" element={<MedicalCalculators />} />
              <Route path="/tools/research-assistant" element={<ResearchAssistant />} />
              <Route path="/tools/quiz-generator" element={<QuizGenerator />} />
              <Route path="/tools/performance-tracker" element={<PerformanceTracker />} />
              <Route path="/tools/task-list" element={<TaskList />} />
              <Route path="/tools/study-timer" element={<StudyTimer />} />
              <Route path="/tools/interactive-presentations" element={<InteractivePresentations />} />
              <Route path="/tools/clinical-cases-explorer" element={<ClinicalCasesExplorer />} />
              <Route path="/tools/*" element={<Tools />} />
              <Route path="/exam-simulator" element={<ExamSimulator />} />
              <Route path="/kyc" element={<KYCVerification />} />
              <Route path="/kyc-verification" element={<KYCVerification />} />
              <Route path="/continuing-education" element={<ContinuingEducation />} />
              <Route path="/music-library" element={<MusicLibrary />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-center" />
            <MusicNotification />
            <MusicSync />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
