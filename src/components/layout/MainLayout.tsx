
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import DiscordSidebar from './DiscordSidebar';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = false // Changed default to false
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!loading && !user && requireAuth) {
      navigate('/login');
    }
  }, [user, loading, navigate, requireAuth]);
  
  if (loading && requireAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-medical-blue animate-spin" />
          <p className="text-medical-navy animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }
  
  // Public layout (for login, register, landing page)
  if (!requireAuth) {
    return (
      <div className="min-h-screen bg-medical-light flex flex-col">
        <Navbar simplified />
        <main className="flex-grow overflow-x-hidden px-4 sm:px-6">
          {children}
        </main>
        <footer className="bg-white py-6 border-t mt-auto">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} MedCollab. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    );
  }
  
  // Authenticated layout with Discord-style navigation
  return (
    <div className="min-h-screen bg-medical-light flex overflow-hidden">
      {/* Discord-style sidebar for desktop */}
      <DiscordSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile navbar shown on small screens */}
        <MobileNavbar />
        
        {/* Desktop navbar shown on medium screens and above */}
        <DesktopNavbar />
        
        <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full overflow-x-auto">
          {children}
        </main>
        
        <footer className="bg-white py-4 border-t mt-auto">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} MedCollab. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
