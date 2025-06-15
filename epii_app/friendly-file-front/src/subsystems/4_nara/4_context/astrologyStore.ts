/**
 * Astrology Store - Epic 2, Story E2_F1_S2
 *
 * Zustand store for managing astrological data state.
 * Handles caching, loading states, and data updates.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AstrologicalData,
  AstrologicalContextSummary,
  AstrologicalError
} from '../types/astrology.types';
import astrologicalService from '../subsystems/4_nara/1_services/astrology.service';

interface AstrologyStore {
  // State
  currentData: AstrologicalData | null;
  contextSummary: AstrologicalContextSummary | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  cacheValid: boolean;

  // Actions
  fetchAstrologicalData: (forceRefresh?: boolean) => Promise<void>;
  fetchContextSummary: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  getCacheStatus: () => { isValid: boolean; lastUpdated: Date | null; isLoading: boolean };
}

export const useAstrologyStore = create<AstrologyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentData: null,
      contextSummary: null,
      isLoading: false,
      error: null,
      lastUpdated: null,
      cacheValid: false,

      // Fetch full astrological data
      fetchAstrologicalData: async (forceRefresh = false) => {
        const state = get();

        // Avoid duplicate requests
        if (state.isLoading && !forceRefresh) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const result = await astrologicalService.getCurrentAstrologicalData(forceRefresh);

          if (result.error && !result.data) {
            set({
              isLoading: false,
              error: result.error.message,
              cacheValid: false
            });
            return;
          }

          set({
            currentData: result.data,
            isLoading: false,
            error: result.error ? result.error.message : null,
            lastUpdated: new Date(),
            cacheValid: true
          });

          // Also update context summary if we have new data
          if (result.data) {
            get().fetchContextSummary();
          }

        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch astrological data',
            cacheValid: false
          });
        }
      },

      // Fetch simplified context summary
      fetchContextSummary: async () => {
        try {
          const result = await astrologicalService.getAstrologicalContext();

          if (result.data) {
            set({ contextSummary: result.data });
          }

          if (result.error) {
            console.warn('[Astrology Store] Context summary error:', result.error.message);
          }

        } catch (error) {
          console.error('[Astrology Store] Failed to fetch context summary:', error);
        }
      },

      // Force refresh data
      refreshData: async () => {
        await get().fetchAstrologicalData(true);
      },

      // Clear error state
      clearError: () => {
        set({ error: null });
      },

      // Get cache status - memoized to prevent infinite loops
      getCacheStatus: () => {
        const state = get();
        return {
          isValid: state.cacheValid,
          lastUpdated: state.lastUpdated,
          isLoading: state.isLoading
        };
      }
    }),
    {
      name: 'astrology-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist essential data, not loading states
        currentData: state.currentData,
        contextSummary: state.contextSummary,
        lastUpdated: state.lastUpdated,
        cacheValid: state.cacheValid
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check if persisted data is still valid (1 hour cache)
          const now = new Date();
          const lastUpdate = state.lastUpdated ? new Date(state.lastUpdated) : null;
          const isValid = lastUpdate && (now.getTime() - lastUpdate.getTime()) < (60 * 60 * 1000);

          state.cacheValid = isValid;

          // If cache is invalid, clear old data
          if (!isValid) {
            state.currentData = null;
            state.contextSummary = null;
            state.lastUpdated = null;
          }
        }
      }
    }
  )
);

// Selector hooks for common use cases
export const useAstrologicalData = () => useAstrologyStore(state => state.currentData);
export const useAstrologicalContext = () => useAstrologyStore(state => state.contextSummary);
export const useAstrologyLoading = () => useAstrologyStore(state => state.isLoading);
export const useAstrologyError = () => useAstrologyStore(state => state.error);
export const useAstrologyCacheStatus = () => useAstrologyStore(state => ({
  isValid: state.cacheValid,
  lastUpdated: state.lastUpdated,
  isLoading: state.isLoading
}));

// Action hooks
export const useAstrologyActions = () => useAstrologyStore(state => ({
  fetchData: state.fetchAstrologicalData,
  fetchContext: state.fetchContextSummary,
  refresh: state.refreshData,
  clearError: state.clearError
}));
