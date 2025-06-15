/**
 * useUserContext Hook
 * 
 * Custom hook for accessing and manipulating user context data.
 * Provides a convenient way to access user authentication state,
 * profile data, preferences, and identity information.
 * 
 * Bimba Coordinate: #0-4-1
 */

import { useContext } from 'react';
import UserContext from './UserContextProvider';
import { UserContextValue } from './userContextTypes';

/**
 * Hook for accessing user context
 * @returns User context value
 */
export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  
  return context;
};

export default useUserContext;
