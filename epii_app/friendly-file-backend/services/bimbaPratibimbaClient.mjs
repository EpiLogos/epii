import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
// Removed CallToolResponseSchema import as it's not exported
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
// No longer need spawn/cross-spawn, transport handles it
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
// Path to the Bimba-Pratibimba MCP server executable (adjust if needed)
const BP_MCP_SERVER_PATH = path.resolve(__dirname, '../../../Cline/MCP/Bimba-Pratibimba-Memory-MCP/build/index.js');
const BP_MCP_SERVER_CWD = path.resolve(__dirname, '../../../Cline/MCP/Bimba-Pratibimba-Memory-MCP');

let mcpClient = null;
let clientReady = false;
let clientInitializationPromise = null;

/**
 * Initializes and connects the MCP client to the Bimba-Pratibimba server process.
 * Uses a promise to ensure initialization only happens once.
 */
const initializeClient = async () => {
    if (clientReady) {
        console.log("MCP Client already initialized.");
        return mcpClient;
    }
    if (clientInitializationPromise) {
        console.log("MCP Client initialization in progress, awaiting completion...");
        return clientInitializationPromise;
    }

    console.log("Initializing MCP Client for Bimba-Pratibimba Server (using SDK transport)...");
    clientInitializationPromise = new Promise(async (resolve, reject) => {
        try {
            // Define server parameters for the transport constructor per documentation
            const serverParams = {
                command: process.execPath, // Use absolute path to current node executable
                args: [BP_MCP_SERVER_PATH], // Pass script path as argument
                cwd: BP_MCP_SERVER_CWD, // Set working directory for the server script
                env: { ...process.env }, // Pass environment variables
                // stderr: 'inherit' // Default is 'inherit', use 'pipe' to capture programmatically if needed
            };
            console.log("StdioClientTransport parameters:", serverParams);

            // Create the transport - it handles spawning the process
            const transport = new StdioClientTransport(serverParams);

            // Create the MCP client instance *before* connecting transport
            // Use a generic name or make it configurable if needed
            mcpClient = new Client({ name: "epii-backend-client", version: "1.0.0" });

            // Handle client-level errors (e.g., protocol errors)
            mcpClient.onerror = (error) => {
                console.error("MCP Client Error:", error);
                clientReady = false;
                // Don't nullify mcpClient here, let transport errors handle process issues
                clientInitializationPromise = null; // Reset promise
                reject(new Error(`MCP Client error: ${error.message}`));
            };

             // Handle transport close event (process exited)
             transport.onclose = () => {
                 console.warn("MCP Transport closed (server process likely exited).");
                 clientReady = false;
                 mcpClient = null; // Client is no longer valid if transport closed
                 clientInitializationPromise = null;
                 // Optionally attempt reconnection or notify application
             };

             // Handle transport error event (e.g., spawn errors)
             transport.onerror = (error) => {
                 console.error("MCP Transport Error:", error);
                 clientReady = false;
                 mcpClient = null;
                 clientInitializationPromise = null;
                 // Reject the initialization promise if transport fails
                 reject(new Error(`MCP Transport error: ${error.message}`));
             };

            // Connect the client using the transport.
            // The connect method internally calls transport.start() which spawns the process.
            // It will throw if transport.start() fails (e.g., due to spawn error caught by transport.onerror).
            await mcpClient.connect(transport);

            // If connect succeeds without throwing:
            clientReady = true;
            console.log("MCP Client connected successfully to B-P Server.");
            resolve(mcpClient);

        } catch (error) {
            console.error("Error initializing MCP Client:", error);
            clientReady = false;
            mcpClient = null;
            clientInitializationPromise = null; // Reset promise on error
            reject(error);
        }
    });

    return clientInitializationPromise;
};

/**
 * Calls a tool on the connected Bimba-Pratibimba MCP server.
 * Ensures the client is initialized before making the call.
 *
 * @param {string} toolName - The name of the tool to call.
 * @param {object} args - The arguments for the tool.
 * @returns {Promise<any>} - A promise resolving to the tool's result content.
 * @throws {Error} If the client is not ready or the tool call fails.
 */
export const callBPMCPTool = async (toolName, args) => {
    console.log(`Attempting to call B-P MCP Tool: ${toolName}`);
    if (!clientReady || !mcpClient) {
        console.log("Client not ready, attempting initialization...");
        try {
            await initializeClient();
            if (!clientReady || !mcpClient) {
                 throw new Error("MCP Client initialization failed or client is not ready.");
            }
            console.log("Client initialized, proceeding with tool call.");
        } catch (initError) {
             console.error("Failed to initialize MCP client before tool call:", initError);
             throw new Error(`MCP Client unavailable: ${initError.message}`);
        }
    }

    try {
        const request = {
            method: CallToolRequestSchema.method,
            params: { name: toolName, arguments: args },
        };
        console.log(`Sending MCP request for tool ${toolName} with args:`, args);

        // Send the request and wait for the response
        // Removed the explicit response schema argument
        const response = await mcpClient.request(request);

        // Accessing result might need adjustment if the structure isn't guaranteed without the schema
        // Assuming the structure remains { result: { isError: boolean, content: [...] } }
        const result = response?.result; // Safely access result

        console.log(`Received MCP response for tool ${toolName}. IsError: ${result?.isError}`);

        if (result?.isError) {
            const errorContent = result.content?.[0]?.text || "Unknown MCP tool error";
            console.error(`B-P MCP Tool '${toolName}' returned an error:`, errorContent);
            throw new Error(`MCP Tool Error (${toolName}): ${errorContent}`);
        }

        // Assuming successful response content is primarily text
        const resultText = result?.content?.[0]?.text;
        if (resultText) {
            try {
                // Attempt to parse if it looks like JSON
                return JSON.parse(resultText);
            } catch (parseError) {
                // Return as plain text if not JSON
                return resultText;
            }
        } else {
            // Return the raw result if no text content found (might be structured differently)
            console.warn(`No text content found in response for tool ${toolName}. Returning raw result.`);
            return result; // Return the result part of the response
        }

    } catch (error) {
        console.error(`Error calling B-P MCP tool '${toolName}':`, error);
        // If the error came from the MCP client itself (e.g., connection issue)
        if (error instanceof Error && error.message.startsWith('MCP Client unavailable')) {
            throw error; // Re-throw initialization error
        }
        // If it was a tool error thrown above
        if (error instanceof Error && error.message.startsWith('MCP Tool Error')) {
             throw error;
        }
        // Otherwise, wrap it
        throw new Error(`Failed to call MCP tool ${toolName}: ${error.message}`);
    }
};

// Initialize the client on module load (optional, callBPMCPTool will handle it)
// initializeClient().catch(err => console.error("Initial MCP client connection failed:", err));

// Graceful shutdown handling (optional but recommended)
process.on('exit', () => {
    if (mcpClient) {
        console.log("Closing MCP client connection on exit.");
        mcpClient.close().catch(err => console.error("Error closing MCP client:", err));
    }
});
