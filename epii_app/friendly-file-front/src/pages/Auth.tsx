
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import GeometricBackground from "../components/ui/GeometricBackground";
import axios from "axios";
import { useUserContext } from "../subsystems/0_anuttara/4_context/useUserContext";

type AuthMode = "signin" | "signup";

const Auth = () => {
  const navigate = useNavigate();
  const { login, state: userState } = useUserContext();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (userState.isAuthenticated) {
      const redirectPath = userState.userData?.role === 'admin' ? '/epii' : '/chat';
      navigate(redirectPath);
    }
  }, [userState.isAuthenticated, userState.userData?.role, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const endpoint = mode === "signin" ? "login" : "register";
      const payload = mode === "signin"
        ? { emailOrName: formData.email || formData.name, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await axios.post(
        `${backendUrl}/api/auth/${endpoint}`,
        payload
      );

      // Store user data in localStorage and update context
      if (response.data.success) {
        const userData = response.data.user;
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('accessToken', response.data.accessToken);

        // Update user context
        await login(userData);

        // Redirect will happen automatically via the useEffect
      } else {
        setError(response.data.message || "An error occurred");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Authentication failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === "signin" ? "signup" : "signin");
    // Reset form and clear errors when switching modes
    setFormData({ name: "", email: "", password: "" });
    setError(null);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex justify-center items-center py-16">
        <GeometricBackground density={15} />

        <div className="container mx-auto px-4 flex justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-light mb-4">
                  {mode === "signin" ? "Welcome Back" : "Join epii"}
                </h1>
                <p className="text-foreground/70">
                  {mode === "signin"
                    ? "Sign in to access your epii resources"
                    : "Create an account to get started with epii"}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-epii-dark/80 neo-glow rounded-lg p-8"
            >
              {/* Auth Tabs */}
              <div className="flex mb-6 border-b border-white/10">
                <button
                  className={`pb-3 px-4 transition-all ${
                    mode === "signin"
                      ? "text-epii-neon border-b-2 border-epii-neon"
                      : "text-foreground/60 hover:text-foreground/80"
                  }`}
                  onClick={() => setMode("signin")}
                >
                  Sign In
                </button>
                <button
                  className={`pb-3 px-4 transition-all ${
                    mode === "signup"
                      ? "text-epii-neon border-b-2 border-epii-neon"
                      : "text-foreground/60 hover:text-foreground/80"
                  }`}
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit}>
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md flex items-center gap-2 text-red-300">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name field - only for signup */}
                {mode === "signup" && (
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-foreground/70 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50">
                        <User size={18} />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        placeholder="Enter your name"
                        className="w-full pl-10 pr-4 py-3 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50 disabled:opacity-60"
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-foreground/70 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50">
                      <Mail size={18} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="text-foreground/70">
                      Password
                    </label>
                    {mode === "signin" && (
                      <a href="#" className="text-epii-neon text-sm hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50">
                      <Lock size={18} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      placeholder={mode === "signin" ? "Enter your password" : "Create a password"}
                      className="w-full pl-10 pr-12 py-3 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground/80"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-epii-neon text-epii-darker font-medium w-full py-3 rounded-md hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {mode === "signin" ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : (
                    <>
                      {mode === "signin" ? "Sign In" : "Create Account"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Alternate action */}
              <div className="mt-6 text-center">
                <p className="text-foreground/70">
                  {mode === "signin"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  {" "}
                  <button
                    onClick={toggleMode}
                    className="text-epii-neon hover:underline font-medium"
                  >
                    {mode === "signin" ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;
