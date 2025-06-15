
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageSquare, Brain, Box, Grid, Settings, User } from "lucide-react";
import { useUserContext } from "../../../subsystems/4_nara/4_context/useUserContext";

// Base navigation items
const BASE_NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/files", label: "File Hub" },
  { path: "/meta2d", label: "Meta Structure 2D", icon: <Grid size={16} /> },
  { path: "/meta3d", label: "Meta Structure 3D", icon: <Box size={16} /> },
  { path: "/chat", label: "Chat", icon: <MessageSquare size={16} /> },
  { path: "/epii", label: "Epii Mode", icon: <Brain size={16} /> },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { state: userState, logout } = useUserContext();
  const { isAuthenticated, userData } = userState;

  // Determine navigation items based on authentication state
  const NAV_ITEMS = [...BASE_NAV_ITEMS];

  // Add authentication-related items
  if (!isAuthenticated) {
    NAV_ITEMS.push({
      path: "/auth",
      label: "Sign In"
    });
  }
  // Note: We're removing the Settings from NAV_ITEMS and will add a separate account icon

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "py-3 bg-epii-darker/90 backdrop-blur-md" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-epii-neon text-2xl font-light text-glow">epii</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative transition-all duration-300 hover:text-epii-neon ${
                location.pathname === item.path
                  ? "text-epii-neon text-glow"
                  : "text-foreground/80"
              }`}
            >
              <div className="flex items-center gap-1">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </div>
              {location.pathname === item.path && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-epii-neon animate-pulse"></span>
              )}
            </Link>
          ))}

          {/* Account icon if authenticated */}
          {isAuthenticated && (
            <div className="ml-4 flex items-center">
              <Link
                to="/settings"
                className="flex items-center justify-center h-8 w-8 rounded-full bg-epii-neon/20 text-foreground/80 hover:text-epii-neon transition-colors"
                title="Account Settings"
              >
                <User size={16} className="text-epii-neon" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-foreground/80 hover:text-epii-neon transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-epii-darker/95 backdrop-blur-lg border-b border-epii-neon/20 animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-2 transition-colors ${
                    location.pathname === item.path
                      ? "text-epii-neon text-glow"
                      : "text-foreground/80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
