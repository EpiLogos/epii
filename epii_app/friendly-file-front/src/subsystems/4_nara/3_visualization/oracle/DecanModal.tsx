/**
 * DecanModal Component - Epic 2, Story E2_F1_S1
 * 
 * Detailed modal view for exploring Hermetic decanic associations,
 * providing deep archetypal context and somatic integration guidance.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Eye, 
  Heart, 
  Brain,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { DecanicModalProps } from '../../subsystems/4_nara/0_foundation/decanic.types';

const DecanModal: React.FC<DecanicModalProps> = ({
  decanicData,
  isOpen,
  onClose
}) => {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Get planetary ruler icon
  const getPlanetaryIcon = (ruler: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Sun': <Sun size={24} className="text-yellow-400" />,
      'Moon': <Moon size={24} className="text-blue-300" />,
      'Mars': <Star size={24} className="text-red-400" />,
      'Venus': <Heart size={24} className="text-green-400" />,
      'Mercury': <Brain size={24} className="text-purple-400" />,
      'Jupiter': <Sparkles size={24} className="text-orange-400" />,
      'Saturn': <Star size={24} className="text-gray-400" />
    };

    return iconMap[ruler] || <Star size={24} className="text-epii-neon" />;
  };

  // Get zodiac sign color
  const getZodiacColor = (sign: string) => {
    const colorMap: Record<string, string> = {
      'Aries': 'text-red-400',
      'Taurus': 'text-green-400',
      'Gemini': 'text-yellow-400',
      'Cancer': 'text-blue-400',
      'Leo': 'text-orange-400',
      'Virgo': 'text-green-300',
      'Libra': 'text-pink-400',
      'Scorpio': 'text-red-600',
      'Sagittarius': 'text-purple-400',
      'Capricorn': 'text-gray-400',
      'Aquarius': 'text-cyan-400',
      'Pisces': 'text-blue-300'
    };

    return colorMap[sign] || 'text-epii-neon';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-epii-darker border border-epii-neon/30 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-epii-darker/95 backdrop-blur-sm border-b border-epii-neon/20 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getPlanetaryIcon(decanicData.traditionalRuler)}
                  <div>
                    <h2 className="text-xl font-bold text-epii-neon">
                      {decanicData.cardName}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {decanicData.decanAssociation} • {decanicData.degrees}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-epii-neon/10 transition-colors"
                >
                  <X size={20} className="text-gray-400 hover:text-epii-neon" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Archetypal Overview */}
              <section>
                <h3 className="text-lg font-semibold text-epii-neon mb-3 flex items-center gap-2">
                  <Eye size={18} />
                  Archetypal Essence
                </h3>
                <div className="bg-epii-darker/50 rounded-lg p-4 border border-epii-neon/10">
                  <p className="text-gray-300 leading-relaxed">
                    {decanicData.archetypeDescription}
                  </p>
                </div>
              </section>

              {/* Light and Shadow Aspects */}
              <section>
                <h3 className="text-lg font-semibold text-epii-neon mb-3">
                  Dual Aspects
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Light Aspect */}
                  <div className="bg-gradient-to-br from-yellow-900/20 to-epii-darker/50 rounded-lg p-4 border border-yellow-500/20">
                    <h4 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                      <Sun size={16} />
                      {decanicData.lightAspect.theme}
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">
                      {decanicData.lightAspect.description}
                    </p>
                    <p className="text-xs text-yellow-300 italic">
                      {decanicData.lightAspect.guidance}
                    </p>
                  </div>

                  {/* Shadow Aspect */}
                  <div className="bg-gradient-to-br from-purple-900/20 to-epii-darker/50 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
                      <Moon size={16} />
                      {decanicData.shadowAspect.theme}
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">
                      {decanicData.shadowAspect.description}
                    </p>
                    <p className="text-xs text-purple-300 italic">
                      {decanicData.shadowAspect.guidance}
                    </p>
                  </div>
                </div>
              </section>

              {/* Astrological Details */}
              <section>
                <h3 className="text-lg font-semibold text-epii-neon mb-3">
                  Astrological Context
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-epii-darker/50 rounded-lg p-4 border border-epii-neon/10">
                    <h4 className="font-medium text-epii-neon mb-2">Zodiac Sign</h4>
                    <p className={`text-lg font-bold ${getZodiacColor(decanicData.zodiacSign)}`}>
                      {decanicData.zodiacSign}
                    </p>
                  </div>
                  
                  <div className="bg-epii-darker/50 rounded-lg p-4 border border-epii-neon/10">
                    <h4 className="font-medium text-epii-neon mb-2">Planetary Ruler</h4>
                    <div className="flex items-center gap-2">
                      {getPlanetaryIcon(decanicData.traditionalRuler)}
                      <span className="text-lg font-bold text-gray-300">
                        {decanicData.traditionalRuler}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-epii-darker/50 rounded-lg p-4 border border-epii-neon/10">
                    <h4 className="font-medium text-epii-neon mb-2">Degrees</h4>
                    <p className="text-lg font-bold text-gray-300">
                      {decanicData.degrees}
                    </p>
                  </div>
                </div>
              </section>

              {/* Somatic Integration */}
              <section>
                <h3 className="text-lg font-semibold text-epii-neon mb-3 flex items-center gap-2">
                  <Heart size={18} />
                  Somatic Integration
                </h3>
                <div className="bg-gradient-to-br from-green-900/20 to-epii-darker/50 rounded-lg p-4 border border-green-500/20">
                  <h4 className="font-medium text-green-400 mb-2">Body Part Association</h4>
                  <p className="text-gray-300 mb-3">
                    <span className="text-green-300 font-medium">{decanicData.bodyPart}</span>
                    {' - This area of the body resonates with the archetypal energy of this decan.'}
                  </p>
                  <div className="bg-epii-darker/50 rounded-lg p-3 border border-green-500/10">
                    <p className="text-sm text-green-200 italic">
                      Take a moment to breathe into your {decanicData.bodyPart.toLowerCase()} 
                      and notice any sensations, tensions, or energy present there.
                    </p>
                  </div>
                </div>
              </section>

              {/* Keywords */}
              <section>
                <h3 className="text-lg font-semibold text-epii-neon mb-3">
                  Archetypal Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {decanicData.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-epii-neon/10 text-epii-neon rounded-full border border-epii-neon/20 hover:bg-epii-neon/20 transition-colors"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>

              {/* Hermetic Wisdom */}
              {decanicData.egyptianDeity && (
                <section>
                  <h3 className="text-lg font-semibold text-epii-neon mb-3">
                    Hermetic Wisdom
                  </h3>
                  <div className="bg-gradient-to-br from-amber-900/20 to-epii-darker/50 rounded-lg p-4 border border-amber-500/20">
                    <h4 className="font-medium text-amber-400 mb-2">Egyptian Deity</h4>
                    <p className="text-amber-200 mb-3">{decanicData.egyptianDeity}</p>
                    
                    {decanicData.iconography && (
                      <>
                        <h4 className="font-medium text-amber-400 mb-2">Iconography</h4>
                        <p className="text-sm text-amber-100">{decanicData.iconography}</p>
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* Reflective Inquiry */}
              <section>
                <h3 className="text-lg font-semibold text-epii-neon mb-3 flex items-center gap-2">
                  <Brain size={18} />
                  Reflective Inquiry
                </h3>
                <div className="bg-gradient-to-br from-blue-900/20 to-epii-darker/50 rounded-lg p-4 border border-blue-500/20">
                  <p className="text-blue-200 italic leading-relaxed">
                    {decanicData.reflectivePrompt}
                  </p>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-epii-darker/95 backdrop-blur-sm border-t border-epii-neon/20 p-4">
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-epii-neon/10 text-epii-neon rounded-lg border border-epii-neon/30 hover:bg-epii-neon/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DecanModal;
