/**
 * Nara Mode Integration Page
 * Bimba Coordinate: #4-3-4.5-5
 *
 * Main integration page for Nara mode featuring the triadic flow:
 * Identity Dynamics -> Oracle -> Journal
 *
 * This replaces the basic Chat.tsx page with a comprehensive
 * AI-augmented platform for self-discovery and individuation.
 */

import React, { useState, useEffect } from 'react';
import PageTransition from "../../../components/layout/PageTransition";
import GeometricBackground from "../../../components/ui/GeometricBackground";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Eye, BookOpen, Sparkles, Calendar, Save } from "lucide-react";
import { useUserContext } from "../../0_anuttara/4_context/useUserContext";
import axios from 'axios';

// Import section components (to be created in subsequent epics)
// import IdentityDynamics from '../3_visualization/IdentityDynamics';
// import OracleInterface from '../3_visualization/OracleInterface';
// import JournalInterface from '../3_visualization/JournalInterface';
// import NaraSidebar from '../3_visualization/NaraSidebar';

// Full-page section components
const IdentityDynamicsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeLayer, setActiveLayer] = useState<string>('overview');
  const { state: userState } = useUserContext();
  const [birthdate, setBirthdate] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('');
  const [birthLocation, setBirthLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const mahamayaLayers = [
    {
      id: 'birthdate-encoding',
      title: 'Birthdate Encoding',
      description: 'Numerological foundation and birth data analysis',
      icon: '🎂',
      status: 'pending' // Will be dynamic based on user data
    },
    {
      id: 'astrological-chart',
      title: 'Astrological Chart',
      description: 'Natal chart, planetary positions, and cosmic influences',
      icon: '⭐',
      status: 'pending'
    },
    {
      id: 'jungian-assessment',
      title: 'Jungian Assessment',
      description: 'Personality types, cognitive functions, and archetypes',
      icon: '🧠',
      status: 'pending'
    },
    {
      id: 'gene-keys-profile',
      title: 'Gene Keys Profile',
      description: 'Genetic wisdom, life purpose, and activation sequences',
      icon: '🧬',
      status: 'pending'
    },
    {
      id: 'human-design-profile',
      title: 'Human Design Profile',
      description: 'Type, strategy, authority, and energetic blueprint',
      icon: '⚡',
      status: 'pending'
    },
    {
      id: 'archetypal-quintessence',
      title: 'Archetypal Quintessence',
      description: 'Synthesized essence from 6-layer identity + 5 Mahamaya layers',
      icon: '✨',
      status: 'pending'
    }
  ];

  // Load user data on component mount
  useEffect(() => {
    if (userState.userData?.profileData?.birthdate) {
      setBirthdate(userState.userData.profileData.birthdate);
    }
    // Also check if there's existing Mahamaya Matrix birthdate data
    if (userState.userData?.mahamayaMatrix?.birthdateEncoding) {
      // If we have encrypted data, we'd need to decrypt it, but for now just check if it exists
      console.log('Existing Mahamaya birthdate data found:', userState.userData.mahamayaMatrix.birthdateEncoding);
    }
  }, [userState.userData]);

  // Save birthdate encoding data
  const saveBirthdateEncoding = async () => {
    if (!birthdate) {
      setMessage('Please enter a birthdate');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.post(
        `${backendUrl}/api/mahamaya/birthdate-encoding`,
        {
          birthDate: birthdate,
          birthTime: birthTime || '12:00:00',
          birthLocation: {
            city: birthLocation || 'Unknown',
            country: 'Unknown',
            latitude: 0,
            longitude: 0
          },
          numerologicalProfile: {
            lifePathNumber: 0, // Will be calculated later
            destinyNumber: 0
          },
          encodingMetadata: {
            calculationMethod: 'basic',
            version: '1.0'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setMessage('Birthdate encoding saved successfully!');
      } else {
        setMessage('Failed to save birthdate encoding');
      }
    } catch (error) {
      console.error('Error saving birthdate encoding:', error);
      setMessage('Error saving birthdate encoding');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLayerContent = (layerId: string) => {
    const layer = mahamayaLayers.find(l => l.id === layerId);
    if (!layer) return null;

    // Birthdate Encoding Interface
    if (layerId === 'birthdate-encoding') {
      return (
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{layer.icon}</div>
            <h3 className="text-2xl font-semibold text-epii-neon mb-4">{layer.title}</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">{layer.description}</p>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Birth Date *
                </label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full p-3 bg-epii-darker border border-epii-neon/20 rounded-md text-white focus:border-epii-neon/60 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Birth Time (optional)
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full p-3 bg-epii-darker border border-epii-neon/20 rounded-md text-white focus:border-epii-neon/60 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Birth Location (optional)
                </label>
                <input
                  type="text"
                  value={birthLocation}
                  onChange={(e) => setBirthLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full p-3 bg-epii-darker border border-epii-neon/20 rounded-md text-white focus:border-epii-neon/60 focus:outline-none"
                />
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.includes('success')
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {message}
              </div>
            )}

            <Button
              onClick={saveBirthdateEncoding}
              disabled={isLoading || !birthdate}
              className="w-full bg-epii-neon text-epii-darker hover:brightness-110 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-epii-darker border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Birthdate Encoding
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    // Archetypal Quintessence Interface
    if (layerId === 'archetypal-quintessence') {
      return (
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{layer.icon}</div>
            <h3 className="text-2xl font-semibold text-epii-neon mb-4">{layer.title}</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">{layer.description}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <h4 className="text-lg font-semibold text-epii-neon mb-6 text-center">
              6-Layer Identity Structure Foundation
            </h4>

            {/* Display existing 6-layer identity structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {userState.userData?.identityStructure && Object.entries(userState.userData.identityStructure).map(([key, value]) => (
                <div key={key} className="p-4 bg-epii-darker/30 rounded-lg border border-epii-neon/20">
                  <h5 className="text-sm font-semibold text-epii-neon mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h5>
                  <div className="text-xs text-gray-400">
                    {typeof value === 'object' && value !== null ? (
                      Object.entries(value).map(([subKey, subValue]) => (
                        <div key={subKey} className="mb-1">
                          <span className="text-gray-300">{subKey}:</span>{' '}
                          {Array.isArray(subValue) ? subValue.join(', ') : String(subValue)}
                        </div>
                      ))
                    ) : (
                      <span>{String(value)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="p-6 bg-epii-darker/30 rounded-lg border border-epii-neon/20 mb-6">
                <h5 className="text-lg font-semibold text-epii-neon mb-3">Synthesis Status</h5>
                <p className="text-gray-300 text-sm mb-4">
                  Complete the other 5 Mahamaya Ground layers to generate your Archetypal Quintessence synthesis.
                </p>
                <div className="text-xs text-gray-400">
                  <p>• Birthdate Encoding: Pending</p>
                  <p>• Astrological Chart: Pending</p>
                  <p>• Jungian Assessment: Pending</p>
                  <p>• Gene Keys Profile: Pending</p>
                  <p>• Human Design Profile: Pending</p>
                </div>
              </div>

              <Button
                disabled
                className="bg-gray-600 text-gray-400 cursor-not-allowed"
              >
                Generate Archetypal Quintessence
                <span className="text-xs ml-2">(Complete other layers first)</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Default placeholder for other layers
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">{layer.icon}</div>
        <h3 className="text-2xl font-semibold text-epii-neon mb-4">{layer.title}</h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">{layer.description}</p>

        <div className="max-w-md mx-auto space-y-4">
          <div className="p-4 bg-epii-darker/30 rounded-lg border border-epii-neon/20">
            <p className="text-sm text-gray-400 mb-2">Assessment Interface</p>
            <p className="text-xs text-gray-500">
              Specific {layer.title.toLowerCase()} assessment tools and data input forms will be implemented here.
            </p>
          </div>
          <Button className="w-full bg-epii-neon text-epii-darker hover:brightness-110">
            Begin {layer.title} Assessment
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-6">
      <GeometricBackground density={8} opacity={0.02} />
      <div className="container mx-auto px-4">
        <div className="flex flex-col bg-epii-dark/40 neo-glow rounded-lg overflow-hidden">
          {/* Header with back button */}
          <div className="p-4 border-b border-epii-neon/20 bg-epii-darker/30">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-epii-neon/30 text-epii-neon hover:bg-epii-neon/10"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Nara Mode
              </Button>
              <div className="flex items-center gap-2">
                <User size={24} className="text-epii-neon" />
                <h1 className="text-2xl font-light text-epii-neon">Identity Dynamics</h1>
              </div>
            </div>
            <p className="text-gray-300 mt-2">6 Mahamaya Ground Layers - Archetypal Foundation</p>
          </div>

          {/* Layer Navigation */}
          <div className="p-4 border-b border-epii-neon/20 bg-epii-darker/20">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveLayer('overview')}
                className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                  activeLayer === 'overview'
                    ? 'bg-epii-neon text-epii-darker'
                    : 'bg-epii-darker/50 text-gray-300 hover:bg-epii-darker hover:text-epii-neon'
                }`}
              >
                Overview
              </button>
              {mahamayaLayers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`px-4 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2 ${
                    activeLayer === layer.id
                      ? 'bg-epii-neon text-epii-darker'
                      : 'bg-epii-darker/50 text-gray-300 hover:bg-epii-darker hover:text-epii-neon'
                  }`}
                >
                  <span>{layer.icon}</span>
                  <span>{layer.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="p-8">
            {activeLayer === 'overview' ? (
              <div className="text-center">
                <User size={64} className="text-epii-neon mb-6 mx-auto" />
                <h2 className="text-3xl font-semibold text-epii-neon mb-4">Identity Dynamics Overview</h2>
                <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
                  Explore your archetypal foundation through the six Mahamaya Ground layers.
                  Each layer provides unique insights into your psychological and spiritual blueprint,
                  culminating in your personalized Archetypal Quintessence.
                </p>

                {/* 6 Layer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {mahamayaLayers.map((layer) => (
                    <div
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className="group cursor-pointer p-6 bg-epii-darker/50 rounded-lg border border-epii-neon/20 hover:border-epii-neon/60 transition-all duration-300 hover:bg-epii-darker/70"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{layer.icon}</div>
                        <h3 className="text-lg font-semibold text-epii-neon mb-2">{layer.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">{layer.description}</p>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs ${
                          layer.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {layer.status === 'completed' ? 'Completed' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              renderLayerContent(activeLayer)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OraclePage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen pt-20 pb-6">
    <GeometricBackground density={8} opacity={0.02} />
    <div className="container mx-auto px-4 h-[calc(100vh-8rem)]">
      <div className="flex flex-col h-full bg-epii-dark/40 neo-glow rounded-lg overflow-hidden">
        {/* Header with back button */}
        <div className="p-4 border-b border-epii-neon/20 bg-epii-darker/30">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="border-epii-neon/30 text-epii-neon hover:bg-epii-neon/10"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Nara Mode
            </Button>
            <div className="flex items-center gap-2">
              <Eye size={24} className="text-epii-neon" />
              <h1 className="text-2xl font-light text-epii-neon">Oracle Interface</h1>
            </div>
          </div>
          <p className="text-gray-300 mt-2">Decanic Embodiment & Oracle Enhancement</p>
        </div>

        {/* Content area */}
        <div className="flex-grow p-8 flex flex-col items-center justify-center text-center">
          <Eye size={64} className="text-epii-neon mb-6" />
          <h2 className="text-3xl font-semibold text-epii-neon mb-4">Oracle Interface</h2>
          <p className="text-gray-300 mb-8 max-w-2xl">
            Engage with synchronicity and intuitive wisdom through dynamic tarot spreads,
            real-time astrological integration, and personalized oracle guidance.
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-4xl">
            <div className="p-6 bg-epii-darker/50 rounded-lg border border-epii-neon/20">
              <h3 className="text-lg font-semibold text-epii-neon mb-3">Dynamic Oracle</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Dynamic Tarot Card Rendering</p>
                <p>• Archetypal Concrescence Spreads</p>
                <p>• Symbolic Synthesis Engine</p>
              </div>
            </div>
            <div className="p-6 bg-epii-darker/50 rounded-lg border border-epii-neon/20">
              <h3 className="text-lg font-semibold text-epii-neon mb-3">Astrological Integration</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Real-time Astrological Data</p>
                <p>• Natal Chart Cross-referencing</p>
                <p>• Bodily Resonance Mapping</p>
              </div>
            </div>
          </div>
          <Button className="mt-8 bg-epii-neon text-epii-darker hover:brightness-110 px-8 py-3">
            Draw Oracle Cards
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const JournalPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen pt-20 pb-6">
    <GeometricBackground density={8} opacity={0.02} />
    <div className="container mx-auto px-4 h-[calc(100vh-8rem)]">
      <div className="flex flex-col h-full bg-epii-dark/40 neo-glow rounded-lg overflow-hidden">
        {/* Header with back button */}
        <div className="p-4 border-b border-epii-neon/20 bg-epii-darker/30">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="border-epii-neon/30 text-epii-neon hover:bg-epii-neon/10"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Nara Mode
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen size={24} className="text-epii-neon" />
              <h1 className="text-2xl font-light text-epii-neon">Journal Interface</h1>
            </div>
          </div>
          <p className="text-gray-300 mt-2">Alchemical Crucible & Journal Synthesis</p>
        </div>

        {/* Content area */}
        <div className="flex-grow p-8 flex flex-col items-center justify-center text-center">
          <BookOpen size={64} className="text-epii-neon mb-6" />
          <h2 className="text-3xl font-semibold text-epii-neon mb-4">Journal Interface</h2>
          <p className="text-gray-300 mb-8 max-w-2xl">
            Transform personal experiences into wisdom through alchemical journal synthesis,
            symbolic pattern recognition, and dynamic phase detection.
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-4xl">
            <div className="p-6 bg-epii-darker/50 rounded-lg border border-epii-neon/20">
              <h3 className="text-lg font-semibold text-epii-neon mb-3">Symbolic Analysis</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• NLP Symbolic Pattern Recognition</p>
                <p>• Journal Imagery Analysis</p>
                <p>• Dynamic Symbolic Metabolism</p>
              </div>
            </div>
            <div className="p-6 bg-epii-darker/50 rounded-lg border border-epii-neon/20">
              <h3 className="text-lg font-semibold text-epii-neon mb-3">Alchemical Process</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Alchemical Phase Detection</p>
                <p>• External Knowledge Integration</p>
                <p>• Transformative Insights</p>
              </div>
            </div>
          </div>
          <Button className="mt-8 bg-epii-neon text-epii-darker hover:brightness-110 px-8 py-3">
            Open Journal
          </Button>
        </div>
      </div>
    </div>
  </div>
);

type NaraSection = 'home' | 'identity' | 'oracle' | 'journal';

const NaraModeContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NaraSection>('home');

  // Concrescence flow guidance (placeholder logic)
  const getNextSuggestedSection = (): NaraSection => {
    // This will be replaced with actual Nara agent guidance via AG-UI protocol
    switch (activeSection) {
      case 'home':
        return 'identity';
      case 'identity':
        return 'oracle';
      case 'oracle':
        return 'journal';
      case 'journal':
        return 'identity';
      default:
        return 'identity';
    }
  };

  const nextSuggested = getNextSuggestedSection();

  // Handle navigation back to home
  const handleBackToHome = () => {
    setActiveSection('home');
  };

  // Render the appropriate section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'identity':
        return <IdentityDynamicsPage onBack={handleBackToHome} />;
      case 'oracle':
        return <OraclePage onBack={handleBackToHome} />;
      case 'journal':
        return <JournalPage onBack={handleBackToHome} />;
      default:
        return renderHomePage();
    }
  };

  const getSectionIcon = (section: NaraSection) => {
    switch (section) {
      case 'identity':
        return <User size={20} />;
      case 'oracle':
        return <Eye size={20} />;
      case 'journal':
        return <BookOpen size={20} />;
      default:
        return <Sparkles size={20} />;
    }
  };

  const getSectionTitle = (section: NaraSection) => {
    switch (section) {
      case 'identity':
        return 'Identity Dynamics';
      case 'oracle':
        return 'Oracle';
      case 'journal':
        return 'Journal';
      default:
        return 'Nara Mode';
    }
  };

  // Home page component
  const renderHomePage = () => (
    <div className="min-h-screen pt-20 pb-6">
      <GeometricBackground density={8} opacity={0.02} />
      <div className="container mx-auto px-4">
        <div className="flex flex-col bg-epii-dark/40 neo-glow rounded-lg overflow-hidden">

          {/* Header */}
          <div className="p-6 border-b border-epii-neon/20 bg-epii-darker/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles size={32} className="text-epii-neon" />
                <div>
                  <h1 className="text-3xl font-light text-epii-neon">Nara Mode</h1>
                  <p className="text-gray-300">Living Mandala Interface for Self-Discovery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-semibold text-epii-neon mb-4">
                Begin Your Journey of Individuation
              </h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                Explore the triadic flow of consciousness through Identity Dynamics, Oracle wisdom,
                and Journal synthesis. Each section offers a unique pathway to self-discovery and
                archetypal understanding.
              </p>
            </div>

            {/* Section Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">

              {/* Identity Dynamics Card */}
              <div
                onClick={() => setActiveSection('identity')}
                className="group cursor-pointer p-8 bg-epii-darker/50 rounded-lg border border-epii-neon/20 hover:border-epii-neon/60 transition-all duration-300 hover:bg-epii-darker/70"
              >
                <div className="text-center">
                  <User size={64} className="text-epii-neon mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-semibold text-epii-neon mb-3">Identity Dynamics</h3>
                  <p className="text-gray-300 mb-4">
                    Explore your archetypal foundation through the Mahamaya Ground layers
                  </p>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>• 6 Mahamaya Ground Layers</p>
                    <p>• Birthdate & Astrological Analysis</p>
                    <p>• Jungian, Gene Keys & Human Design</p>
                    <p>• Archetypal Quintessence Synthesis</p>
                  </div>
                  <Button className="mt-6 w-full bg-epii-neon/10 text-epii-neon border border-epii-neon/30 hover:bg-epii-neon hover:text-epii-darker">
                    Enter Identity Space
                  </Button>
                </div>
              </div>

              {/* Oracle Card */}
              <div
                onClick={() => setActiveSection('oracle')}
                className="group cursor-pointer p-8 bg-epii-darker/50 rounded-lg border border-epii-neon/20 hover:border-epii-neon/60 transition-all duration-300 hover:bg-epii-darker/70"
              >
                <div className="text-center">
                  <Eye size={64} className="text-epii-neon mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-semibold text-epii-neon mb-3">Oracle Interface</h3>
                  <p className="text-gray-300 mb-4">
                    Engage with synchronicity through dynamic tarot and astrological guidance
                  </p>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>• Dynamic Tarot Spreads</p>
                    <p>• Real-time Astrological Data</p>
                    <p>• Decanic Embodiment</p>
                  </div>
                  <Button className="mt-6 w-full bg-epii-neon/10 text-epii-neon border border-epii-neon/30 hover:bg-epii-neon hover:text-epii-darker">
                    Consult Oracle
                  </Button>
                </div>
              </div>

              {/* Journal Card */}
              <div
                onClick={() => setActiveSection('journal')}
                className="group cursor-pointer p-8 bg-epii-darker/50 rounded-lg border border-epii-neon/20 hover:border-epii-neon/60 transition-all duration-300 hover:bg-epii-darker/70"
              >
                <div className="text-center">
                  <BookOpen size={64} className="text-epii-neon mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-semibold text-epii-neon mb-3">Journal Interface</h3>
                  <p className="text-gray-300 mb-4">
                    Transform experiences into wisdom through alchemical synthesis
                  </p>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>• Symbolic Pattern Recognition</p>
                    <p>• Alchemical Phase Detection</p>
                    <p>• Transformative Insights</p>
                  </div>
                  <Button className="mt-6 w-full bg-epii-neon/10 text-epii-neon border border-epii-neon/30 hover:bg-epii-neon hover:text-epii-darker">
                    Open Journal
                  </Button>
                </div>
              </div>
            </div>

            {/* Concrescence Flow Guidance */}
            <div className="mt-12 p-6 bg-epii-darker/30 rounded-lg border border-epii-neon/20 max-w-2xl">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-epii-neon mb-2">Concrescence Flow</h4>
                <p className="text-gray-300 text-sm">
                  Follow the natural rhythm of becoming: Identity → Oracle → Journal → Integration
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Suggested starting point: <span className="text-epii-neon">Identity Dynamics</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Return the active section
  return renderActiveSection();
};

const NaraModePage: React.FC = () => {
  return <NaraModeContent />;
};

export default NaraModePage;
