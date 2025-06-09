import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize WebSocket service with AG-UI support early in app lifecycle
import './subsystems/5_epii/1_services/webSocketService';

createRoot(document.getElementById("root")!).render(<App />);
