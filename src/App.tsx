
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import KYCVerification from "./pages/KYCVerification";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import Notes from "./pages/Notes";
import Calendar from "./pages/Calendar";
import StudyGroups from "./pages/StudyGroups";
import StudyGroupDetail from "./pages/StudyGroupDetail";
import ClinicalCases from "./pages/ClinicalCases";
import Community from "./pages/Community";
import CommunityDiscussion from "./pages/CommunityDiscussion";
import Settings from "./pages/Settings";
import Tools from "./pages/Tools";
import ExamSimulator from "./pages/ExamSimulator";
import ExamHistory from "./pages/ExamHistory"; 
import Activities from "./pages/Activities"; 
import ContinuingEducation from "./pages/ContinuingEducation";
import Profile from "./pages/Profile";
import EmailConfirmation from "./pages/EmailConfirmation";
import NotFound from "./pages/NotFound";

// Productivity tools
import StudyPlanner from "./pages/tools/StudyPlanner";
import TaskList from "./pages/tools/TaskList";
import StudyTimer from "./pages/tools/StudyTimer";
import FlashcardGenerator from "./pages/tools/flashcards/FlashcardGenerator";
import InteractivePresentations from "./pages/tools/InteractivePresentations";
import ClinicalCasesExplorer from "./pages/tools/ClinicalCasesExplorer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/kyc" element={<KYCVerification />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:id" element={<ResourceDetail />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/study-groups" element={<StudyGroups />} />
              <Route path="/study-groups/:id" element={<StudyGroupDetail />} />
              <Route path="/clinical-cases" element={<ClinicalCases />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/:id" element={<CommunityDiscussion />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/continuing-education" element={<ContinuingEducation />} />
              <Route path="/exam-simulator" element={<ExamSimulator />} />
              <Route path="/exam-history" element={<ExamHistory />} />
              <Route path="/activities" element={<Activities />} />
              
              {/* Productivity tools routes */}
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/study-planner" element={<StudyPlanner />} />
              <Route path="/tools/task-list" element={<TaskList />} />
              <Route path="/tools/study-timer" element={<StudyTimer />} />
              <Route path="/tools/flashcards/flashcard-generator" element={<FlashcardGenerator />} />
              <Route path="/tools/interactive-presentations" element={<InteractivePresentations />} />
              <Route path="/tools/clinical-cases-explorer" element={<ClinicalCasesExplorer />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
