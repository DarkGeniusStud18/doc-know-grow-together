
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LoadingScreen from './components/layout/LoadingScreen.tsx'
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <LoadingScreen>
      <App />
    </LoadingScreen>
  </HelmetProvider>
);
