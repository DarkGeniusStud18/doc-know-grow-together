
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import KYCVerification from "./pages/KYCVerification";
import Resources from "./pages/Resources";
import Notes from "./pages/Notes";
import Calendar from "./pages/Calendar";
import StudyGroups from "./pages/StudyGroups";
import ClinicalCases from "./pages/ClinicalCases";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import Tools from "./pages/Tools";
import ExamSimulator from "./pages/ExamSimulator";
import ContinuingEducation from "./pages/ContinuingEducation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/kyc" element={<KYCVerification />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/study-groups" element={<StudyGroups />} />
            <Route path="/clinical-cases" element={<ClinicalCases />} />
            <Route path="/community" element={<Community />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/exam-simulator" element={<ExamSimulator />} />
            <Route path="/continuing-education" element={<ContinuingEducation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
