/**
 * User Controller
 *
 * Handles user-related operations including:
 * - User creation (signup)
 * - User authentication (signin)
 * - User profile retrieval and update
 * - User preferences management
 */

import User from '../../../databases/shared/models/User.model.mjs';
import { v4 as uuidv4 } from 'uuid';
// Removed bcrypt dependency for simplified authentication

/**
 * Create a new user (signup)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate a unique userId
    const userId = uuidv4();

    // Check if this is the first user (to make them admin)
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    // Create new user with default identity structure
    const user = new User({
      userId,
      name,
      email,
      password, // Store password directly for simplified authentication
      role: isFirstUser ? 'admin' : 'user', // First user is admin
      // Set the individual identity name to the user's name
      identityStructure: {
        individualIdentity: {
          name: name // Auto-assign the user's name to the individual identity
        }
      }
      // Other fields will use their default values
    });

    // Save the user
    await user.save();

    // Return success without sending back the password
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Authenticate a user (signin)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password (simplified for now)
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update login statistics
    user.systemUsage.lastLogin = new Date();
    user.systemUsage.loginCount += 1;
    await user.save();

    // Return success with user data
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user data
    res.status(200).json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Find the user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent updating sensitive fields directly
    const { password, email, role, ...safeUpdates } = updates;

    // Apply updates to allowed fields
    Object.keys(safeUpdates).forEach(key => {
      if (key === 'identityStructure' || key === 'profileData' || key === 'preferences') {
        // For nested objects, merge rather than replace
        user[key] = { ...user[key], ...safeUpdates[key] };
      } else {
        user[key] = safeUpdates[key];
      }
    });

    // Save the updated user
    await user.save();

    // Return success
    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update user preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    // Validate input
    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid preferences data'
      });
    }

    // Find the user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences (merge with existing)
    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    // Return success
    res.status(200).json({
      success: true,
      message: 'User preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update user identity structure
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUserIdentity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { identityStructure } = req.body;

    // Validate input
    if (!identityStructure || typeof identityStructure !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid identity data'
      });
    }

    // Find the user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update identity structure (merge with existing)
    // This allows updating individual identity components without replacing the entire structure
    Object.keys(identityStructure).forEach(key => {
      if (user.identityStructure[key]) {
        user.identityStructure[key] = {
          ...user.identityStructure[key],
          ...identityStructure[key]
        };
      }
    });

    await user.save();

    // Return success
    res.status(200).json({
      success: true,
      message: 'User identity updated successfully',
      identityStructure: user.identityStructure
    });
  } catch (error) {
    console.error('Error updating user identity:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Export all controller functions
/**
 * Synthesize a user's bio from their identity data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const synthesizeUserBio = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Import the bio synthesis service
    const bioSynthesisService = await import('../services/bioSynthesis.service.mjs');

    // Synthesize the bio
    const bio = await bioSynthesisService.synthesizeUserBio(userId);

    // Update the user's bio
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update the bio field
    user.profileData.bio = bio;
    await user.save();

    // Return success
    res.status(200).json({
      success: true,
      message: 'Bio synthesized successfully',
      bio
    });
  } catch (error) {
    console.error('Error synthesizing user bio:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export default {
  createUser,
  authenticateUser,
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  updateUserIdentity,
  synthesizeUserBio
};
