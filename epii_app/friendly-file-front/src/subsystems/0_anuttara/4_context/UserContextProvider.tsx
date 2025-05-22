/**
 * User Context Provider
 * 
 * Provides user context data and operations to the application.
 * This component manages user authentication state, profile data,
 * preferences, and identity information.
 * 
 * Bimba Coordinate: #0-4-0
 */

import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import {
  UserContextState,
  UserContextAction,
  UserContextValue,
  UserData,
  UserPreferences,
  ProfileData,
  IdentityStructure
} from './userContextTypes';

// Initial state
const initialState: UserContextState = {
  isAuthenticated: false,
  isLoading: true,
  error: null,
  userData: null
};

// Create context
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Reducer function
const userReducer = (state: UserContextState, action: UserContextAction): UserContextState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        userData: action.payload
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        userData: null
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        userData: null
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        userData: state.userData ? {
          ...state.userData,
          preferences: {
            ...state.userData.preferences,
            ...action.payload
          }
        } : null
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        userData: state.userData ? {
          ...state.userData,
          profileData: {
            ...state.userData.profileData,
            ...action.payload
          }
        } : null
      };
    case 'UPDATE_IDENTITY':
      return {
        ...state,
        userData: state.userData ? {
          ...state.userData,
          identityStructure: {
            ...state.userData.identityStructure,
            ...action.payload
          }
        } : null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

// Provider component
export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        const response = await axios.get(`${backendUrl}/api/users/${userId}`);
        
        if (response.data.success) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
        } else {
          // Clear invalid session
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('userRole');
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Session expired' });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear invalid session
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Authentication error' });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = (userData: UserData) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    dispatch({ type: 'LOGOUT' });
  };

  // Update preferences
  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!state.userData) return;

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await axios.put(
        `${backendUrl}/api/users/${state.userData.userId}/preferences`,
        { preferences }
      );

      if (response.data.success) {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  // Update profile
  const updateProfile = async (profile: Partial<ProfileData>) => {
    if (!state.userData) return;

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await axios.put(
        `${backendUrl}/api/users/${state.userData.userId}`,
        { profileData: profile }
      );

      if (response.data.success) {
        dispatch({ type: 'UPDATE_PROFILE', payload: profile });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Update identity
  const updateIdentity = async (identity: Partial<IdentityStructure>) => {
    if (!state.userData) return;

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await axios.put(
        `${backendUrl}/api/users/${state.userData.userId}/identity`,
        { identityStructure: identity }
      );

      if (response.data.success) {
        dispatch({ type: 'UPDATE_IDENTITY', payload: identity });
      }
    } catch (error) {
      console.error('Error updating identity:', error);
    }
  };

  // Context value
  const contextValue: UserContextValue = {
    state,
    login,
    logout,
    updatePreferences,
    updateProfile,
    updateIdentity
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
