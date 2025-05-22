
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Database, FileText, Network, Users } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import GeometricBackground from "../components/ui/GeometricBackground";

const Welcome = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroImage = document.getElementById("hero-image");

      if (heroImage) {
        heroImage.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        <GeometricBackground density={15} />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="inline-block px-3 py-1 rounded-full bg-epii-neon/10 text-epii-neon text-sm mb-4">
                    Welcome to the future of knowledge management
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
                    Discover <span className="text-epii-neon text-glow">epii</span>
                    <br />
                    <span className="text-3xl md:text-4xl lg:text-5xl opacity-80">
                      A new way to connect information
                    </span>
                  </h1>
                  <p className="text-lg text-foreground/80 mb-8 max-w-lg">
                    Build, manage, and explore interconnected knowledge through an intuitive
                    interface designed for the modern information age.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/files"
                      className="bg-epii-neon text-epii-darker font-medium px-6 py-3 rounded-md hover:brightness-110 transition-all"
                    >
                      Explore Files
                    </Link>
                    <Link
                      to="/meta-refactored"
                      className="bg-epii-accent text-white font-medium px-6 py-3 rounded-md hover:brightness-110 transition-all"
                    >
                      Try New Meta Structure
                    </Link>
                    <button
                      onClick={scrollToFeatures}
                      className="bg-transparent border border-epii-neon/50 text-epii-neon font-medium px-6 py-3 rounded-md hover:bg-epii-neon/10 transition-all flex items-center justify-center gap-2"
                    >
                      Learn More <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="order-1 md:order-2 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-epii-neon/20 blur-3xl rounded-full opacity-30 animate-pulse"></div>
                  <img
                    id="hero-image"
                    src="/lovable-uploads/21ea9eb5-4dce-4557-a738-629654bd39d1.png"
                    alt="Epii Geometric Face"
                    className="relative z-10 max-w-full h-auto animate-float"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-epii-neon/10 text-epii-neon text-sm mb-4">
                Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-light mb-6">What is <span className="text-epii-neon text-glow">epii</span>?</h2>
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                An intelligent system designed to organize, connect, and visualize information
                in ways that reveal deeper insights and patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FileText className="h-10 w-10 text-epii-neon" />,
                  title: "File Management",
                  description: "Centralized repository for all your digital assets with smart categorization and version control.",
                  delay: 0.1
                },
                {
                  icon: <Network className="h-10 w-10 text-epii-neon" />,
                  title: "Meta Structure",
                  description: "Dynamic mapping of your knowledge ecosystem that evolves as your information grows.",
                  delay: 0.3
                },
                {
                  icon: <Database className="h-10 w-10 text-epii-neon" />,
                  title: "Knowledge Base",
                  description: "Intelligent storage that learns from your data to create meaningful connections.",
                  delay: 0.5
                },
                {
                  icon: <Users className="h-10 w-10 text-epii-neon" />,
                  title: "Collaboration",
                  description: "Seamless multi-user experience with fine-grained access controls and real-time updates.",
                  delay: 0.7
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  viewport={{ once: true }}
                  className="bg-epii-dark neo-glow rounded-lg p-6 text-center transition-all duration-300 hover:bg-epii-dark/70"
                >
                  <div className="bg-epii-neon/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 relative geometric-pattern">
          <div className="container mx-auto px-4">
            <div className="bg-epii-dark/80 neo-glow rounded-lg p-8 md:p-12 backdrop-blur-sm">
              <div className="text-center mb-10">
                <span className="inline-block px-3 py-1 rounded-full bg-epii-accent/10 text-epii-accent text-sm mb-4">
                  Our Vision
                </span>
                <h2 className="text-3xl md:text-4xl font-light mb-6">Why <span className="text-epii-neon text-glow">epii</span> exists</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl mb-4 font-light">Our Mission</h3>
                  <p className="text-foreground/80 mb-4">
                    To revolutionize how humans interact with information by creating an
                    intelligent system that understands the relationships between data points
                    and presents them in meaningful ways.
                  </p>
                  <p className="text-foreground/80">
                    We believe that the right information, presented at the right time,
                    in the right context, can transform how we solve problems and make decisions.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl mb-4 font-light">Our Approach</h3>
                  <ul className="space-y-3">
                    {[
                      "Building intuitive interfaces for complex data visualization",
                      "Leveraging AI to identify patterns and connections",
                      "Creating a framework that adapts to your unique workflow",
                      "Prioritizing security and privacy in knowledge management"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-epii-neon/10 p-1 rounded-full mt-1">
                          <div className="w-2 h-2 bg-epii-neon rounded-full"></div>
                        </div>
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <div className="mt-12 text-center">
                <Link
                  to="/auth"
                  className="bg-epii-accent text-white font-medium px-6 py-3 rounded-md hover:brightness-110 transition-all inline-flex items-center gap-2"
                >
                  Join Our Mission <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Welcome;
