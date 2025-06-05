/**
 * DecanDisplay Component - Epic 2, Story E2_F1_S1
 * 
 * Displays Hermetic decanic associations for drawn Tarot cards,
 * revealing specific archetypal energies and fostering deeper self-understanding.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Info, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Star,
  Moon,
  Sun
} from 'lucide-react';
import { DecanicDisplayProps, DecanicAssociation } from '../../types/decanic.types';
import { useDecanicStore } from '../../stores/decanicStore';
import DecanModal from './DecanModal';

const DecanDisplay: React.FC<DecanicDisplayProps> = ({
  cardName,
  reversed = false,
  showDetails = false,
  onDetailsToggle,
  className = ''
}) => {
  const [decanicData, setDecanicData] = useState<DecanicAssociation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getDecanicAssociation } = useDecanicStore();

  // Fetch decanic data when card changes
  useEffect(() => {
    const fetchDecanicData = async () => {
      if (!cardName) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getDecanicAssociation(cardName, reversed);
        setDecanicData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load decanic data');
      } finally {
        setLoading(false);
      }
    };

    fetchDecanicData();
  }, [cardName, reversed, getDecanicAssociation]);

  // Handle expansion toggle
  const handleToggleExpansion = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onDetailsToggle?.(newExpanded);
  };

  // Handle modal open
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Get appropriate icon based on card orientation and planetary ruler
  const getDecanIcon = () => {
    if (!decanicData) return <Sparkles size={16} />;
    
    const ruler = decanicData.traditionalRuler;
    const iconMap: Record<string, React.ReactNode> = {
      'Sun': <Sun size={16} className="text-yellow-400" />,
      'Moon': <Moon size={16} className="text-blue-300" />,
      'Mars': <Star size={16} className="text-red-400" />,
      'Venus': <Star size={16} className="text-green-400" />,
      'Mercury': <Star size={16} className="text-purple-400" />,
      'Jupiter': <Star size={16} className="text-orange-400" />,
      'Saturn': <Star size={16} className="text-gray-400" />
    };

    return iconMap[ruler] || <Sparkles size={16} className="text-epii-neon" />;
  };

  // Loading state
  if (loading) {
    return (
      <div className={`decanic-display loading ${className}`}>
        <div className="flex items-center gap-2 p-3 bg-epii-darker/30 rounded-lg border border-epii-neon/20">
          <div className="animate-spin">
            <Sparkles size={16} className="text-epii-neon" />
          </div>
          <span className="text-sm text-gray-400">Loading decanic association...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`decanic-display error ${className}`}>
        <div className="flex items-center gap-2 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
          <Info size={16} className="text-red-400" />
          <span className="text-sm text-red-300">Failed to load decanic data</span>
        </div>
      </div>
    );
  }

  // No data state
  if (!decanicData) {
    return (
      <div className={`decanic-display no-data ${className}`}>
        <div className="flex items-center gap-2 p-3 bg-epii-darker/20 rounded-lg border border-gray-600/30">
          <Eye size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">No decanic association found</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`decanic-display ${className}`}>
      {/* Compact Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-epii-darker/40 rounded-lg border border-epii-neon/20 overflow-hidden"
      >
        {/* Header with basic decanic info */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {getDecanIcon()}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-epii-neon">
                {decanicData.decanAssociation}
              </span>
              <span className="text-xs text-gray-400">
                {decanicData.cardOrientation === 'reversed' ? 'Shadow Aspect' : 'Light Aspect'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Quick info button */}
            <button
              onClick={handleOpenModal}
              className="p-1 rounded hover:bg-epii-neon/10 transition-colors"
              title="View detailed decanic information"
            >
              <Info size={14} className="text-epii-neon/70 hover:text-epii-neon" />
            </button>
            
            {/* Expand/collapse button */}
            <button
              onClick={handleToggleExpansion}
              className="p-1 rounded hover:bg-epii-neon/10 transition-colors"
              title={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              {isExpanded ? (
                <ChevronUp size={14} className="text-epii-neon/70 hover:text-epii-neon" />
              ) : (
                <ChevronDown size={14} className="text-epii-neon/70 hover:text-epii-neon" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-epii-neon/20"
            >
              <div className="p-4 space-y-3">
                {/* Archetype Description */}
                <div>
                  <h4 className="text-sm font-medium text-epii-neon mb-1">
                    Archetypal Essence
                  </h4>
                  <p className="text-sm text-gray-300">
                    {decanicData.archetypeDescription}
                  </p>
                </div>

                {/* Active Aspect */}
                {decanicData.activeAspect && (
                  <div>
                    <h4 className="text-sm font-medium text-epii-neon mb-1">
                      {decanicData.activeAspect.theme}
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">
                      {decanicData.activeAspect.description}
                    </p>
                    <p className="text-xs text-epii-neon/80 italic">
                      {decanicData.activeAspect.guidance}
                    </p>
                  </div>
                )}

                {/* Keywords */}
                <div>
                  <h4 className="text-sm font-medium text-epii-neon mb-2">
                    Archetypal Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {decanicData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-epii-neon/10 text-epii-neon rounded-full border border-epii-neon/20"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Body Part Association */}
                <div>
                  <h4 className="text-sm font-medium text-epii-neon mb-1">
                    Somatic Resonance
                  </h4>
                  <p className="text-sm text-gray-300">
                    <span className="text-epii-neon">{decanicData.bodyPart}</span>
                    {' - Notice any sensations in this area as you reflect'}
                  </p>
                </div>

                {/* Reflective Prompt */}
                <div className="bg-epii-darker/50 rounded-lg p-3 border border-epii-neon/10">
                  <h4 className="text-sm font-medium text-epii-neon mb-2">
                    Reflective Inquiry
                  </h4>
                  <p className="text-sm text-gray-300 italic">
                    {decanicData.reflectivePrompt}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Detailed Modal */}
      <DecanModal
        decanicData={decanicData}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DecanDisplay;
