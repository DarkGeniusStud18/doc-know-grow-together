
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
import FlashcardGenerator from '@/pages/tools/flashcards/FlashcardGenerator';
import PomodoroTimer from '@/pages/tools/PomodoroTimer';
import StudyTimer from '@/pages/tools/StudyTimer';
import StudyPlanner from '@/pages/tools/StudyPlanner';
import StudyGoals from '@/pages/tools/StudyGoals';
import TaskList from '@/pages/tools/TaskList';
import MedicalCalculators from '@/pages/tools/MedicalCalculators';
import ResearchAssistant from '@/pages/tools/ResearchAssistant';
import QuizGenerator from '@/pages/tools/QuizGenerator';
import PerformanceTracker from '@/pages/tools/PerformanceTracker';
import InteractivePresentations from '@/pages/tools/InteractivePresentations';
import ClinicalCasesExplorer from '@/pages/tools/ClinicalCasesExplorer';
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
              <Route path="/tools/flashcard-generator" element={<FlashcardGenerator />} />
              <Route path="/tools/pomodoro" element={<PomodoroTimer />} />
              <Route path="/tools/study-timer" element={<StudyTimer />} />
              <Route path="/tools/study-planner" element={<StudyPlanner />} />
              <Route path="/tools/study-goals" element={<StudyGoals />} />
              <Route path="/tools/task-list" element={<TaskList />} />
              <Route path="/tools/medical-calculator" element={<MedicalCalculators />} />
              <Route path="/tools/research-assistant" element={<ResearchAssistant />} />
              <Route path="/tools/quiz-generator" element={<QuizGenerator />} />
              <Route path="/tools/performance-tracker" element={<PerformanceTracker />} />
              <Route path="/tools/interactive-presentations" element={<InteractivePresentations />} />
              <Route path="/tools/clinical-cases" element={<ClinicalCasesExplorer />} />
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
