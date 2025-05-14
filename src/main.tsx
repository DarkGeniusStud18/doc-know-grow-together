
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LoadingScreen from './components/layout/LoadingScreen.tsx'

createRoot(document.getElementById("root")!).render(
  <LoadingScreen>
    <App />
  </LoadingScreen>
);
