/**
 * Zustand Store for Decanic State Management - Epic 2, Story E2_F1_S1
 *
 * Manages decanic data state, caching, and API interactions
 * for the Oracle section's decanic associations.
 */

import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DecanicStore, DecanicAssociation, Decan } from '../types/decanic.types';
import decanicService from '../services/decanic.service';

interface DecanicStoreState extends DecanicStore {
  // Additional internal state
  cacheExpiry: number;
  lastCacheUpdate: Date | null;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const useDecanicStore = create<DecanicStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      decanicCache: new Map<string, DecanicAssociation>(),
      allDecans: [],
      loading: false,
      error: null,
      lastUpdated: null,
      cacheExpiry: CACHE_DURATION,
      lastCacheUpdate: null,

      // Actions
      getDecanicAssociation: async (cardName: string, reversed: boolean = false) => {
        const state = get();
        const cacheKey = `${cardName}_${reversed}`;

        // Check cache first
        if (state.decanicCache.has(cacheKey) && state.isCacheValid()) {
          return state.decanicCache.get(cacheKey) || null;
        }

        set({ loading: true, error: null });

        try {
          const result = await decanicService.getDecanicAssociation(cardName, reversed);

          if (result.error) {
            set({
              loading: false,
              error: result.error.message
            });
            return null;
          }

          if (result.data) {
            // Update cache
            const newCache = new Map(state.decanicCache);
            newCache.set(cacheKey, result.data);

            set({
              decanicCache: newCache,
              loading: false,
              error: null,
              lastUpdated: new Date(),
              lastCacheUpdate: new Date()
            });

            return result.data;
          }

          set({ loading: false, error: 'No data received' });
          return null;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          set({ loading: false, error: errorMessage });
          return null;
        }
      },

      getAllDecans: async () => {
        const state = get();

        // Check cache first
        if (state.allDecans.length > 0 && state.isCacheValid()) {
          return state.allDecans;
        }

        set({ loading: true, error: null });

        try {
          const result = await decanicApiService.getAllDecans();

          if (result.error) {
            set({
              loading: false,
              error: result.error.message
            });
            return [];
          }

          if (result.data) {
            set({
              allDecans: result.data,
              loading: false,
              error: null,
              lastUpdated: new Date(),
              lastCacheUpdate: new Date()
            });

            return result.data;
          }

          set({ loading: false, error: 'No data received' });
          return [];
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          set({ loading: false, error: errorMessage });
          return [];
        }
      },

      refreshCache: async () => {
        set({ loading: true, error: null });

        try {
          // Clear local cache
          set({
            decanicCache: new Map(),
            allDecans: [],
            lastCacheUpdate: null
          });

          // Refresh server cache
          const refreshResult = await decanicApiService.refreshCache();

          if (refreshResult.error) {
            set({
              loading: false,
              error: refreshResult.error.message
            });
            return;
          }

          // Reload all decans
          await get().getAllDecans();

          set({
            loading: false,
            error: null,
            lastUpdated: new Date()
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Cache refresh failed';
          set({ loading: false, error: errorMessage });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      // Helper methods (not part of the interface but useful internally)
      isCacheValid: () => {
        const state = get();
        if (!state.lastCacheUpdate) return false;
        return (Date.now() - state.lastCacheUpdate.getTime()) < state.cacheExpiry;
      },

      getDecanByName: async (decanName: string) => {
        const state = get();

        // Check if we have all decans cached
        if (state.allDecans.length > 0 && state.isCacheValid()) {
          return state.allDecans.find(decan => decan.name === decanName) || null;
        }

        // Otherwise fetch from API
        const result = await decanicApiService.getDecanByName(decanName);
        return result.error ? null : result.data;
      },

      getDecansBySign: async (zodiacSign: string) => {
        const state = get();

        // Check if we have all decans cached
        if (state.allDecans.length > 0 && state.isCacheValid()) {
          return state.allDecans.filter(decan => decan.zodiacSign === zodiacSign);
        }

        // Otherwise fetch from API
        const result = await decanicApiService.getDecansBySign(zodiacSign);
        return result.error ? [] : result.data || [];
      },

      searchDecans: async (keyword: string) => {
        const state = get();

        // Ensure we have all decans
        const allDecans = await state.getAllDecans();

        return allDecans.filter(decan =>
          decan.name.toLowerCase().includes(keyword.toLowerCase()) ||
          decan.zodiacSign.toLowerCase().includes(keyword.toLowerCase()) ||
          decan.traditionalRuler.toLowerCase().includes(keyword.toLowerCase()) ||
          decan.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
        );
      },

      // Batch operations
      getBatchDecanicAssociations: async (cardNames: string[], reversed?: boolean[]) => {
        const state = get();
        const results: (DecanicAssociation | null)[] = [];

        for (let i = 0; i < cardNames.length; i++) {
          const cardName = cardNames[i];
          const isReversed = reversed?.[i] || false;
          const association = await state.getDecanicAssociation(cardName, isReversed);
          results.push(association);
        }

        return results.filter((result): result is DecanicAssociation => result !== null);
      },

      // Statistics and analytics
      getCacheStats: () => {
        const state = get();
        return {
          cacheSize: state.decanicCache.size,
          allDecansCount: state.allDecans.length,
          lastUpdated: state.lastUpdated,
          lastCacheUpdate: state.lastCacheUpdate,
          isCacheValid: state.isCacheValid(),
          cacheExpiry: state.cacheExpiry
        };
      },

      // Utility methods
      preloadCommonCards: async () => {
        const commonCards = [
          'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
          'Ace of Wands', 'Two of Wands', 'Three of Wands',
          'Ace of Cups', 'Two of Cups', 'Three of Cups',
          'Ace of Swords', 'Two of Swords', 'Three of Swords',
          'Ace of Pentacles', 'Two of Pentacles', 'Three of Pentacles'
        ];

        const state = get();
        await state.getBatchDecanicAssociations(commonCards);
      }
    }),
    {
      name: 'decanic-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist essential data, not the Map (which doesn't serialize well)
        allDecans: state.allDecans,
        lastUpdated: state.lastUpdated,
        lastCacheUpdate: state.lastCacheUpdate,
        cacheExpiry: state.cacheExpiry
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reinitialize the Map after rehydration
          state.decanicCache = new Map();
        }
      }
    }
  )
);

// Custom hooks for easier component usage
export const useDecanicAssociation = (cardName: string, reversed: boolean = false) => {
  const { getDecanicAssociation, loading, error, clearError } = useDecanicStore();

  const [decanicData, setDecanicData] = React.useState<DecanicAssociation | null>(null);

  React.useEffect(() => {
    if (cardName) {
      getDecanicAssociation(cardName, reversed).then(setDecanicData);
    }
  }, [cardName, reversed, getDecanicAssociation]);

  const refetch = React.useCallback(async () => {
    if (cardName) {
      const data = await getDecanicAssociation(cardName, reversed);
      setDecanicData(data);
    }
  }, [cardName, reversed, getDecanicAssociation]);

  return {
    decanicData,
    loading,
    error,
    refetch,
    clearError
  };
};

export const useAllDecans = () => {
  const { getAllDecans, allDecans, loading, error, clearError } = useDecanicStore();

  React.useEffect(() => {
    if (allDecans.length === 0) {
      getAllDecans();
    }
  }, [getAllDecans, allDecans.length]);

  const refetch = React.useCallback(() => {
    return getAllDecans();
  }, [getAllDecans]);

  return {
    decans: allDecans,
    loading,
    error,
    refetch,
    clearError
  };
};

export default useDecanicStore;
