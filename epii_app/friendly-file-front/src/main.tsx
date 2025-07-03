import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize WebSocket service with AG-UI support early in app lifecycle
import './epi-logos-system/3_services/webSocketService';

createRoot(document.getElementById("root")!).render(<App />);
