// Attempting import from the main package entry point
// import Mcp from '@modelcontextprotocol/sdk'; // Common pattern - COMMENTED OUT TO PREVENT STARTUP CRASH
// Assuming types might be exported directly or under a namespace
// const { McpClient, StdioClientTransport, McpError, ErrorCode } = Mcp; // Adjust if SDK exports differently - COMMENTED OUT

/**
 * Shared MCP Client Service
 *
 * Provides a unified interface for backend components to interact with tools
 * exposed by running MCP servers managed externally (likely via stdio).
 */
class SharedMcpClient {
    // Note: In a stdio setup, the client doesn't maintain persistent connections.
    // It typically invokes the server process for each call.
    // The external runner manages the server processes.

    /**
     * Calls a tool on a specified MCP server.
     * @param {string} serverName - The name/identifier of the target MCP server (e.g., 'Bimba-Pratibimba-Memory-MCP').
     * @param {string} toolName - The name of the tool to call (e.g., 'resolveBimbaCoordinate').
     * @param {object} args - An object containing the arguments for the tool.
     * @returns {Promise<object>} A promise that resolves with the tool's result object (parsed from response content),
     *                            or rejects with an error if the call fails or the tool returns an error.
     * @throws {McpError} Throws McpError on communication issues or if the tool itself returns an error response.
     */
    async useTool(serverName, toolName, args) {
        console.log(`[SharedMcpClient] Calling tool '${toolName}' on server '${serverName}' with args:`, args);

        // TODO: Determine how the client identifies the correct server process.
        // This might involve looking up the command/args from MCP settings or relying
        // on the external runner to route based on serverName.
        // For now, we assume the SDK handles this based on serverName if configured correctly externally.

        // We need a way to instantiate or get the client configured for the specific server.
        // This is a simplified example assuming a generic client can target servers by name.
        // The actual SDK might require a different setup.
        const client = new McpClient(); // Placeholder: Actual client instantiation might differ
        const transport = new StdioClientTransport(); // Placeholder: Transport might need server-specific config

        try {
            // Connect might not be needed per-call with stdio, depends on SDK implementation.
            // await client.connect(transport); // Placeholder

            const result = await client.callTool({
                // Need to map serverName to the actual server details if required by SDK
                // server: { name: serverName }, // Example if SDK needs server object
                toolName: toolName,
                arguments: args
            });

            console.log(`[SharedMcpClient] Raw result from ${serverName}/${toolName}:`, result);

            // await client.close(); // Placeholder: Close connection if needed

            if (result.isError) {
                const errorMessage = result.content?.[0]?.text || `MCP tool '${toolName}' returned an error.`;
                console.error(`[SharedMcpClient] Error from ${serverName}/${toolName}: ${errorMessage}`);
                // Throw an error consistent with how the rest of the backend handles errors
                throw new McpError(ErrorCode.OperationFailed, errorMessage);
            }

            // Attempt to parse the result content if it's JSON, otherwise return raw text
            const resultContent = result.content?.[0]?.text;
            if (!resultContent) {
                console.warn(`[SharedMcpClient] Tool ${serverName}/${toolName} returned no content.`);
                return {}; // Or null, depending on expected behavior
            }

            try {
                return JSON.parse(resultContent);
            } catch (parseError) {
                // If not JSON, return as plain text
                return { text: resultContent };
            }

        } catch (error) {
            console.error(`[SharedMcpClient] SDK Error calling ${serverName}/${toolName}:`, error);
            // await client.close(); // Ensure cleanup on error
            // Re-throw the error so the controller can handle it
            throw error; // Propagate the original error (could be McpError or other)
        }
    }
}

// Export a singleton instance
export const mcpClient = new SharedMcpClient();
console.log("Shared MCP Client Service initialized (using SDK placeholders).");
