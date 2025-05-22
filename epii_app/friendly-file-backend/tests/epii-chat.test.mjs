/**
 * Test script for the Epii chat functionality
 * 
 * This script tests the Epii chat functionality by:
 * 1. Creating a test analysis session
 * 2. Sending a test chat message
 * 3. Verifying the response
 * 
 * Run with: node tests/epii-chat.test.mjs
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import epiiAgentService from '../services/epii-agent.service.mjs';

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Create a test analysis session
async function createTestAnalysisSession() {
  try {
    // Import the AnalysisSession model
    const { default: AnalysisSession } = await import('../models/AnalysisSession.model.mjs');
    
    // Generate a unique session ID
    const sessionId = `test-session-${uuidv4()}`;
    
    // Create a test document
    const testDocument = `
    # Test Document for Epii Analysis
    
    This is a test document for the Epii analysis pipeline. It contains some sample content
    that will be used to test the chat functionality.
    
    ## Section 1: Introduction
    
    The Epii analysis pipeline is designed to analyze documents and provide insights based on
    the quaternary logic framework. It follows the recursive 5/0 context frame, moving from
    the broadest context to core insights and back to a synthesized understanding.
    
    ## Section 2: Methodology
    
    The analysis follows the Meta-Techne loop:
    - Ingest: Receive the document
    - Tag: Identify key elements
    - Embed: Place in the quaternary framework
    - Store: Save in the knowledge base
    - Retrieve: Access when needed
    - Synthesize: Create a unified understanding
    - Crystallize: Formalize the insights
    
    ## Section 3: Conclusion
    
    This test document demonstrates the capabilities of the Epii analysis pipeline and
    provides a foundation for testing the chat functionality.
    `;
    
    // Create the test session
    const testSession = new AnalysisSession({
      sessionId,
      userId: 'test-user',
      documentId: 'test-document',
      targetCoordinate: '#5-2-1',
      status: 'complete',
      results: {
        overallSummary: 'This is a test document for the Epii analysis pipeline.',
        extractedMappings: [
          {
            mappingType: 'section',
            mappingValue: 'Introduction',
            reasoning: 'Introduces the Epii analysis pipeline'
          },
          {
            mappingType: 'section',
            mappingValue: 'Methodology',
            reasoning: 'Describes the Meta-Techne loop'
          },
          {
            mappingType: 'section',
            mappingValue: 'Conclusion',
            reasoning: 'Summarizes the purpose of the test document'
          }
        ],
        identifiedVariations: []
      },
      startedAt: new Date(),
      completedAt: new Date()
    });
    
    // Save the test session
    await testSession.save();
    console.log(`Created test analysis session with ID: ${sessionId}`);
    
    return { sessionId, documentContent: testDocument };
  } catch (error) {
    console.error('Error creating test analysis session:', error);
    throw error;
  }
}

// Test the chat functionality
async function testEpiiChat(sessionId, documentContent) {
  try {
    console.log('Testing Epii chat functionality...');
    
    // Test message
    const testMessage = 'Can you explain the Meta-Techne loop mentioned in the document?';
    
    // Send the test message
    const response = await epiiAgentService.processChatInAnalysisSession(
      testMessage,
      sessionId,
      'test-user',
      documentContent
    );
    
    console.log('Chat response:');
    console.log(response.epiiPerspective);
    
    return response;
  } catch (error) {
    console.error('Error testing Epii chat:', error);
    throw error;
  }
}

// Clean up the test session
async function cleanupTestSession(sessionId) {
  try {
    // Import the models
    const { default: AnalysisSession } = await import('../models/AnalysisSession.model.mjs');
    const { default: ChatMessage } = await import('../models/ChatMessage.model.mjs');
    
    // Delete the test session
    await AnalysisSession.deleteOne({ sessionId });
    
    // Delete the chat messages
    await ChatMessage.deleteMany({ analysisSessionId: sessionId });
    
    console.log(`Cleaned up test session: ${sessionId}`);
  } catch (error) {
    console.error('Error cleaning up test session:', error);
  }
}

// Main function
async function main() {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Create a test analysis session
    const { sessionId, documentContent } = await createTestAnalysisSession();
    
    // Test the chat functionality
    await testEpiiChat(sessionId, documentContent);
    
    // Clean up the test session
    await cleanupTestSession(sessionId);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
main();
