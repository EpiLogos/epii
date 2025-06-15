
import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { UserContextProvider } from "./subsystems/4_nara/4_context/UserContextProvider";

// Pages
import Welcome from "./shared/pages/Welcome";
import FileHub from "./shared/pages/FileHub";
import Meta3D from "./subsystems/1_paramasiva/5_integration/Meta3D";
import Meta2D from "./subsystems/0_anuttara/5_integration/Meta2D";


import NotFound from "./shared/pages/NotFound";
import Auth from "./shared/pages/Auth";
// Bimba-aligned components
import EpiiModePage from "./subsystems/5_epii/5_integration/EpiiModePage";
import NaraModePage from "./subsystems/4_nara/5_integration/NaraModePage";
import UserSettings from "./subsystems/4_nara/5_integration/UserSettings";

// Layout
import Navbar from "./shared/components/layout/Navbar";
import PageTransition from "./shared/components/layout/PageTransition";

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
        <Route path="/chat" element={<NaraModePage />} />
        <Route path="/epii" element={<EpiiModePage />} />
        <Route path="/auth" element={<Auth />} />        <Route path="/settings" element={<UserSettings />} />
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
