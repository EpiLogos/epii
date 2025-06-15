/**
 * TarotDraw Component - Epic 2, Story E2_F1_S1
 *
 * 6-card QL aligned Oracle interface with manual card input and decanic associations.
 * Allows users to input their own cards or use random generation as secondary option.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  RotateCcw,
  Eye,
  Sparkles,
  ArrowLeft,
  Edit3,
  Shuffle
} from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import { TarotCard, OracleReading } from '../../0_foundation/decanic.types';
import DecanDisplay from './DecanDisplay';
import AstrologicalContextDisplay from './AstrologicalContextDisplay';
import decanicService from '../../1_services/decanic.service';

interface TarotDrawProps {
  onBack: () => void;
}

// QL Coordinate positions for 6-card spread (from Quaternal Logic file)
const QL_POSITIONS = [
  {
    id: 0,
    name: 'Implicit Field',
    coordinate: '#0',
    description: 'Implicit Theme or Field of Potential - The hidden foundation from which all dynamics arise'
  },
  {
    id: 1,
    name: 'Material Cause',
    coordinate: '#1',
    description: 'What - The material cause, definitional ground that establishes content'
  },
  {
    id: 2,
    name: 'Efficient Cause',
    coordinate: '#2',
    description: 'How - The efficient cause, processual dimension that activates transformation'
  },
  {
    id: 3,
    name: 'Formal Mediation',
    coordinate: '#3',
    description: 'Which/Who - The formal cause that mediates between dual elements'
  },
  {
    id: 4,
    name: 'Contextual Arena',
    coordinate: '#4',
    description: 'When/Where - The contextual framework that situates all dynamics'
  },
  {
    id: 5,
    name: 'Quintessence',
    coordinate: '#5',
    description: 'Why - The integral synthesis that loops back to position #0'
  }
];

const TarotDraw: React.FC<TarotDrawProps> = ({ onBack }) => {
  const [cards, setCards] = useState<(TarotCard | null)[]>(Array(6).fill(null));
  const [inputMode, setInputMode] = useState<'manual' | 'random'>('manual');
  const [editingPosition, setEditingPosition] = useState<number | null>(null);
  const [cardInput, setCardInput] = useState('');
  const [showDecanicDetails, setShowDecanicDetails] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [availableCards, setAvailableCards] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load available cards on component mount
  useEffect(() => {
    let isMounted = true;

    const loadAvailableCards = async () => {
      try {
        const cards = await decanicService.getAvailableCards();
        if (isMounted) {
          setAvailableCards(cards);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to load available cards:', error);
        }
      }
    };

    loadAvailableCards();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run on mount

  // Generate smart suggestions based on input
  const generateSuggestions = (input: string): string[] => {
    const trimmedInput = input.trim().toLowerCase();

    if (!trimmedInput) return [];

    // Filter available cards based on input
    const filtered = availableCards.filter(card =>
      card.toLowerCase().includes(trimmedInput)
    );

    // Smart suggestions for partial input
    const suggestions: string[] = [];

    // For numbers (minor arcana)
    if (/^\d+$/.test(trimmedInput)) {
      const number = trimmedInput;
      const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'];
      suits.forEach(suit => {
        const cardName = `${number} of ${suit}`;
        if (availableCards.some(card => card.toLowerCase() === cardName.toLowerCase())) {
          suggestions.push(cardName);
        }
      });
    }

    // For "the" (major arcana)
    else if (trimmedInput === 'the') {
      const majorArcana = availableCards.filter(card =>
        card.toLowerCase().startsWith('the ')
      );
      suggestions.push(...majorArcana.slice(0, 10)); // Limit to 10
    }

    // For partial "the X" input
    else if (trimmedInput.startsWith('the ')) {
      const partial = trimmedInput.substring(4); // Remove "the "
      const majorArcana = availableCards.filter(card =>
        card.toLowerCase().startsWith('the ') &&
        card.toLowerCase().substring(4).includes(partial)
      );
      suggestions.push(...majorArcana);
    }

    // For "N of" input
    else if (/^\d+\s+of$/i.test(trimmedInput)) {
      const number = trimmedInput.split(' ')[0];
      const suits = ['Wands', 'Cups', 'Swords', 'Pentacles'];
      suits.forEach(suit => {
        const cardName = `${number} of ${suit}`;
        if (availableCards.some(card => card.toLowerCase() === cardName.toLowerCase())) {
          suggestions.push(cardName);
        }
      });
    }

    // For "N of S" partial input
    else if (/^\d+\s+of\s+\w/i.test(trimmedInput)) {
      suggestions.push(...filtered);
    }

    // General filtering
    else {
      suggestions.push(...filtered.slice(0, 10)); // Limit to 10
    }

    return [...new Set(suggestions)]; // Remove duplicates
  };

  // Handle input change with smart suggestions
  const handleInputChange = (value: string) => {
    setCardInput(value);
    const newSuggestions = generateSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0 && value.trim().length > 0);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setCardInput(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Handle manual card input
  const handleCardInput = (position: number, cardName: string, reversed: boolean = false) => {
    const newCards = [...cards];
    newCards[position] = {
      name: cardName,
      reversed,
      arcana: cardName.includes('of') ? 'minor' : 'major',
      suit: cardName.includes('of') ? cardName.split(' of ')[1] as any : undefined
    };
    setCards(newCards);
    setEditingPosition(null);
    setCardInput('');
  };

  // Generate random 6-card spread (no duplicates)
  const generateRandomSpread = async () => {
    try {
      // Get all available cards from the decanic service
      const availableCards = await decanicService.getAvailableCards();

      if (availableCards.length < 6) {
        console.error('Not enough cards available for 6-card spread');
        return;
      }

      // Shuffle and select 6 unique cards
      const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
      const selectedCards = shuffled.slice(0, 6);

      const newCards = selectedCards.map(cardName => ({
        name: cardName,
        reversed: Math.random() < 0.3,
        arcana: cardName.includes('of') ? 'minor' : 'major',
        suit: cardName.includes('of') ? cardName.split(' of ')[1] as any : undefined
      }));

      setCards(newCards);
    } catch (error) {
      console.error('Failed to generate random spread:', error);
      // Fallback to hardcoded list if service fails
      const fallbackCards = [
        'The Fool', 'The Magician', '2 of Wands', '5 of Cups', '7 of Swords', '10 of Pentacles'
      ];

      const newCards = fallbackCards.map(cardName => ({
        name: cardName,
        reversed: Math.random() < 0.3,
        arcana: cardName.includes('of') ? 'minor' : 'major',
        suit: cardName.includes('of') ? cardName.split(' of ')[1] as any : undefined
      }));

      setCards(newCards);
    }
  };

  // Clear all cards
  const clearCards = () => {
    setCards(Array(6).fill(null));
    setEditingPosition(null);
  };

  return (
    <div className="min-h-screen pt-20 pb-6">
      <div className="container mx-auto px-4 h-[calc(100vh-8rem)]">
        <div className="flex flex-col h-full bg-epii-dark/40 neo-glow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-epii-neon/20 bg-epii-darker/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={onBack}
                  variant="outline"
                  size="sm"
                  className="border-epii-neon/30 text-epii-neon hover:bg-epii-neon/10"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Oracle
                </Button>
                <div className="flex items-center gap-2">
                  <Eye size={24} className="text-epii-neon" />
                  <h1 className="text-xl font-semibold text-epii-neon">6-Card QL Oracle</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setInputMode(inputMode === 'manual' ? 'random' : 'manual')}
                  variant="outline"
                  size="sm"
                  className="border-epii-neon/30 text-epii-neon hover:bg-epii-neon/10"
                >
                  <Edit3 size={16} className="mr-2" />
                  {inputMode === 'manual' ? 'Manual Input' : 'Random Mode'}
                </Button>
                <Button
                  onClick={generateRandomSpread}
                  variant="outline"
                  size="sm"
                  className="border-epii-neon/30 text-epii-neon hover:bg-epii-neon/10"
                >
                  <Shuffle size={16} className="mr-2" />
                  Random
                </Button>
                <Button
                  onClick={clearCards}
                  variant="outline"
                  size="sm"
                  className="border-epii-neon/30 text-epii-neon hover:bg-epii-neon/10"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {/* Instructions */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-epii-neon mb-2">
                  Quaternal Logic Oracle Spread
                </h2>
                <p className="text-gray-300 mb-4">
                  {inputMode === 'manual'
                    ? 'Click each position to enter the cards you\'ve drawn from your personal deck'
                    : 'Use random generation or manually input your cards'
                  }
                </p>
              </div>

              {/* Astrological Context - Temporarily disabled to fix infinite loop */}
              <div className="mb-8">
                <div className="bg-epii-darker/30 border border-epii-neon/20 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center gap-2 text-epii-neon">
                    <Sparkles size={16} />
                    <span className="text-sm font-medium">Celestial Context</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Astrological context temporarily disabled while fixing infinite loop issue
                  </div>
                </div>
              </div>

              {/* 6-Card QL Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {QL_POSITIONS.map((position, index) => (
                  <motion.div
                    key={position.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-epii-darker/50 rounded-lg border border-epii-neon/20 p-4"
                  >
                    {/* Position Header */}
                    <div className="text-center mb-4">
                      <div className="text-sm font-medium text-epii-neon">
                        {position.coordinate} - {position.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {position.description}
                      </div>
                    </div>

                    {/* Card Input/Display */}
                    {cards[index] ? (
                      <div className="space-y-4">
                        {/* Card Info */}
                        <div className="text-center p-3 bg-epii-darker/30 rounded border border-epii-neon/10">
                          <div className="font-medium text-epii-neon">
                            {cards[index]!.name}
                          </div>
                          {cards[index]!.reversed && (
                            <div className="text-xs text-purple-400">(Reversed)</div>
                          )}
                          <button
                            onClick={() => setEditingPosition(index)}
                            className="text-xs text-gray-400 hover:text-epii-neon mt-1"
                          >
                            Edit
                          </button>
                        </div>

                        {/* Decanic Display */}
                        {showDecanicDetails && (
                          <DecanDisplay
                            cardName={cards[index]!.name}
                            reversed={cards[index]!.reversed}
                            showDetails={false}
                            className="mt-2"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        {editingPosition === index ? (
                          <div className="space-y-2 relative">
                            <input
                              type="text"
                              value={cardInput}
                              onChange={(e) => handleInputChange(e.target.value)}
                              onFocus={() => {
                                if (cardInput.trim()) {
                                  const newSuggestions = generateSuggestions(cardInput);
                                  setSuggestions(newSuggestions);
                                  setShowSuggestions(newSuggestions.length > 0);
                                }
                              }}
                              onBlur={() => {
                                // Delay hiding suggestions to allow clicks
                                setTimeout(() => setShowSuggestions(false), 200);
                              }}
                              placeholder="Enter card name (e.g., 'The Fool', '5 of Cups')"
                              className="w-full p-2 bg-epii-darker border border-epii-neon/30 rounded text-sm text-gray-300"
                              autoFocus
                            />

                            {/* Smart Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                              <div className="absolute top-full left-0 right-0 z-10 bg-epii-darker border border-epii-neon/30 rounded-b max-h-40 overflow-y-auto">
                                {suggestions.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSuggestionSelect(suggestion)}
                                    className="w-full text-left p-2 text-sm text-gray-300 hover:bg-epii-neon/10 hover:text-epii-neon transition-colors"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Input Format Hint */}
                            <div className="text-xs text-gray-500">
                              Format: "The [Name]" for Major Arcana, "[Number] of [Suit]" for Minor Arcana
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleCardInput(index, cardInput, false)}
                                size="sm"
                                className="bg-epii-neon text-epii-darker text-xs"
                                disabled={!cardInput.trim()}
                              >
                                Upright
                              </Button>
                              <Button
                                onClick={() => handleCardInput(index, cardInput, true)}
                                size="sm"
                                variant="outline"
                                className="border-purple-400 text-purple-400 text-xs"
                                disabled={!cardInput.trim()}
                              >
                                Reversed
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingPosition(index)}
                            className="w-full h-20 border-2 border-dashed border-epii-neon/30 rounded-lg flex items-center justify-center hover:border-epii-neon/60 transition-colors"
                          >
                            <Plus size={24} className="text-epii-neon/50" />
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Finalize Reading Button */}
              {cards.every(card => card !== null) && (
                <div className="text-center mb-6">
                  <Button
                    onClick={() => {
                      // Placeholder for future Nara agent reading logic
                      alert('Reading finalized! Future Nara agent will provide interpretation here.');
                    }}
                    className="bg-gradient-to-r from-epii-neon to-purple-400 text-epii-darker hover:brightness-110 px-8 py-3 text-lg font-semibold"
                  >
                    <Eye size={20} className="mr-2" />
                    Finalize QL Reading
                  </Button>
                  <div className="text-sm text-gray-400 mt-2">
                    Complete 6-card Quaternal Logic spread ready for interpretation
                  </div>
                </div>
              )}

              {/* Toggle Decanic Details */}
              <div className="text-center">
                <Button
                  onClick={() => setShowDecanicDetails(!showDecanicDetails)}
                  variant="outline"
                  size="sm"
                  className="border-epii-neon/30 text-epii-neon hover:bg-epii-neon/10"
                >
                  <Sparkles size={16} className="mr-2" />
                  {showDecanicDetails ? 'Hide' : 'Show'} Decanic Associations
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotDraw;
