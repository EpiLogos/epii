/**
 * AstrologicalContextDisplay Component - Epic 2, Story E2_F1_S2
 *
 * Displays current astrological context in the Oracle section.
 * Shows key planetary positions and aspects without interpretation logic.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  RefreshCw,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  useAstrologicalContext,
  useAstrologyLoading,
  useAstrologyError,
  useAstrologyCacheStatus,
  useAstrologyActions
} from '../../stores/astrologyStore';

interface AstrologicalContextDisplayProps {
  className?: string;
  compact?: boolean;
  showRefreshButton?: boolean;
}

const AstrologicalContextDisplay: React.FC<AstrologicalContextDisplayProps> = ({
  className = '',
  compact = false,
  showRefreshButton = true
}) => {
  const contextSummary = useAstrologicalContext();
  const isLoading = useAstrologyLoading();
  const error = useAstrologyError();
  const cacheStatus = useAstrologyCacheStatus();
  const { fetchData, fetchContext, refresh, clearError } = useAstrologyActions();

  const [isExpanded, setIsExpanded] = useState(!compact);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Initialize data on mount only - no dependencies to prevent loops
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (!isMounted) return;

      try {
        // Always try to fetch context first (lighter operation)
        await fetchContext();

        // Only fetch full data if context is missing or invalid
        if (!contextSummary || !cacheStatus.isValid) {
          await fetchData();
        }
      } catch (error) {
        console.error('[Astro Context] Initialization error:', error);
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run on mount

  // Auto-refresh every hour if enabled
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(async () => {
      console.log('[Astro Context] Auto-refresh check');
      await fetchData(); // Let the service handle cache validation
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [autoRefreshEnabled]); // Only depend on autoRefreshEnabled

  const handleRefresh = async () => {
    clearError();
    await refresh();
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';

    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (error && !contextSummary) {
    return (
      <div className={`bg-red-900/20 border border-red-500/30 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle size={16} />
          <span className="text-sm">Astrological data unavailable</span>
          {showRefreshButton && (
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="ml-auto border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <RefreshCw size={12} className="mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-epii-darker/30 border border-epii-neon/20 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-epii-neon/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-epii-neon" />
            <span className="text-sm font-medium text-epii-neon">Celestial Context</span>
            {isLoading && (
              <RefreshCw size={12} className="text-epii-neon animate-spin" />
            )}
          </div>

          <div className="flex items-center gap-2">
            {showRefreshButton && (
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-epii-neon"
                disabled={isLoading}
              >
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
              </Button>
            )}

            {compact && (
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-epii-neon"
              >
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-3">
              {contextSummary ? (
                <>
                  {/* Sun & Moon */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Sun size={14} className="text-yellow-400" />
                      <div>
                        <div className="text-xs text-gray-400">Sun</div>
                        <div className="text-sm text-gray-200">{contextSummary.sunSign}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Moon size={14} className="text-blue-300" />
                      <div>
                        <div className="text-xs text-gray-400">Moon</div>
                        <div className="text-sm text-gray-200">{contextSummary.moonSign}</div>
                      </div>
                    </div>
                  </div>

                  {/* Moon Phase & Planetary Hour */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-400">Moon Phase</div>
                      <div className="text-sm text-gray-200">{contextSummary.currentPhase}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400">Planetary Hour</div>
                      <div className="text-sm text-gray-200">{contextSummary.planetaryHour}</div>
                    </div>
                  </div>

                  {/* Major Aspects */}
                  {contextSummary.majorAspects.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Active Aspects</div>
                      <div className="space-y-1">
                        {contextSummary.majorAspects.slice(0, 2).map((aspect, index) => (
                          <div key={index} className="text-xs text-gray-300">
                            {aspect.planet1} {aspect.aspect} {aspect.planet2}
                            <span className="text-gray-500 ml-1">({aspect.orb.toFixed(1)}°)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cache Status */}
                  <div className="flex items-center gap-2 pt-2 border-t border-epii-neon/10">
                    <Clock size={10} className="text-gray-500" />
                    <span className="text-xs text-gray-500">
                      Updated {formatLastUpdated(cacheStatus.lastUpdated)}
                    </span>
                    {!cacheStatus.isValid && (
                      <span className="text-xs text-yellow-400">(Stale)</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-sm text-gray-400">
                    {isLoading ? 'Loading celestial data...' : 'No astrological data available'}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="text-xs text-yellow-400 bg-yellow-900/20 rounded p-2">
                  Warning: {error}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AstrologicalContextDisplay;
