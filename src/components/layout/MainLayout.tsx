
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
  requireAuth = false 
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Timeout for loading to prevent infinite loading
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, []);
  
  React.useEffect(() => {
    if (!loading && !user && requireAuth) {
      navigate('/login');
    }
  }, [user, loading, navigate, requireAuth]);
  
  // Show loading only for a reasonable time
  if (loading && requireAuth && !loadingTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-medical-light">
        <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-xl shadow-sm">
          <Loader2 className="h-16 w-16 text-medical-blue animate-spin" />
          <p className="text-medical-navy animate-pulse text-lg font-medium">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // If loading timeout reached and still no user but auth required, redirect to login
  if (loadingTimeout && !user && requireAuth) {
    navigate('/login');
    return null;
  }
  
  // Si l'utilisateur est connecté, afficher la mise en page authentifiée
  if (user) {
    return (
      <div className="min-h-screen bg-medical-light flex overflow-hidden">
        {/* Discord-style sidebar for desktop */}
        <DiscordSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile navbar shown on small screens */}
          <MobileNavbar />
          
          {/* Desktop navbar shown on medium screens and above */}
          <DesktopNavbar />
          
          <main className="flex-grow p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-auto">
            <div className="space-y-6 md:space-y-8">
              {children}
            </div>
          </main>
          
          <footer className="bg-white py-6 md:py-8 border-t mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} MedCollab. Tous droits réservés.
              </p>
            </div>
          </footer>
        </div>
      </div>
    );
  }
  
  // Public layout (for login, register, landing page)
  return (
    <div className="min-h-screen bg-medical-light flex flex-col">
      <Navbar simplified />
      <main className="flex-grow overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {children}
        </div>
      </main>
      <footer className="bg-white py-6 md:py-8 border-t mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MedCollab. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
