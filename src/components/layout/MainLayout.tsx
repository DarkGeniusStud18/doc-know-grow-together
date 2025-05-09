
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import DiscordSidebar from './DiscordSidebar';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!loading && !user && requireAuth) {
      navigate('/login');
    }
  }, [user, loading, navigate, requireAuth]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin-slow h-16 w-16 rounded-full border-4 border-medical-teal border-t-transparent"></div>
      </div>
    );
  }
  
  // Public layout (for login, register, landing page)
  if (!requireAuth) {
    return (
      <div className="min-h-screen bg-medical-light flex flex-col">
        <Navbar simplified />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-white py-6 border-t">
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
    <div className="min-h-screen bg-medical-light flex">
      {/* Discord-style sidebar for desktop */}
      <DiscordSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Mobile navbar shown on small screens */}
        <MobileNavbar />
        
        {/* Desktop navbar shown on medium screens and above */}
        <DesktopNavbar />
        
        <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
        
        <footer className="bg-white py-4 border-t">
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
