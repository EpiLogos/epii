
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { UserContextProvider } from "./subsystems/0_anuttara/4_context/UserContextProvider";

// Pages
import Welcome from "./pages/Welcome";
import FileHub from "./pages/FileHub";
import Meta3D from "./pages/Meta3D";
import Meta2D from "./pages/Meta2D";
import Chat from "./pages/Chat";
import EpiiChatPage from "./pages/EpiiChatPage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Bimba-aligned components
import EpiiModePage from "./subsystems/5_epii/5_integration/EpiiModePage";
import UserSettings from "./subsystems/4_nara/5_pages/UserSettings";

// Layout
import Navbar from "./components/layout/Navbar";
import PageTransition from "./components/layout/PageTransition";

const queryClient = new QueryClient();

// Wrapper component to handle AnimatePresence with Routes
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Welcome />} />
        <Route path="/files" element={<FileHub />} />
        <Route path="/meta3d" element={<Meta3D />} />
        <Route path="/meta2d" element={<Meta2D />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/epii" element={<EpiiModePage />} />
        <Route path="/epii-legacy" element={<EpiiChatPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserContextProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Navbar />
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </UserContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
