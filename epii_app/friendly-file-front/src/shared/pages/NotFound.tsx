
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import GeometricBackground from "../components/ui/GeometricBackground";

const NotFound = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center">
        <GeometricBackground density={10} opacity={0.03} />
        
        <div className="text-center px-4">
          <h1 className="text-7xl md:text-9xl font-bold text-epii-neon text-glow mb-6">404</h1>
          <h2 className="text-2xl md:text-3xl font-light mb-6">Page Not Found</h2>
          <p className="text-foreground/70 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-epii-neon text-epii-darker font-medium px-6 py-3 rounded-md hover:brightness-110 transition-all"
          >
            <ArrowLeft size={18} />
            Return Home
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
