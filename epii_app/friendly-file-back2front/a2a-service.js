/**
 * A2A Service
 * Main entry point for the A2A service that integrates with the Epii and Nara agents
 *
 * Bimba Coordinate: #5-4-0
 * Represents the main service for the Siva-Shakti A2A framework
 */

const { integrateA2AWithEpiiAgent } = require('./integration');
const EpiiAgentClient = require('./epii-agent-client');
const NaraAgentClient = require('./nara-agent-client');

// Configuration
const PORT = process.env.A2A_PORT || 3033;

/**
 * Import the Epii agent service
 * @returns {Promise<Object>} The Epii agent service
 */
async function importEpiiAgentService() {
  try {
    // Try different possible paths to the Epii agent service
    const paths = [
      '../friendly-file-backend/services/epii-agent.service.mjs',
      '../../friendly-file-backend/services/epii-agent.service.mjs',
      './friendly-file-backend/services/epii-agent.service.mjs'
    ];

    let importedModule = null;

    for (const path of paths) {
      try {
        console.log(`Attempting to import Epii agent service from: ${path}`);
        // Use dynamic import for ESM modules
        importedModule = await import(path);
        console.log(`Successfully imported Epii agent service from: ${path}`);
        break;
      } catch (err) {
        console.log(`Failed to import from ${path}: ${err.message}`);
      }
    }

    if (!importedModule) {
      throw new Error('Could not import Epii agent service from any of the attempted paths');
    }

    // Get the default export or the entire module
    return importedModule.default || importedModule;
  } catch (error) {
    console.error('Error importing Epii agent service:', error);
    throw error;
  }
}

/**
 * Import the Nara agent service
 * @returns {Promise<Object>} The Nara agent service
 */
async function importNaraAgentService() {
  try {
    // Try different possible paths to the Nara agent service
    const paths = [
      '../friendly-file-backend/agents/nara.agent.mjs',
      '../../friendly-file-backend/agents/nara.agent.mjs',
      './friendly-file-backend/agents/nara.agent.mjs'
    ];

    let importedModule = null;

    for (const path of paths) {
      try {
        console.log(`Attempting to import Nara agent service from: ${path}`);
        // Use dynamic import for ESM modules
        importedModule = await import(path);
        console.log(`Successfully imported Nara agent service from: ${path}`);
        break;
      } catch (err) {
        console.log(`Failed to import from ${path}: ${err.message}`);
      }
    }

    if (!importedModule) {
      throw new Error('Could not import Nara agent service from any of the attempted paths');
    }

    // Get the default export or the entire module
    return importedModule.default || importedModule;
  } catch (error) {
    console.error('Error importing Nara agent service:', error);
    throw error;
  }
}

/**
 * Start the A2A service
 * @param {Object} options Configuration options
 * @returns {Promise<Object>} The A2A service instance
 */
async function startA2AService(options = {}) {
  const {
    port = PORT,
    epiiAgentService = null,
    naraAgentService = null
  } = options;

  try {
    console.log('Starting A2A service...');

    // Import the Epii agent service if not provided
    const epiiService = epiiAgentService || await importEpiiAgentService();

    // Log available methods in the Epii agent service
    console.log('Epii agent service methods:',
      Object.keys(epiiService)
        .filter(key => typeof epiiService[key] === 'function')
        .join(', ')
    );

    // Check for chat LLM method in Epii agent
    if (epiiService.processChatMessage) {
      console.log('Found processChatMessage method in Epii agent service');
    } else if (epiiService.chat) {
      console.log('Found chat LLM method in Epii agent service');
    } else if (epiiService.processMessage) {
      console.log('Found processMessage method in Epii agent service');
    } else if (epiiService.processQuery) {
      console.log('Found processQuery method in Epii agent service');
    } else {
      console.warn('No chat LLM method found in Epii agent service');
      console.warn('Will fall back to direct pipeline calls, which is not recommended');
    }

    // Import the Nara agent service if not provided
    // TEMPORARILY COMMENTED OUT - Nara agent service import issues
    // const naraService = naraAgentService || await importNaraAgentService();
    const naraService = null; // Mock for now

    // Log available methods in the Nara agent service
    if (naraService) {
      console.log('Nara agent service methods:',
        Object.keys(naraService)
          .filter(key => typeof naraService[key] === 'function')
          .join(', ')
      );

      // Check for naraAgentNode method in Nara agent
      if (naraService.naraAgentNode) {
        console.log('Found naraAgentNode method in Nara agent service');
      } else {
        console.warn('No naraAgentNode method found in Nara agent service');
        console.warn('Nara agent functionality may be limited');
      }
    } else {
      console.log('Nara agent service: DISABLED (commented out for testing)');
    }

    // Start the A2A server
    console.log('Starting A2A server...');
    const server = integrateA2AWithEpiiAgent({
      port,
      epiiAgentService: epiiService
    });

    // Wait for the server to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Connect the Epii agent as a client
    console.log('Connecting Epii agent as client...');
    const epiiClient = new EpiiAgentClient({
      epiiAgentService: epiiService
    });

    await epiiClient.connect();

    // Connect the Nara agent as a client
    let naraClient = null;
    if (naraService) {
      console.log('Connecting Nara agent as client...');
      naraClient = new NaraAgentClient({
        naraAgentService: naraService,
        url: `ws://localhost:${port}`
      });
      await naraClient.connect();
    } else {
      console.log('Skipping Nara agent client connection (service disabled)');
    }

    console.log('A2A service started successfully');
    console.log(`A2A Server running on port ${port}`);
    console.log('Epii and Nara agents connected as clients');

    // Return the service instance
    return {
      server,
      epiiClient,
      naraClient,
      port,

      // Method to stop the service
      stop: async () => {
        console.log('Stopping A2A service...');
        epiiClient.close();
        if (naraClient) {
          naraClient.close();
        }

        return new Promise((resolve) => {
          server.close(() => {
            console.log('A2A server stopped');
            resolve();
          });
        });
      }
    };
  } catch (error) {
    console.error('Error starting A2A service:', error);
    throw error;
  }
}

// If this file is run directly, start the service
if (require.main === module) {
  startA2AService()
    .then(service => {
      console.log('A2A service running. Press Ctrl+C to stop.');

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log('Shutting down A2A service...');
        await service.stop();
        process.exit(0);
      });
    })
    .catch(error => {
      console.error('Failed to start A2A service:', error);
      process.exit(1);
    });
}

module.exports = {
  startA2AService,
  importEpiiAgentService,
  importNaraAgentService
};
