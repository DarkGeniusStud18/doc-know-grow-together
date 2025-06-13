
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LoadingScreen from './components/layout/LoadingScreen.tsx'
import { HelmetProvider } from 'react-helmet-async'

// Ensure root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <HelmetProvider>
    <LoadingScreen>
      <App />
    </LoadingScreen>
  </HelmetProvider>
);
