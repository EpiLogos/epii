/**
 * Epii Agent Service Adapter
 * Adapts the actual Epii agent service to the interface expected by the A2A adapter
 * 
 * Bimba Coordinate: #5-4-5
 * Represents the service adapter for the Epii Agent within the Siva-Shakti layer
 */

/**
 * Creates an adapter for the Epii agent service that conforms to the interface
 * expected by the A2A adapter
 * 
 * @param {Object} epiiAgentService The actual Epii agent service
 * @returns {Object} An adapter that implements the expected interface
 */
function createEpiiAgentServiceAdapter(epiiAgentService) {
  if (!epiiAgentService) {
    throw new Error('Epii agent service is required');
  }

  return {
    /**
     * Process a chat message using the Epii agent
     * 
     * @param {string} message The message to process
     * @param {Object} state The initial state
     * @returns {Promise<Object>} The processing result
     */
    processChatMessage: async (message, state) => {
      console.log(`Processing chat message through Epii agent: ${message.substring(0, 100)}...`);
      
      try {
        // Prepare the initial state for the Epii agent pipeline
        const initialState = {
          ...state,
          query: message,
          mode: 'epii',
          run_direction: 'analysis'
        };
        
        // Run the Epii agent's analysis pipeline
        const result = await epiiAgentService.runAnalysisPipeline(initialState);
        
        // Extract the final result from the pipeline output
        const finalResult = result.stage0Result || result.notionUpdatePayload || {};
        
        // Format the result in the expected structure
        return {
          epiiPerspective: finalResult.content || finalResult.response || finalResult.epiiPerspective || 
                          `Epii perspective on: ${message}`,
          processingStage: 'Analysis complete',
          bimbaCoordinates: finalResult.bimbaCoordinates || ['#5-0', '#5-1', '#5-2'],
          metadata: {
            ...finalResult.metadata,
            analysisSessionId: result.analysisSessionId,
            qlStage: 5
          }
        };
      } catch (error) {
        console.error('Error in processChatMessage:', error);
        throw error;
      }
    },
    
    /**
     * Process a philosophical framing request using the Epii agent
     * This maps to the Epii agent's lens application functionality
     * 
     * @param {string} concept The concept to frame
     * @param {Object} state The initial state
     * @returns {Promise<Object>} The framing result
     */
    processPhilosophicalFraming: async (concept, state) => {
      console.log(`Processing philosophical framing for: ${concept}`);
      
      try {
        // Check if the Epii agent has a dedicated lens method
        if (epiiAgentService.applyEpiiLens) {
          // Use the dedicated lens method if available
          const lensResult = await epiiAgentService.applyEpiiLens(concept, state);
          
          return {
            response: lensResult.content || lensResult.response || 
                     `Philosophical framing of ${concept} within the Quaternary Logic framework`,
            processingStage: 'Lens application complete',
            bimbaCoordinates: lensResult.bimbaCoordinates || ['#5-1', '#1-0', '#1-1'],
            metadata: {
              ...lensResult.metadata,
              quaternaryLogicMapping: lensResult.quaternaryLogicMapping || {
                aLogos: 'Potential state',
                proLogos: 'Initial manifestation',
                diaLogos: 'Relational dynamics',
                logos: 'Structural integration',
                epiLogos: 'Meta-synthesis',
                anALogos: 'Recursive return'
              }
            }
          };
        } else {
          // Fall back to the general processing method with a framing prompt
          const framingPrompt = `Apply the Quaternary Logic framework to provide a philosophical framing of the concept: ${concept}`;
          
          // Use the chat message processing with a specialized prompt
          return await this.processChatMessage(framingPrompt, {
            ...state,
            mode: 'lens',
            targetLens: 'philosophical'
          });
        }
      } catch (error) {
        console.error('Error in processPhilosophicalFraming:', error);
        throw error;
      }
    },
    
    /**
     * Validate a Notion payload using the Epii agent
     * 
     * @param {Object|string} payload The payload to validate
     * @param {Object} state The initial state
     * @returns {Promise<Object>} The validation result
     */
    validateNotionPayload: async (payload, state) => {
      console.log(`Validating Notion payload`);
      
      try {
        // Parse the payload if it's a string
        const parsedPayload = typeof payload === 'string' ? 
          JSON.parse(payload) : payload;
        
        // Check if the Epii agent has a dedicated validation method
        if (epiiAgentService.validateCrystallization) {
          // Use the dedicated validation method if available
          const validationResult = await epiiAgentService.validateCrystallization(parsedPayload, state);
          
          return {
            response: validationResult.message || 'Validation complete',
            processingStage: 'Validation complete',
            bimbaCoordinates: validationResult.bimbaCoordinates || ['#5-0', '#5-5'],
            metadata: {
              isValid: validationResult.isValid !== false,
              validationMessage: validationResult.message || 'Validation passed',
              ...validationResult.metadata
            }
          };
        } else {
          // Fall back to a general validation approach
          // This is a simplified validation that checks for required fields
          const isValid = parsedPayload && 
                         (parsedPayload.title || parsedPayload.content) && 
                         (parsedPayload.bimbaCoordinates || parsedPayload.targetCoordinate);
          
          return {
            response: isValid ? 'Validation passed' : 'Validation failed: Missing required fields',
            processingStage: 'Validation complete',
            bimbaCoordinates: ['#5-0', '#5-5'],
            metadata: {
              isValid,
              validationMessage: isValid ? 'Payload structure is valid for crystallization' : 
                                'Missing required fields for crystallization'
            }
          };
        }
      } catch (error) {
        console.error('Error in validateNotionPayload:', error);
        
        // Return a validation failure
        return {
          response: `Validation error: ${error.message}`,
          processingStage: 'Validation failed',
          bimbaCoordinates: ['#5-0', '#5-5'],
          metadata: {
            isValid: false,
            validationMessage: `Error during validation: ${error.message}`
          }
        };
      }
    }
  };
}

module.exports = createEpiiAgentServiceAdapter;
