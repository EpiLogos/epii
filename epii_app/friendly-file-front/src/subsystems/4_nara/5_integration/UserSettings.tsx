/**
 * User Settings Page
 *
 * Allows users to view and edit their profile, preferences, and identity information.
 * This page is accessible to both admin and regular users.
 *
 * Bimba Coordinate: #4-5-0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, User, Settings, LogOut, Loader2 } from 'lucide-react';
import PageTransition from '../../../shared/components/layout/PageTransition';
import { useUserContext } from '../4_context/useUserContext';
import { UserPreferences, ProfileData, IdentityStructure } from '../../0_anuttara/4_context/userContextTypes';

// Tab type
type SettingsTab = 'profile' | 'preferences' | 'identity';

const UserSettings: React.FC = () => {
  const navigate = useNavigate();
  const { state, logout, updateProfile, updatePreferences, updateIdentity } = useUserContext();
  const { userData, isLoading } = state;

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [profileData, setProfileData] = useState<ProfileData>(userData?.profileData || {
    birthdate: null,
    location: '',
    bio: '',
    avatarUrl: '',
    socialLinks: {}
  });

  const [preferences, setPreferences] = useState<UserPreferences>(userData?.preferences || {
    theme: 'dark',
    language: 'en',
    notifications: true,
    privacySettings: {
      shareData: false,
      analyticsConsent: false
    },
    agentPreferences: {
      responseStyle: 'balanced',
      creativityLevel: 'balanced',
      expertiseLevel: 'intermediate'
    }
  });

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Handle profile update on blur
  const handleProfileFieldBlur = async () => {
    if (!userData) return;

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await updateProfile(profileData);
      setStatusMessage({ type: 'success', text: 'Profile updated successfully' });
      setTimeout(() => setStatusMessage(null), 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setStatusMessage({ type: 'error', text: 'Failed to update profile' });
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle preferences update on blur
  const handlePreferencesFieldBlur = async () => {
    if (!userData) return;

    setIsSaving(true);
    setStatusMessage(null);

    try {
      await updatePreferences(preferences);
      setStatusMessage({ type: 'success', text: 'Preferences updated successfully' });
      setTimeout(() => setStatusMessage(null), 1500);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setStatusMessage({ type: 'error', text: 'Failed to update preferences' });
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Track identity changes locally without immediate saving
  const [pendingIdentityUpdates, setPendingIdentityUpdates] = useState<Record<string, any>>({});

  // Handle local identity field change (no API call)
  const handleIdentityFieldChange = (identityType: keyof IdentityStructure, data: any) => {
    if (!userData) return;

    // Store the change locally for both pending updates and immediate UI display
    setPendingIdentityUpdates(prev => {
      // Create a new object with the updated data
      const newPendingUpdates = {
        ...prev,
        [identityType]: data
      };

      // Return the new pending updates
      return newPendingUpdates;
    });
  };

  // Handle identity update on blur (when user clicks out of field)
  const handleIdentityUpdateOnBlur = async (identityType: keyof IdentityStructure) => {
    if (!userData || !pendingIdentityUpdates[identityType]) return;

    setIsSaving(true);

    try {
      const update = { [identityType]: pendingIdentityUpdates[identityType] } as Partial<IdentityStructure>;
      await updateIdentity(update);
      // Show status message briefly then clear it
      setStatusMessage({ type: 'success', text: 'Identity updated successfully' });
      setTimeout(() => setStatusMessage(null), 1500);

      // Clear this pending update
      setPendingIdentityUpdates(prev => {
        const newPending = { ...prev };
        delete newPending[identityType];
        return newPending;
      });
    } catch (error) {
      console.error('Error updating identity:', error);
      setStatusMessage({ type: 'error', text: 'Failed to update identity' });
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // If not authenticated, redirect to auth page
  if (!isLoading && !userData) {
    navigate('/auth');
    return null;
  }

  return (
    <PageTransition>
      {/* Add top padding to account for navbar */}
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Mobile toggle button */}
          <button
            className="fixed left-4 top-20 z-50 md:hidden bg-epii-dark/90 p-2 rounded-full neo-glow"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} className="text-epii-neon" /> : <Settings size={20} className="text-epii-neon" />}
          </button>

          {/* Sidebar - fixed position on desktop, slides out from left on mobile */}
          <div
            className={`
              fixed md:sticky left-0 top-0 md:top-20 h-screen md:h-[calc(100vh-80px)]
              w-56 md:w-48 bg-epii-dark/90 neo-glow rounded-none md:rounded-lg
              p-6 transform transition-transform duration-300
              z-40 md:z-auto overflow-y-auto
              ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
            style={{ maxHeight: 'calc(100vh - 80px)' }}
          >
            <div className="flex flex-col items-center text-center gap-2 mb-6 pt-16 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-epii-neon/20 flex items-center justify-center">
                <User className="text-epii-neon" />
              </div>
              <div>
                <h2 className="text-lg font-medium">{userData?.name}</h2>
                <p className="text-sm text-foreground/60">{userData?.role}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
                  activeTab === 'profile' ? 'bg-epii-neon/10 text-epii-neon' : 'hover:bg-epii-dark/50'
                }`}
              >
                <User size={16} />
                <span className="text-sm">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
                  activeTab === 'preferences' ? 'bg-epii-neon/10 text-epii-neon' : 'hover:bg-epii-dark/50'
                }`}
              >
                <Settings size={16} />
                <span className="text-sm">Preferences</span>
              </button>
              <button
                onClick={() => setActiveTab('identity')}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
                  activeTab === 'identity' ? 'bg-epii-neon/10 text-epii-neon' : 'hover:bg-epii-dark/50'
                }`}
              >
                <User size={16} />
                <span className="text-sm">Identity</span>
              </button>
            </nav>

            <div className="mt-8 pt-4 border-t border-epii-neon/10">
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-md flex items-center gap-2 text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-epii-dark/80 neo-glow rounded-lg p-6 overflow-hidden md:h-[calc(100vh-80px)] md:max-h-[calc(100vh-80px)] relative">
            {/* Status message - fixed position, animated */}
            {statusMessage && (
              <div
                className={`fixed top-24 right-6 z-50 p-3 rounded-md shadow-lg transition-opacity duration-300 ${
                  statusMessage.type === 'success' ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
                }`}
                style={{
                  maxWidth: '300px',
                  animation: 'fadeInOut 1.5s ease-in-out'
                }}
              >
                <div className="flex items-center gap-2">
                  {statusMessage.type === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {statusMessage.text}
                </div>
              </div>
            )}

            {/* Profile tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-light mb-6">Profile Settings</h2>

                <div className="space-y-6">
                  {/* Name and Email in a compact row */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-foreground/70 mb-2">Name</label>
                      <input
                        type="text"
                        value={userData?.name || ''}
                        disabled
                        className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50 disabled:opacity-60"
                      />
                      <p className="text-xs text-foreground/50 mt-1">Name cannot be changed</p>
                    </div>

                    <div className="flex-1">
                      <label className="block text-foreground/70 mb-2">Email</label>
                      <input
                        type="email"
                        value={userData?.email || ''}
                        disabled
                        className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50 disabled:opacity-60"
                      />
                      <p className="text-xs text-foreground/50 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-foreground/70 mb-2">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      onBlur={handleProfileFieldBlur}
                      className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                    />
                  </div>

                  {/* Bio with more space */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-foreground/70">Bio</label>
                      <button
                        onClick={async () => {
                          if (!userData?.userId) return;

                          setIsSaving(true);
                          try {
                            const response = await fetch(`/api/users/${userData.userId}/synthesize-bio`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              }
                            });

                            if (!response.ok) {
                              throw new Error('Failed to synthesize bio');
                            }

                            const data = await response.json();
                            if (data.success) {
                              // Update the bio in the local state
                              setProfileData(prev => ({ ...prev, bio: data.bio }));
                              setStatusMessage({ type: 'success', text: 'Bio synthesized successfully' });
                            } else {
                              throw new Error(data.message || 'Failed to synthesize bio');
                            }
                          } catch (error) {
                            console.error('Error synthesizing bio:', error);
                            setStatusMessage({ type: 'error', text: 'Failed to synthesize bio' });
                          } finally {
                            setIsSaving(false);
                            setTimeout(() => setStatusMessage(null), 3000);
                          }
                        }}
                        className="px-3 py-1 bg-epii-neon/20 hover:bg-epii-neon/30 text-epii-neon text-xs rounded-md flex items-center gap-1 transition-colors"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-epii-neon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Synthesizing...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Synthesize Bio
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      onBlur={handleProfileFieldBlur}
                      rows={6}
                      className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-xs text-foreground/50 mt-1">Click 'Synthesize Bio' to generate a bio based on your identity information</p>
                  </div>

                  {/* Save button removed - saving happens on blur */}
                </div>
              </motion.div>
            )}

            {/* Preferences tab */}
            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-light mb-6">Preferences</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-foreground/70 mb-2">Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as 'light' | 'dark' })}
                      onBlur={handlePreferencesFieldBlur}
                      className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-foreground/70 mb-2">Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      onBlur={handlePreferencesFieldBlur}
                      className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={preferences.notifications}
                      onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                      onBlur={handlePreferencesFieldBlur}
                      className="w-5 h-5 rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                    />
                    <label htmlFor="notifications" className="text-foreground/70">
                      Enable notifications
                    </label>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Agent Preferences</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-foreground/70 mb-2">Response Style</label>
                        <select
                          value={preferences.agentPreferences.responseStyle}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            agentPreferences: {
                              ...preferences.agentPreferences,
                              responseStyle: e.target.value as 'concise' | 'balanced' | 'detailed'
                            }
                          })}
                          onBlur={handlePreferencesFieldBlur}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        >
                          <option value="concise">Concise</option>
                          <option value="balanced">Balanced</option>
                          <option value="detailed">Detailed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Creativity Level</label>
                        <select
                          value={preferences.agentPreferences.creativityLevel}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            agentPreferences: {
                              ...preferences.agentPreferences,
                              creativityLevel: e.target.value as 'analytical' | 'balanced' | 'creative'
                            }
                          })}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        >
                          <option value="analytical">Analytical</option>
                          <option value="balanced">Balanced</option>
                          <option value="creative">Creative</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Expertise Level</label>
                        <select
                          value={preferences.agentPreferences.expertiseLevel}
                          onChange={(e) => setPreferences({
                            ...preferences,
                            agentPreferences: {
                              ...preferences.agentPreferences,
                              expertiseLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                            }
                          })}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Save button removed - saving happens on blur */}
                </div>
              </motion.div>
            )}

            {/* Identity tab */}
            {activeTab === 'identity' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar"
              >
                <h2 className="text-2xl font-light mb-6">Identity</h2>

                <p className="text-foreground/70 mb-6">
                  Your identity information helps the system understand you better and provide more personalized experiences.
                  This information is structured according to the 6 identities framework.
                </p>

                <div className="space-y-8">
                  {/* #5-0-0: Transcendent Foundation */}
                  <div className="p-4 border border-epii-neon/20 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-lg font-medium text-epii-neon">Transcendent Foundation (#5-0-0)</h3>
                    </div>
                    <p className="text-sm text-foreground/70 mb-4">
                      The implicit "I Am" or "Aham" - your core values and life philosophy.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-foreground/70 mb-2">Core Values</label>
                        <input
                          type="text"
                          placeholder="Enter values separated by commas"
                          value={
                            pendingIdentityUpdates.transcendentFoundation?.coreValues?.join(', ') ||
                            userData?.identityStructure?.transcendentFoundation?.coreValues?.join(', ') ||
                            ''
                          }
                          onChange={(e) => {
                            const values = e.target.value.split(',').map(value => value.trim());
                            const updatedIdentity = {
                              ...userData?.identityStructure?.transcendentFoundation,
                              coreValues: values
                            };
                            handleIdentityFieldChange('transcendentFoundation', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('transcendentFoundation')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Life Philosophy</label>
                        <textarea
                          value={
                            pendingIdentityUpdates.transcendentFoundation?.lifePhilosophy ||
                            userData?.identityStructure?.transcendentFoundation?.lifePhilosophy ||
                            ''
                          }
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure?.transcendentFoundation,
                              lifePhilosophy: e.target.value
                            };
                            handleIdentityFieldChange('transcendentFoundation', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('transcendentFoundation')}
                          rows={3}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                          placeholder="Describe your life philosophy..."
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Spiritual Orientation</label>
                        <textarea
                          value={
                            pendingIdentityUpdates.transcendentFoundation?.spiritualOrientation ||
                            userData?.identityStructure?.transcendentFoundation?.spiritualOrientation ||
                            ''
                          }
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure?.transcendentFoundation,
                              spiritualOrientation: e.target.value
                            };
                            handleIdentityFieldChange('transcendentFoundation', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('transcendentFoundation')}
                          rows={2}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                          placeholder="Describe your spiritual orientation..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* #5-0-1: Individual Identity */}
                  <div className="p-4 border border-epii-neon/20 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-lg font-medium text-epii-neon">Individual Identity (#5-0-1)</h3>
                      <div className="mt-2 md:mt-0 md:ml-4 w-full md:w-auto">
                        <input
                          type="text"
                          placeholder="Name"
                          value={
                            pendingIdentityUpdates.individualIdentity?.name ||
                            userData?.identityStructure.individualIdentity.name ||
                            userData?.name ||
                            ''
                          }
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.individualIdentity,
                              name: e.target.value
                            };
                            handleIdentityFieldChange('individualIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('individualIdentity')}
                          className="w-full md:w-48 px-3 py-1 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50 text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 mb-4">
                      Personal or ego dimension - your traits, strengths, and interests.
                    </p>

                    <div className="space-y-4">

                      <div>
                        <label className="block text-foreground/70 mb-2">Personal Traits</label>
                        <input
                          type="text"
                          placeholder="Enter traits separated by commas"
                          value={
                            pendingIdentityUpdates.individualIdentity?.personalTraits?.join(', ') ||
                            userData?.identityStructure.individualIdentity.personalTraits.join(', ') ||
                            ''
                          }
                          onChange={(e) => {
                            const traits = e.target.value.split(',').map(trait => trait.trim());
                            const updatedIdentity = {
                              ...userData?.identityStructure.individualIdentity,
                              personalTraits: traits
                            };
                            handleIdentityFieldChange('individualIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('individualIdentity')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Strengths</label>
                        <input
                          type="text"
                          placeholder="Enter strengths separated by commas"
                          value={
                            pendingIdentityUpdates.individualIdentity?.strengths?.join(', ') ||
                            userData?.identityStructure.individualIdentity.strengths.join(', ') ||
                            ''
                          }
                          onChange={(e) => {
                            const strengths = e.target.value.split(',').map(strength => strength.trim());
                            const updatedIdentity = {
                              ...userData?.identityStructure.individualIdentity,
                              strengths: strengths
                            };
                            handleIdentityFieldChange('individualIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('individualIdentity')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Challenges</label>
                        <input
                          type="text"
                          placeholder="Enter challenges separated by commas"
                          value={
                            pendingIdentityUpdates.individualIdentity?.challenges?.join(', ') ||
                            userData?.identityStructure.individualIdentity.challenges.join(', ') ||
                            ''
                          }
                          onChange={(e) => {
                            const challenges = e.target.value.split(',').map(challenge => challenge.trim());
                            const updatedIdentity = {
                              ...userData?.identityStructure.individualIdentity,
                              challenges: challenges
                            };
                            handleIdentityFieldChange('individualIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('individualIdentity')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Interests</label>
                        <input
                          type="text"
                          placeholder="Enter interests separated by commas"
                          value={
                            pendingIdentityUpdates.individualIdentity?.interests?.join(', ') ||
                            userData?.identityStructure.individualIdentity.interests.join(', ') ||
                            ''
                          }
                          onChange={(e) => {
                            const interests = e.target.value.split(',').map(interest => interest.trim());
                            const updatedIdentity = {
                              ...userData?.identityStructure.individualIdentity,
                              interests: interests
                            };
                            handleIdentityFieldChange('individualIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('individualIdentity')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* #5-0-2: Collective Identity */}
                  <div className="p-4 border border-epii-neon/20 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-lg font-medium text-epii-neon">Collective Identity (#5-0-2)</h3>
                      <div className="mt-2 md:mt-0 md:ml-4 w-full md:w-auto">
                        <input
                          type="text"
                          placeholder="Name"
                          value={
                            pendingIdentityUpdates.collectiveIdentity?.name ||
                            userData?.identityStructure.collectiveIdentity.name ||
                            ''
                          }
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.collectiveIdentity,
                              name: e.target.value
                            };
                            handleIdentityFieldChange('collectiveIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('collectiveIdentity')}
                          className="w-full md:w-48 px-3 py-1 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50 text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 mb-4">
                      Universal dimension - your cultural background, communities, and social roles.
                    </p>

                    <div className="space-y-4">

                      <div>
                        <label className="block text-foreground/70 mb-2">Cultural Background</label>
                        <input
                          type="text"
                          placeholder="Describe your cultural background"
                          value={
                            pendingIdentityUpdates.collectiveIdentity?.culturalBackground ||
                            userData?.identityStructure.collectiveIdentity.culturalBackground ||
                            ''
                          }
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.collectiveIdentity,
                              culturalBackground: e.target.value
                            };
                            handleIdentityFieldChange('collectiveIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('collectiveIdentity')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Communities</label>
                        <input
                          type="text"
                          placeholder="Enter communities separated by commas"
                          value={
                            pendingIdentityUpdates.collectiveIdentity?.communities?.join(', ') ||
                            userData?.identityStructure.collectiveIdentity.communities.join(', ') ||
                            ''
                          }
                          onChange={(e) => {
                            const communities = e.target.value.split(',').map(community => community.trim());
                            const updatedIdentity = {
                              ...userData?.identityStructure.collectiveIdentity,
                              communities: communities
                            };
                            handleIdentityFieldChange('collectiveIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('collectiveIdentity')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Social Roles</label>
                        <input
                          type="text"
                          placeholder="Enter social roles separated by commas"
                          value={
                            pendingIdentityUpdates.collectiveIdentity?.socialRoles?.join(', ') ||
                            userData?.identityStructure.collectiveIdentity.socialRoles.join(', ') ||
                            ''
                          }
                          onChange={(e) => {
                            const socialRoles = e.target.value.split(',').map(role => role.trim());
                            const updatedIdentity = {
                              ...userData?.identityStructure.collectiveIdentity,
                              socialRoles: socialRoles
                            };
                            handleIdentityFieldChange('collectiveIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('collectiveIdentity')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* #5-0-3: Soul Identity */}
                  <div className="p-4 border border-epii-neon/20 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-lg font-medium text-epii-neon">Soul Identity (#5-0-3)</h3>
                      <div className="mt-2 md:mt-0 md:ml-4 w-full md:w-auto">
                        <input
                          type="text"
                          placeholder="Name"
                          value={
                            pendingIdentityUpdates.soulIdentity?.name ||
                            userData?.identityStructure.soulIdentity.name ||
                            ''
                          }
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.soulIdentity,
                              name: e.target.value
                            };
                            handleIdentityFieldChange('soulIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('soulIdentity')}
                          className="w-full md:w-48 px-3 py-1 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50 text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 mb-4">
                      Personal identity oriented toward the collective - your purpose, values, and aspirations.
                    </p>

                    <div className="space-y-4">

                      <div>
                        <label className="block text-foreground/70 mb-2">Purpose</label>
                        <textarea
                          placeholder="Describe your sense of purpose or calling"
                          value={
                            pendingIdentityUpdates.soulIdentity?.purpose ||
                            userData?.identityStructure.soulIdentity.purpose ||
                            ''
                          }
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.soulIdentity,
                              purpose: e.target.value
                            };
                            handleIdentityFieldChange('soulIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('soulIdentity')}
                          rows={2}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Values</label>
                        <input
                          type="text"
                          placeholder="Enter values separated by commas"
                          value={
                            pendingIdentityUpdates.soulIdentity?.values?.join(', ') ||
                            userData?.identityStructure.soulIdentity.values.join(', ') ||
                            ''
                          }
                          onChange={(e) => {
                            const values = e.target.value.split(',').map(value => value.trim());
                            const updatedIdentity = {
                              ...userData?.identityStructure.soulIdentity,
                              values: values
                            };
                            handleIdentityFieldChange('soulIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('soulIdentity')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Aspirations</label>
                        <input
                          type="text"
                          placeholder="Enter aspirations separated by commas"
                          value={
                            pendingIdentityUpdates.soulIdentity?.aspirations?.join(', ') ||
                            userData?.identityStructure.soulIdentity.aspirations.join(', ') ||
                            ''
                          }
                          onChange={(e) => {
                            const aspirations = e.target.value.split(',').map(aspiration => aspiration.trim());
                            const updatedIdentity = {
                              ...userData?.identityStructure.soulIdentity,
                              aspirations: aspirations
                            };
                            handleIdentityFieldChange('soulIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('soulIdentity')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* #5-0-4: Self Identity */}
                  <div className="p-4 border border-epii-neon/20 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-lg font-medium text-epii-neon">Self Identity (#5-0-4)</h3>
                      <div className="mt-2 md:mt-0 md:ml-4 w-full md:w-auto">
                        <input
                          type="text"
                          placeholder="Name"
                          value={
                            pendingIdentityUpdates.selfIdentity?.name ||
                            userData?.identityStructure.selfIdentity.name ||
                            ''
                          }
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.selfIdentity,
                              name: e.target.value
                            };
                            handleIdentityFieldChange('selfIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('selfIdentity')}
                          className="w-full md:w-48 px-3 py-1 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50 text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 mb-4">
                      Conjunction of collective and personal - how you see yourself, areas for growth, and your life story.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-foreground/70 mb-2">Self Perception</label>
                        <textarea
                          placeholder="Describe how you see yourself"
                          value={
                            pendingIdentityUpdates.selfIdentity?.selfPerception ||
                            userData?.identityStructure.selfIdentity.selfPerception ||
                            ''
                          }
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.selfIdentity,
                              selfPerception: e.target.value
                            };
                            handleIdentityFieldChange('selfIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('selfIdentity')}
                          rows={2}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Growth Areas</label>
                        <input
                          type="text"
                          placeholder="Enter growth areas separated by commas"
                          value={
                            pendingIdentityUpdates.selfIdentity?.growthAreas?.join(', ') ||
                            userData?.identityStructure.selfIdentity.growthAreas.join(', ') ||
                            ''
                          }
                          onChange={(e) => {
                            const growthAreas = e.target.value.split(',').map(area => area.trim());
                            const updatedIdentity = {
                              ...userData?.identityStructure.selfIdentity,
                              growthAreas: growthAreas
                            };
                            handleIdentityFieldChange('selfIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('selfIdentity')}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Life Story</label>
                        <textarea
                          placeholder="Share key experiences that have shaped you"
                          value={
                            pendingIdentityUpdates.selfIdentity?.lifeStory ||
                            userData?.identityStructure.selfIdentity.lifeStory ||
                            ''
                          }
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.selfIdentity,
                              lifeStory: e.target.value
                            };
                            handleIdentityFieldChange('selfIdentity', updatedIdentity);
                          }}
                          onBlur={() => handleIdentityUpdateOnBlur('selfIdentity')}
                          rows={3}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* #5-0-5: Integral Identity */}
                  <div className="p-4 border border-epii-neon/20 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-lg font-medium text-epii-neon">Integral Identity (#5-0-5)</h3>
                    </div>
                    <p className="text-sm text-foreground/70 mb-4">
                      Integration that creates recursive twist - your vision, integration, and evolution.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-foreground/70 mb-2">Vision</label>
                        <textarea
                          placeholder="Describe your vision for personal and collective future"
                          value={userData?.identityStructure.integralIdentity.vision || ''}
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.integralIdentity,
                              vision: e.target.value
                            };
                            handleIdentityUpdate('integralIdentity', updatedIdentity);
                          }}
                          rows={2}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Integration</label>
                        <textarea
                          placeholder="Describe how you integrate different aspects of your identity"
                          value={userData?.identityStructure.integralIdentity.integration || ''}
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.integralIdentity,
                              integration: e.target.value
                            };
                            handleIdentityUpdate('integralIdentity', updatedIdentity);
                          }}
                          rows={2}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground/70 mb-2">Evolution</label>
                        <textarea
                          placeholder="Describe how your identity has evolved over time"
                          value={userData?.identityStructure.integralIdentity.evolution || ''}
                          onChange={(e) => {
                            const updatedIdentity = {
                              ...userData?.identityStructure.integralIdentity,
                              evolution: e.target.value
                            };
                            handleIdentityUpdate('integralIdentity', updatedIdentity);
                          }}
                          rows={2}
                          className="w-full px-4 py-2 bg-epii-dark neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserSettings;
