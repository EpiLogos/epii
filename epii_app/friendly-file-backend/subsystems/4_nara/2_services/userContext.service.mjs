/**
 * User Context Service
 *
 * Provides methods for managing user context data:
 * - Retrieving user context
 * - Updating user context
 * - Preparing user data for LightRAG ingestion
 *
 * This service acts as an abstraction layer between controllers and the database,
 * and will eventually integrate with LightRAG for user memory management.
 *
 * ARCHITECTURAL NOTE:
 * In the future, this service could be expanded to support inter-agent communication
 * between Nara and Epii. The architectural vision includes:
 *
 * 1. Nara as the Primary Identity Manager:
 *    - Manages user identity data and its evolution over time
 *    - Periodically synthesizes updated bios based on identity changes
 *    - Tracks the user's interactions and updates identity accordingly
 *    - Provides a consistent view of the user across the system
 *
 * 2. Epii as the Knowledge Integrator:
 *    - Requests user context from Nara when needed
 *    - Focuses on document analysis and knowledge integration
 *    - Contributes document-related insights back to the user's knowledge graph
 *
 * 3. LightRAG Integration:
 *    - Could be implemented at the Nara level for personal memory
 *    - Could be implemented at the Epii level for knowledge integration
 *    - Ideally, both agents would contribute to a shared knowledge base
 *    - User identity would be one facet of a comprehensive memory system
 *
 * 4. Bio Updates and Tracking:
 *    - Nara could monitor changes in identity data
 *    - Trigger bio re-synthesis when significant changes occur
 *    - Maintain a history of identity evolution
 *    - Provide insights into how the user's identity is changing over time
 */

import User from '../databases/shared/models/User.model.mjs';
import bpMCPService from './bpMCPService.mjs';

/**
 * Get user context by userId
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<Object>} - User context data
 */
export const getUserContext = async (userId) => {
  try {
    // Find the user
    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Return user context data
    return {
      userId: user.userId,
      name: user.name,
      identityStructure: user.identityStructure,
      profileData: user.profileData,
      preferences: user.preferences,
      systemUsage: user.systemUsage
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    throw error;
  }
};

/**
 * Update user context
 * @param {string} userId - The user's unique identifier
 * @param {Object} contextData - The context data to update
 * @returns {Promise<Object>} - Updated user context
 */
export const updateUserContext = async (userId, contextData) => {
  try {
    // Find the user
    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Update allowed fields
    const { identityStructure, profileData, preferences } = contextData;

    if (identityStructure) {
      // Merge with existing identity structure
      Object.keys(identityStructure).forEach(key => {
        if (user.identityStructure[key]) {
          user.identityStructure[key] = {
            ...user.identityStructure[key],
            ...identityStructure[key]
          };
        }
      });
    }

    if (profileData) {
      // Merge with existing profile data
      user.profileData = { ...user.profileData, ...profileData };
    }

    if (preferences) {
      // Merge with existing preferences
      user.preferences = { ...user.preferences, ...preferences };
    }

    // Save the updated user
    await user.save();

    // Return updated context
    return {
      userId: user.userId,
      identityStructure: user.identityStructure,
      profileData: user.profileData,
      preferences: user.preferences
    };
  } catch (error) {
    console.error('Error updating user context:', error);
    throw error;
  }
};

/**
 * Prepare user data for LightRAG ingestion
 * This function transforms user data into a format suitable for LightRAG
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<Object>} - Prepared data for LightRAG
 */
export const prepareUserDataForLightRAG = async (userId) => {
  try {
    // Get user context
    const userContext = await getUserContext(userId);

    // Option 1: Direct ingestion of user data
    // Simply format the user data for ingestion
    const directIngestionData = {
      userId,
      content: JSON.stringify(userContext),
      metadata: {
        source: 'user_context',
        timestamp: new Date().toISOString(),
        contentType: 'application/json'
      }
    };

    // Option 2: LLM-processed "poetic rendering" of user data
    // This would be implemented when LLM integration is ready
    // For now, return a placeholder
    const poeticRenderingPlaceholder = {
      userId,
      // This would be replaced with actual LLM-processed content
      content: `User profile for ${userContext.name}`,
      metadata: {
        source: 'user_context_llm_processed',
        timestamp: new Date().toISOString(),
        contentType: 'text/plain'
      }
    };

    // For now, return the direct ingestion data
    // Later, this could be configurable or use both approaches
    return directIngestionData;
  } catch (error) {
    console.error('Error preparing user data for LightRAG:', error);
    throw error;
  }
};

/**
 * Ingest user data into LightRAG
 * This is a placeholder for future implementation
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<Object>} - Result of ingestion
 */
export const ingestUserDataToLightRAG = async (userId) => {
  try {
    // Prepare data for ingestion
    const preparedData = await prepareUserDataForLightRAG(userId);

    // This would call the LightRAG ingestion API via bpMCPService
    // For now, log the data that would be ingested
    console.log('Would ingest to LightRAG:', preparedData);

    // Placeholder for future implementation
    // const result = await bpMCPService.callTool('ingestToLightRAG', preparedData);

    return {
      success: true,
      message: 'User data prepared for LightRAG ingestion',
      // This would include the actual ingestion result later
    };
  } catch (error) {
    console.error('Error ingesting user data to LightRAG:', error);
    throw error;
  }
};

export default {
  getUserContext,
  updateUserContext,
  prepareUserDataForLightRAG,
  ingestUserDataToLightRAG
};
