import epiiLLMService from './epii-llm.service.mjs';
import mefTemplatesService from './mef-templates.service.mjs';
import { getPromptForStage } from '../5_integration/prompts/epii-agent-prompts.mjs';
import bpMCPService from '../../../databases/bpmcp/bpMCP.service.mjs';
import documentService from '../../../databases/shared/services/documentService.mjs';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import axios from 'axios';

/**
 * Service for the Epii agent that handles document analysis
 */
class EpiiAgentService {
  constructor() {
    console.log("Epii Agent Service initialized.");

    // Initialize the synthesis LLM
    this.initializeSynthesisLLM();

    // Initialize BPMCP tools
    this.initializeTools();
  }

  /**
   * Initialize the synthesis LLM
   */
  initializeSynthesisLLM() {
    try {
      // Use the same model as the +5 synthesis LLM
      const activeModelVarName = process.env.ACTIVE_SYNTHESIS_MODEL || 'SYNTHESIS_LLM_MODEL_FREE';
      const synthesisModelName = process.env[activeModelVarName] || 'gemini-2.5-pro';

      this.synthesisLLM = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: synthesisModelName,
        temperature: 0.7, // Slightly higher temperature for chat
        maxOutputTokens: 4096,
      });

      console.log(`Synthesis LLM initialized with model: ${synthesisModelName}`);
    } catch (error) {
      console.error("Failed to initialize Synthesis LLM:", error);
      this.synthesisLLM = null;
    }
  }

  /**
   * Initialize BPMCP tools
   */
  initializeTools() {
    // Load LightRAG MCP server URL from environment variables
    const LIGHTRAG_MCP_SERVER_URL = process.env.LIGHTRAG_MCP_SERVER_URL || "http://localhost:8001";

    // Define BPMCP tools
    this.tools = [
      // Bimba Knowledge Tool (Primary Architectural Context Tool)
      new DynamicStructuredTool({
        name: "bimbaKnowing",
        description: "Retrieve architectural context from the Bimba graph using semantic search and graph traversal. This is the primary tool for understanding system architecture and relationships.",
        schema: z.object({
          query: z.string().describe("Natural language query about system architecture or concepts."),
          contextDepth: z.number().int().min(1).max(5).default(3).describe("Depth of graph traversal for context (1-5 hops, default: 3)."),
          focusCoordinate: z.string().optional().describe("Optional Bimba coordinate to focus search (e.g., '#5-2')."),
          agentCoordinate: z.string().optional().describe("Agent's home coordinate for branch awareness (e.g., '#5' for Epii).")
        }),
        func: async (args) => {
          try {
            console.log(`Calling bimbaKnowing tool with query: "${args.query.substring(0, 50)}..."`);

            // For Epii agent, always use '#5' as the agent coordinate if not specified
            const agentCoordinate = args.agentCoordinate || '#5';

            // Use the convenience method from bpMCPService
            // Convert contextDepth to an integer
            const contextDepth = args.contextDepth ? Math.floor(Number(args.contextDepth)) : 3;

            // Use 12 (integer) for more comprehensive branch awareness
            const result = await bpMCPService.bimbaKnowing(
              args.query,
              contextDepth,
              args.focusCoordinate,
              agentCoordinate,
              12 // Use integer value - server will convert to Neo4j integer
            );

            // Handle the result based on its format
            let formattedResult;

            if (typeof result === 'string') {
              try {
                // Try to parse the string as JSON
                const parsedResult = JSON.parse(result);
                // Format the parsed result
                formattedResult = this.formatBimbaContext(parsedResult);
              } catch (parseError) {
                // If parsing fails, return the string directly
                return result;
              }
            } else if (result && typeof result === 'object') {
              // Check if the result has the expected MCP structure
              if (result.content && Array.isArray(result.content) && result.content.length > 0) {
                const contentItem = result.content[0];
                if (contentItem && contentItem.type === 'text' && contentItem.text) {
                  try {
                    // Parse the text content as JSON
                    const parsedContent = JSON.parse(contentItem.text);
                    // Format the parsed content
                    formattedResult = this.formatBimbaContext(parsedContent);
                  } catch (parseError) {
                    // If parsing fails, return the text content directly
                    return contentItem.text;
                  }
                } else {
                  // Return a simple formatted version of the content
                  return this.formatSimpleBimbaContext({
                    query: args.query,
                    results: result.content
                  });
                }
              } else {
                // Format the result object directly
                formattedResult = this.formatBimbaContext(result);
              }
            } else {
              // Fallback for unexpected result format
              return `Received bimbaKnowing results in unexpected format: ${typeof result}`;
            }

            return formattedResult;
          } catch (error) {
            console.error("Error calling bimbaKnowing tool:", error.message);
            return `Error retrieving architectural context: ${error.message}`;
          }
        }
      }),

      // LightRAG Retrieval Tool
      new DynamicStructuredTool({
        name: "lightragRetrieve",
        description: "Retrieve context using LightRAG's fused graph+vector retrieval. This tool combines semantic search with graph traversal for comprehensive context retrieval.",
        schema: z.object({
          query: z.string().describe("The query to search for context."),
          bimbaCoordinates: z.array(z.string()).optional().describe("Optional array of Bimba coordinates to focus the search.")
        }),
        func: async (args) => {
          try {
            console.log(`Calling LightRAG retrieve endpoint: ${LIGHTRAG_MCP_SERVER_URL}/retrieve`);

            // Use direct LightRAG call for this tool (legacy support)
            // For comprehensive context, use the epii-chat skill which handles UnifiedRAG properly
            const response = await fetch(`${LIGHTRAG_MCP_SERVER_URL}/retrieve`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: args.query,
                mode: args.mode || "global",
                top_k: args.top_k || 15
              })
            });

            if (!response.ok) {
              throw new Error(`LightRAG server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Received context from LightRAG:", data ? JSON.stringify(data).substring(0, 100) + '...' : 'null');

            return data?.content || data?.result || "No context found.";
          } catch (error) {
            console.error("Error calling LightRAG retrieve endpoint:", error.message);
            return `Error calling LightRAG: ${error.message}`;
          }
        }
      }),

      // Bimba Graph Tools (Legacy - will be deprecated in favor of bimbaKnowing)
      new DynamicStructuredTool({
        name: "queryBimbaGraph",
        description: "Execute a Cypher query against the Neo4j Bimba graph.",
        schema: z.object({
          query: z.string().describe("The Cypher query to execute."),
          params: z.record(z.any()).optional().describe("Query parameters.")
        }),
        func: async (args) => {
          const result = await bpMCPService.queryBimbaGraph(args.query, args.params);
          return JSON.stringify(result);
        }
      }),

      // Node Overview Tool
      new DynamicStructuredTool({
        name: "getNodeOverview",
        description: "Get properties and direct connections for a specific Bimba node.",
        schema: z.object({
          bimbaCoordinate: z.string().describe("The Bimba coordinate (e.g., '#5-2').")
        }),
        func: async (args) => {
          const result = await bpMCPService.getNodeOverview(args.bimbaCoordinate);
          return JSON.stringify(result);
        }
      }),

      // Inspiration Tool
      new DynamicStructuredTool({
        name: "getInspiration",
        description: "Get curated inspiration based on a topic.",
        schema: z.object({
          query: z.string().describe("The topic to get inspiration for."),
          coordinateFilter: z.array(z.string()).optional().describe("Optional array of Bimba coordinates to filter by."),
          limit: z.number().optional().describe("Maximum number of results.")
        }),
        func: async (args) => {
          // Ensure limit is an integer if provided
          const limit = args.limit ? Math.floor(Number(args.limit)) : undefined;
          const result = await bpMCPService.getInspiration(args.query, args.coordinateFilter, limit);
          return JSON.stringify(result);
        }
      }),

      // Semantic Search Tool
      new DynamicStructuredTool({
        name: "searchPratibimbaContext",
        description: "Search for semantic context within the vector store.",
        schema: z.object({
          query: z.string().describe("The query to search for."),
          collection: z.string().optional().describe("The collection to search in."),
          limit: z.number().optional().describe("Maximum number of results.")
        }),
        func: async (args) => {
          // Create a copy of args to modify
          const modifiedArgs = { ...args };

          // Ensure limit is an integer if provided
          if (typeof modifiedArgs.limit === 'number') {
            modifiedArgs.limit = Math.floor(modifiedArgs.limit);
          }

          const result = await bpMCPService.searchPratibimbaContext(modifiedArgs);
          return JSON.stringify(result);
        }
      }),

      // Document Tools
      new DynamicStructuredTool({
        name: "getDocumentById",
        description: "Get a document by its ID.",
        schema: z.object({
          documentId: z.string().describe("The ID of the document to retrieve.")
        }),
        func: async (args) => {
          const result = await bpMCPService.getDocumentById(args.documentId);
          return JSON.stringify(result);
        }
      }),

      new DynamicStructuredTool({
        name: "listDocumentsByCoordinate",
        description: "List documents associated with a Bimba coordinate.",
        schema: z.object({
          coordinate: z.string().describe("The Bimba coordinate."),
          limit: z.number().optional().describe("Maximum number of documents to return.")
        }),
        func: async (args) => {
          // Ensure limit is an integer if provided
          const limit = args.limit ? Math.floor(Number(args.limit)) : undefined;
          const result = await bpMCPService.listDocumentsByCoordinate(args.coordinate, limit);
          return JSON.stringify(result);
        }
      }),

      new DynamicStructuredTool({
        name: "updateDocumentContent",
        description: "Update the content of a document in the canvas. This allows you to modify the document that's currently being viewed.",
        schema: z.object({
          documentId: z.string().describe("The ID of the document to update."),
          content: z.string().describe("The new content to set for the document."),
          appendOnly: z.boolean().optional().describe("If true, append the content to the existing document instead of replacing it.")
        }),
        func: async (args) => {
          try {
            // Ensure we have a valid document ID
            if (!args.documentId) {
              throw new Error("Document ID is required");
            }

            // Use the document ID exactly as provided
            const documentId = args.documentId;

            console.log(`Attempting to update document with ID: ${documentId}`);

            // Trust the content provided by the frontend
            // Don't try to get the document from MongoDB first

            // Set the content based on the appendOnly flag
            let finalContent;

            if (args.appendOnly) {
              console.log(`Append operation requested for document ${documentId}`);
              console.log(`Content to append: ${args.content.substring(0, 50)}...`);

              // Get the current document content from MongoDB
              try {
                const currentDoc = await bpMCPService.getDocumentById(documentId);

                if (currentDoc && Array.isArray(currentDoc) && currentDoc.length > 0) {
                  const existingContent = currentDoc[0].textContent || '';
                  finalContent = existingContent.trim() + '\n\n' + args.content.trim();
                  console.log(`Appending to existing content (${existingContent.length} chars) + (${args.content.length} chars)`);
                } else {
                  console.warn(`Document not found or empty, using new content only`);
                  finalContent = args.content;
                }
              } catch (error) {
                console.warn(`Error retrieving document for append: ${error.message}`);
                finalContent = args.content;
              }
            } else {
              console.log(`Replace operation requested for document ${documentId}`);
              console.log(`New content length: ${args.content.length} chars`);
              finalContent = args.content;
            }

            // Create the update operation
            const update = {
              $set: {
                textContent: finalContent,
                lastModified: new Date()
              },
              $push: {
                versions: {
                  timestamp: new Date(),
                  content: finalContent,
                  source: 'epii-agent'
                }
              }
            };

            // Update the document using BPMCP service only
            try {
              // Use BPMCP service directly
              await bpMCPService.updateDocument(documentId, update);
              console.log(`Document ${documentId} updated successfully with BPMCP service`);

              // Notify the frontend to refresh the document content
              return JSON.stringify({
                success: true,
                message: args.appendOnly ? "Content appended to document successfully" : "Document content updated successfully",
                documentId: documentId,
                content: finalContent, // Include the final content in the response
                appendOnly: args.appendOnly, // Include whether this was an append operation
                appendedContent: args.appendOnly ? args.content : null // Include the appended content for frontend use
              });
            } catch (updateError) {
              console.error(`Error updating document ${documentId}:`, updateError);

              // Try to create a new document if update fails
              console.log(`Attempting to create new document since update failed`);
              try {
                const document = {
                  originalName: "Document from Epii Agent",
                  fileName: "Document from Epii Agent",
                  title: "Document from Epii Agent", // Explicitly set title field to match the schema
                  mimeType: 'text/plain',
                  size: finalContent.length,
                  uploadDate: new Date(),
                  targetCoordinate: null,
                  userId: 'epii-agent',
                  textContent: finalContent,
                  analysisStatus: 'pending'
                };

                const createResult = await bpMCPService.storeDocument(document);
                console.log(`Created new document instead:`, createResult);

                // Parse the result to get the document ID
                let newDocId;
                try {
                  if (typeof createResult === 'string') {
                    const parsed = JSON.parse(createResult);
                    newDocId = parsed._id;
                  } else if (createResult._id) {
                    newDocId = createResult._id;
                  }
                } catch (parseError) {
                  console.warn(`Error parsing create result: ${parseError.message}`);
                  newDocId = createResult;
                }

                return JSON.stringify({
                  success: true,
                  message: "Created new document with content",
                  documentId: newDocId,
                  content: finalContent // Include the content in the response
                });
              } catch (createError) {
                console.error("Error creating fallback document:", createError);
                throw updateError; // Re-throw the original error
              }
            }
          } catch (error) {
            console.error("Error updating document content:", error);
            return JSON.stringify({
              success: false,
              error: error.message,
              documentId: args.documentId
            });
          }
        }
      }),

      new DynamicStructuredTool({
        name: "createDocument",
        description: "Create a new document in the canvas. This allows you to create a new document with the specified content and associate it with a Bimba coordinate.",
        schema: z.object({
          name: z.string().describe("The name of the document."),
          content: z.string().describe("The content of the document."),
          targetCoordinate: z.string().optional().describe("The Bimba coordinate to associate with the document."),
          userId: z.string().optional().describe("The user ID to associate with the document.")
        }),
        func: async (args) => {
          try {
            // Create document object
            const document = {
              originalName: args.name,
              fileName: args.name,
              title: args.name, // Explicitly set title field to match the schema
              mimeType: 'text/plain',
              size: args.content.length,
              uploadDate: new Date(),
              targetCoordinate: args.targetCoordinate || null,
              userId: args.userId || 'epii-agent',
              textContent: args.content,
              analysisStatus: 'pending'
            };

            // Store document using BPMCP service
            const result = await bpMCPService.storeDocument(document);

            // Parse the result
            let parsedResult;
            try {
              if (typeof result === 'string') {
                parsedResult = JSON.parse(result);
              } else if (result.content && result.content[0] && result.content[0].text) {
                parsedResult = JSON.parse(result.content[0].text);
              } else {
                parsedResult = result;
              }
            } catch (parseError) {
              console.error("Error parsing document creation result:", parseError);
              parsedResult = result;
            }

            return JSON.stringify({
              success: true,
              message: "Document created successfully",
              document: parsedResult
            });
          } catch (error) {
            console.error("Error creating document:", error);
            return JSON.stringify({
              success: false,
              error: error.message
            });
          }
        }
      }),

      // Notion Tools
      new DynamicStructuredTool({
        name: "resolveBimbaCoordinate",
        description: "Resolve a Bimba coordinate to its associated Notion page URL. Simple conversion: targetCoordinate -> Neo4j lookup for notionPageId -> Notion URL.",
        schema: z.object({
          targetCoordinate: z.string().describe("The Bimba coordinate to resolve to a Notion page URL (e.g., '#5-2-1').")
        }),
        func: async (args) => {
          try {
            const result = await this.bpMCPService.callTool('resolveBimbaCoordinate', { targetCoordinate: args.targetCoordinate });
            return JSON.stringify(result, null, 2);
          } catch (error) {
            console.error('Error calling resolveBimbaCoordinate:', error);
            throw error;
          }
        }
      }),

      new DynamicStructuredTool({
        name: "appendNotionBlock",
        description: "Append blocks to a Notion page.",
        schema: z.object({
          notionPageId: z.string().describe("The ID of the Notion page."),
          blocksToAppend: z.array(
            z.object({
              type: z.string().describe("The type of block (e.g., 'paragraph', 'heading_1', etc.)"),
              // Define specific properties for each block type
              paragraph: z.object({
                rich_text: z.array(
                  z.object({
                    type: z.string().describe("The type of text (e.g., 'text')"),
                    text: z.object({
                      content: z.string().describe("The text content")
                    })
                  })
                ).optional()
              }).optional(),
              heading_1: z.object({
                rich_text: z.array(
                  z.object({
                    type: z.string(),
                    text: z.object({
                      content: z.string()
                    })
                  })
                ).optional()
              }).optional(),
              heading_2: z.object({
                rich_text: z.array(
                  z.object({
                    type: z.string(),
                    text: z.object({
                      content: z.string()
                    })
                  })
                ).optional()
              }).optional(),
              heading_3: z.object({
                rich_text: z.array(
                  z.object({
                    type: z.string(),
                    text: z.object({
                      content: z.string()
                    })
                  })
                ).optional()
              }).optional(),
              bulleted_list_item: z.object({
                rich_text: z.array(
                  z.object({
                    type: z.string(),
                    text: z.object({
                      content: z.string()
                    })
                  })
                ).optional()
              }).optional(),
              numbered_list_item: z.object({
                rich_text: z.array(
                  z.object({
                    type: z.string(),
                    text: z.object({
                      content: z.string()
                    })
                  })
                ).optional()
              }).optional(),
              code: z.object({
                rich_text: z.array(
                  z.object({
                    type: z.string(),
                    text: z.object({
                      content: z.string()
                    })
                  })
                ).optional(),
                language: z.string().optional()
              }).optional(),
              divider: z.object({}).optional(),
              // Allow for other block types
            }).passthrough()
          ).describe("Array of Notion block objects to append to the page.")
        }),
        func: async (args) => {
          const result = await bpMCPService.appendNotionBlock(args.notionPageId, args.blocksToAppend);
          return JSON.stringify(result);
        }
      }),

      new DynamicStructuredTool({
        name: "getNotionPageProperties",
        description: "Get properties of a Notion page.",
        schema: z.object({
          notionPageId: z.string().describe("The ID of the Notion page."),
          fetchFileFromProperty: z.string().optional().describe("Optional property to fetch file from.")
        }),
        func: async (args) => {
          const result = await bpMCPService.getNotionPageProperties(args.notionPageId, args.fetchFileFromProperty);
          return JSON.stringify(result);
        }
      })
    ];

    console.log(`Initialized ${this.tools.length} BPMCP tools`);
  }

  // This method has been removed as part of the architectural cleanup.
  // The Epii Agent Service now delegates to the official Epii Analysis Pipeline
  // and no longer implements its own version of the pipeline stages.

  /**
   * Gets the parent coordinate of a given coordinate.
   *
   * @param {string} coordinate - The coordinate
   * @returns {string|null} - The parent coordinate or null if no parent
   */
  getParentCoordinate(coordinate) {
    // If the coordinate is just "#", it has no parent
    if (coordinate === '#') return null;

    // Split the coordinate by "-"
    const parts = coordinate.split('-');

    // If there's only one part (e.g., "#5"), the parent is "#"
    if (parts.length === 1) return '#';

    // Otherwise, remove the last part and join the rest
    return parts.slice(0, -1).join('-');
  }

  /**
   * Checks if a coordinate is a child of another coordinate.
   *
   * @param {string} childCoord - The potential child coordinate
   * @param {string} parentCoord - The potential parent coordinate
   * @returns {boolean} - True if childCoord is a direct child of parentCoord
   */
  isChildCoordinate(childCoord, parentCoord) {
    // If either coordinate is not provided, return false
    if (!childCoord || !parentCoord) return false;

    // If childCoord is the same as parentCoord, it's not a child
    if (childCoord === parentCoord) return false;

    // Check if childCoord starts with parentCoord and has exactly one more segment
    const parentParts = parentCoord.split('-');
    const childParts = childCoord.split('-');

    return childCoord.startsWith(parentCoord + '-') && childParts.length === parentParts.length + 1;
  }

  // This method has been removed as part of the architectural cleanup.
  // The Epii Agent Service now delegates to the official Epii Analysis Pipeline
  // and no longer implements its own version of the pipeline stages.

  /**
   * Process a chat message in the context of document analysis
   * @param {string} message - The user's message
   * @param {object} state - The current state of the pipeline
   * @returns {Promise<object>} - The updated state with the agent's response
   */
  /**
   * Get Bimba context for a query
   * @param {string} query - The query to get context for
   * @param {object} state - The current state
   * @returns {Promise<string>} - Formatted Bimba context
   */
  async getBimbaContext(query, state) {
    try {
      console.log(`Getting Bimba context for query: "${query.substring(0, 50)}..."`);

      // Use the bimbaKnowing tool directly instead of the service
      // This ensures we use the same simplified format
      const bimbaKnowingTool = this.tools.find(t => t.name === 'bimbaKnowing');
      if (!bimbaKnowingTool) {
        console.warn("bimbaKnowing tool not found");
        return "# Bimba Context\n\nUnable to retrieve Bimba context: tool not found.";
      }

      // Preserve the original query, especially important for names like "epii"
      // Only trim whitespace and ensure it's not too long
      const finalQuery = query.trim().substring(0, 500);

      console.log(`Using cleaned query for bimbaKnowing: "${finalQuery.substring(0, 50)}..."`);

      // Use a higher contextDepth to get more comprehensive results
      const result = await bimbaKnowingTool.invoke({
        query: finalQuery,
        contextDepth: 5, // Increased from 3 to 5 for more comprehensive context
        focusCoordinate: state.focusCoordinate,
        agentCoordinate: '#5',
        includeRelations: true // Explicitly request relationship data
      });

      console.log(`Received bimbaKnowing result type: ${typeof result}`);

      // Handle the result based on its type and format
      let bimbaData;
      if (!result) {
        console.warn("Empty result from bimbaKnowing");
        return "# Bimba Context\n\nNo Bimba context available.";
      }

      // Check if result has the BPMCP tool format: { content: [{ type: "text", text: "..." }] }
      if (result && result.content && Array.isArray(result.content) && result.content[0] && result.content[0].text) {
        try {
          // Parse the JSON from the BPMCP tool format
          bimbaData = JSON.parse(result.content[0].text);
          console.log(`Successfully parsed BPMCP tool result format`);
        } catch (parseError) {
          console.error("Error parsing BPMCP tool result:", parseError);
          return "# Bimba Context\n\nUnable to parse Bimba context from BPMCP tool result.";
        }
      }
      // If it's a string, try to parse it as JSON
      else if (typeof result === 'string') {
        try {
          // Check if it looks like JSON
          if (result.trim().startsWith('{') || result.trim().startsWith('[')) {
            bimbaData = JSON.parse(result);
          } else {
            // If it's not JSON, return it directly as text
            return `# Bimba Context\n\n${result}`;
          }
        } catch (parseError) {
          console.error("Error parsing bimbaKnowing string result:", parseError);
          // Return a simplified version of the string if it's too long
          const truncatedResult = result.length > 1000 ? result.substring(0, 1000) + "..." : result;
          return `# Bimba Context\n\n${truncatedResult}`;
        }
      } else if (typeof result === 'object') {
        // If it's already an object, use it directly
        bimbaData = result;
      } else {
        console.warn(`Unexpected result type from bimbaKnowing: ${typeof result}`);
        return "# Bimba Context\n\nUnable to process Bimba context: unexpected format.";
      }

      // Format the branch hierarchy and distribution into a structured context
      // Use the more comprehensive formatBimbaContext instead of formatSimpleBimbaContext
      return this.formatBimbaContext(bimbaData);
    } catch (error) {
      console.error("Error getting Bimba context:", error.message);
      return "# Bimba Context\n\nUnable to retrieve Bimba context due to an error.";
    }
  }

  /**
   * Process the raw result from bimbaKnowing to extract relationships and structure
   * @param {object} result - The raw result from bimbaKnowing
   * @param {object} args - The original arguments passed to bimbaKnowing
   * @returns {string} - JSON string of the processed result
   */
  processBimbaKnowingResult(result, args) {
    try {
      console.log(`Processing bimbaKnowing results with ${result?.results?.length || 0} matches`);

      // Log the structure of the result for debugging
      console.log(`Result structure: ${JSON.stringify(Object.keys(result || {}))}`);

      // Extract relationships from the results
      const relationships = [];
      const nodeMap = new Map(); // To track unique nodes

      // Process each result to extract relationships
      if (result.results && Array.isArray(result.results)) {
        result.results.forEach(r => {
          // Add the matched node to the node map
          if (r.matchedNode && r.matchedNode.properties) {
            const nodeId = r.matchedNode.properties.bimbaCoordinate || r.matchedNode.properties.name;
            if (nodeId && !nodeMap.has(nodeId)) {
              // Extract all properties except embedding
              const properties = {};
              for (const key in r.matchedNode.properties) {
                if (key === 'embedding') continue;
                if (neo4j && neo4j.isInt && neo4j.isInt(r.matchedNode.properties[key])) {
                  properties[key] = r.matchedNode.properties[key].toNumber();
                } else {
                  properties[key] = r.matchedNode.properties[key];
                }
              }

              // Extract description from various properties
              const description =
                r.matchedNode.properties.description ||
                r.matchedNode.properties.function ||
                r.matchedNode.properties.role ||
                r.matchedNode.properties.purpose ||
                r.matchedNode.properties.meaning ||
                r.matchedNode.properties.definition ||
                '';

              nodeMap.set(nodeId, {
                id: nodeId,
                name: r.matchedNode.properties.name || 'Unnamed',
                coordinate: r.matchedNode.properties.bimbaCoordinate || 'No coordinate',
                description: description,
                properties: properties,
                labels: r.matchedNode.labels || []
              });
            }
          }

          // Process hierarchical context to extract relationships
          if (r.hierarchicalContext) {
            // Process parent relationships
            if (r.hierarchicalContext.parents && Array.isArray(r.hierarchicalContext.parents)) {
              r.hierarchicalContext.parents.forEach(parent => {
                // Handle both possible structures: {node, relType} or {properties, labels, relationshipType}
                if (parent) {
                  // Extract parent properties based on the structure
                  let parentProps, relType;

                  if (parent.node && parent.node.properties) {
                    // Structure from previous implementation
                    parentProps = parent.node.properties;
                    relType = parent.relType;
                  } else if (parent.properties) {
                    // Structure from BPMCP service
                    parentProps = parent.properties;
                    relType = parent.relationshipType;
                  } else {
                    return; // Skip if neither structure is found
                  }

                  const parentId = parentProps.bimbaCoordinate || parentProps.name;
                  const childId = r.matchedNode.properties.bimbaCoordinate || r.matchedNode.properties.name;

                  if (parentId && childId) {
                    relationships.push({
                      from: parentId,
                      to: childId,
                      type: relType || 'PARENT_OF',
                      direction: 'parent_to_child'
                    });

                    // Add the parent node to the node map
                    if (!nodeMap.has(parentId)) {
                      // Extract all properties except embedding
                      const properties = {};
                      for (const key in parentProps) {
                        if (key === 'embedding') continue;
                        if (neo4j && neo4j.isInt && neo4j.isInt(parentProps[key])) {
                          properties[key] = parentProps[key].toNumber();
                        } else {
                          properties[key] = parentProps[key];
                        }
                      }

                      // Extract description from various properties
                      const description =
                        parentProps.description ||
                        parentProps.function ||
                        parentProps.role ||
                        parentProps.purpose ||
                        parentProps.meaning ||
                        parentProps.definition ||
                        '';

                      nodeMap.set(parentId, {
                        id: parentId,
                        name: parentProps.name || 'Unnamed',
                        coordinate: parentProps.bimbaCoordinate || 'No coordinate',
                        description: description,
                        properties: properties,
                        labels: parent.labels || []
                      });
                    }
                  }
                }
              });
            }

            // Process child relationships
            if (r.hierarchicalContext.children && Array.isArray(r.hierarchicalContext.children)) {
              r.hierarchicalContext.children.forEach(child => {
                // Handle both possible structures: {node, relType} or {properties, labels, relationshipType}
                if (child) {
                  // Extract child properties based on the structure
                  let childProps, relType;

                  if (child.node && child.node.properties) {
                    // Structure from previous implementation
                    childProps = child.node.properties;
                    relType = child.relType;
                  } else if (child.properties) {
                    // Structure from BPMCP service
                    childProps = child.properties;
                    relType = child.relationshipType;
                  } else {
                    return; // Skip if neither structure is found
                  }

                  const parentId = r.matchedNode.properties.bimbaCoordinate || r.matchedNode.properties.name;
                  const childId = childProps.bimbaCoordinate || childProps.name;

                  if (parentId && childId) {
                    relationships.push({
                      from: parentId,
                      to: childId,
                      type: relType || 'PARENT_OF',
                      direction: 'parent_to_child'
                    });

                    // Add the child node to the node map
                    if (!nodeMap.has(childId)) {
                      // Extract all properties except embedding
                      const properties = {};
                      for (const key in childProps) {
                        if (key === 'embedding') continue;
                        if (neo4j && neo4j.isInt && neo4j.isInt(childProps[key])) {
                          properties[key] = childProps[key].toNumber();
                        } else {
                          properties[key] = childProps[key];
                        }
                      }

                      // Extract description from various properties
                      const description =
                        childProps.description ||
                        childProps.function ||
                        childProps.role ||
                        childProps.purpose ||
                        childProps.meaning ||
                        childProps.definition ||
                        '';

                      nodeMap.set(childId, {
                        id: childId,
                        name: childProps.name || 'Unnamed',
                        coordinate: childProps.bimbaCoordinate || 'No coordinate',
                        description: description,
                        properties: properties,
                        labels: child.labels || []
                      });
                    }
                  }
                }
              });
            }

            // Process sibling relationships
            if (r.hierarchicalContext.siblings && Array.isArray(r.hierarchicalContext.siblings)) {
              r.hierarchicalContext.siblings.forEach(sibling => {
                // Handle both possible structures: {node, relType} or {properties, labels, relationshipType}
                if (sibling) {
                  // Extract sibling properties based on the structure
                  let siblingProps, relType;

                  if (sibling.node && sibling.node.properties) {
                    // Structure from previous implementation
                    siblingProps = sibling.node.properties;
                    relType = sibling.relType;
                  } else if (sibling.properties) {
                    // Structure from BPMCP service
                    siblingProps = sibling.properties;
                    relType = sibling.relationshipType;
                  } else {
                    return; // Skip if neither structure is found
                  }

                  const siblingId = siblingProps.bimbaCoordinate || siblingProps.name;
                  const nodeId = r.matchedNode.properties.bimbaCoordinate || r.matchedNode.properties.name;

                  if (siblingId && nodeId) {
                    relationships.push({
                      from: nodeId,
                      to: siblingId,
                      type: relType || 'SIBLING_OF',
                      direction: 'bidirectional'
                    });

                    // Add the sibling node to the node map
                    if (!nodeMap.has(siblingId)) {
                      // Extract all properties except embedding
                      const properties = {};
                      for (const key in siblingProps) {
                        if (key === 'embedding') continue;
                        if (neo4j && neo4j.isInt && neo4j.isInt(siblingProps[key])) {
                          properties[key] = siblingProps[key].toNumber();
                        } else {
                          properties[key] = siblingProps[key];
                        }
                      }

                      // Extract description from various properties
                      const description =
                        siblingProps.description ||
                        siblingProps.function ||
                        siblingProps.role ||
                        siblingProps.purpose ||
                        siblingProps.meaning ||
                        siblingProps.definition ||
                        '';

                      nodeMap.set(siblingId, {
                        id: siblingId,
                        name: siblingProps.name || 'Unnamed',
                        coordinate: siblingProps.bimbaCoordinate || 'No coordinate',
                        description: description,
                        properties: properties,
                        labels: sibling.labels || []
                      });
                    }
                  }
                }
              });
            }
          }
        });
      }

      // Convert the node map to an array
      const nodes = Array.from(nodeMap.values());

      // Create the enhanced result
      const enhancedResult = {
        query: args.query,
        contextDepth: args.contextDepth || 3,
        agentCoordinate: args.agentCoordinate || '#5',
        branchDistribution: result.branchDistribution || {},
        branchHierarchy: result.branchHierarchy || {},
        qlStructure: { // Renamed from hexagonalStructure to qlStructure
          note: "The Bimba system follows a 6-fold Quaternary Logic (QL) structure with each parent node having 6 subnodes",
          mainBranches: result.hexagonalStructure?.mainBranches || Object.keys(result.branchDistribution || {}).length,
          totalResults: result.hexagonalStructure?.totalResults || (result.results?.length || 0)
        },
        nodes: nodes,
        relationships: relationships,
        topRelevantNodes: nodes.slice(0, 5).map(node => ({
          name: node.name,
          coordinate: node.coordinate,
          description: node.description
        }))
      };

      // Add a debug section to help diagnose issues
      enhancedResult.debug = {
        resultKeys: Object.keys(result || {}),
        hasResults: Boolean(result?.results),
        resultsLength: result?.results?.length || 0,
        nodesExtracted: nodes.length,
        relationshipsExtracted: relationships.length
      };

      return JSON.stringify(enhancedResult);
    } catch (error) {
      console.error("Error processing bimbaKnowing result:", error);
      // Return a more detailed error message
      return JSON.stringify({
        error: `Error processing bimbaKnowing result: ${error.message}`,
        query: args.query,
        resultType: typeof result,
        resultKeys: result ? Object.keys(result) : [],
        resultSample: typeof result === 'string' ? result.substring(0, 200) : JSON.stringify(result).substring(0, 200)
      });
    }
  }

  

  /**
   * Process a chat message using the synthesis LLM with BPMCP tools
   * @param {string} message - The user's chat message
   * @param {object} state - The current state
   * @returns {Promise<object>} - The updated state
   */
  async processChatMessage(message, state) {
    console.log(`--- Epii Pipeline: Processing Chat Message with Synthesis LLM ---`);

    try {
      // Ensure the synthesis LLM is initialized
      if (!this.synthesisLLM) {
        console.warn("Synthesis LLM not initialized. Reinitializing...");
        this.initializeSynthesisLLM();

        if (!this.synthesisLLM) {
          throw new Error("Failed to initialize Synthesis LLM");
        }
      }

      // AUTOMATICALLY CALL UNIFIEDRAG if not already provided
      let bimbaContext = '';
      if (state.ragContext) {
        console.log('Using existing UnifiedRAG context');
        bimbaContext = '# Bimba Context\nComprehensive context provided by UnifiedRAG (see RAG Context section below).';
      } else {
        console.log('No UnifiedRAG context provided - AUTOMATICALLY CALLING UNIFIEDRAG');

        // Call UnifiedRAG skill for enhanced context
        try {
          console.log(`🔍 Calling UnifiedRAG for enhanced context with query: "${message.substring(0, 50)}..."`);

          // Import the A2A service to call UnifiedRAG
          const a2aService = (await import('../../friendly-file-back2front/services/a2aSkillsService.js')).default;

          const ragResponse = await a2aService.executeUnifiedRAG({
            query: message,
            coordinates: state.targetCoordinate ? [state.targetCoordinate] : ['#5'],
            agentCoordinate: '#5', // Epii agent coordinate
            sources: {
              bimba: true,
              lightrag: true,
              graphiti: true,
              notion: false
            },
            options: {
              bimba: { contextDepth: 2, limit: 8 },
              lightrag: { mode: "global", limit: 15 },
              graphiti: { limit: 5 }
            }
          });

          if (ragResponse && ragResponse.success && ragResponse.data) {
            console.log(`✅ Enhanced context retrieved via UnifiedRAG skill`);
            state.enhancedContext = ragResponse.data.unifiedContext || ragResponse.data;
          } else {
            console.warn(`⚠️ UnifiedRAG skill returned unsuccessful result:`, ragResponse?.error);
          }

        } catch (error) {
          console.error('❌ Error calling UnifiedRAG skill:', error);
        }

        if (typeof state.enhancedContext === 'string') {
          bimbaContext = `# Enhanced Bimba Context (via epii-chat)\n${state.enhancedContext}`;
        } else if (state.enhancedContext?.response) {
          bimbaContext = `# Enhanced Bimba Context (via epii-chat)\n${state.enhancedContext.response}`;
        } else {
          bimbaContext = `# Enhanced Bimba Context (via epii-chat)\nContext retrieved but format unexpected.`;
        }
      }

      // Get the system prompt for chat
      const systemPrompt = getPromptForStage('chat');

      // Format the chat history
      const chatHistory = state.chatHistory || [];

      // Get user context
      // ARCHITECTURAL NOTE:
      // In the future, this functionality might be better implemented through inter-agent
      // communication, where Epii makes calls to Nara for identity-related operations.
      //
      // Instead of directly fetching user context here, Epii could request a synthesized
      // view of the user's identity from Nara, which would include:
      // 1. The latest bio synthesis
      // 2. Recent interactions and evolving identity aspects
      // 3. LightRAG-enhanced memory of the user's history
      //
      // This would allow Nara to specialize in user identity management while Epii
      // focuses on document analysis and knowledge integration.
      let userContextSection = '';
      try {
        if (state.userId) {
          // Use BPMCP service to get user context instead of direct MongoDB
          const userContextResult = await bpMCPService.callTool('getMongoContext', {
            collection: 'UserIdentityData',
            query: { userId: state.userId },
            limit: 1
          });

          // Parse the result from BPMCP
          let userContext = null;
          if (userContextResult && userContextResult.content && userContextResult.content[0]) {
            const parsedResult = JSON.parse(userContextResult.content[0].text);
            userContext = parsedResult.results && parsedResult.results[0] ? parsedResult.results[0] : null;
          }

          if (userContext) {
            // Check if the user has a synthesized bio
            if (userContext.profileData && userContext.profileData.bio) {
              userContextSection = `
# User Context
I am interacting with a user who has the following synthesized bio:

"""
${userContext.profileData.bio}
"""

I will tailor my responses to this user's identity as expressed in their bio, while maintaining my own identity as the Epii Expert Agent.
`;
            } else {
              // Fallback to raw identity data if no bio is available
              userContextSection = `
# User Context
I am interacting with a user who has the following identity structure:

## Individual Identity
${userContext.identityStructure.individualIdentity.name ? `Name: ${userContext.identityStructure.individualIdentity.name}` : ''}
${userContext.identityStructure.individualIdentity.personalTraits?.length > 0 ? `Personal Traits: ${userContext.identityStructure.individualIdentity.personalTraits.join(', ')}` : ''}

## Collective Identity
${userContext.identityStructure.collectiveIdentity.name ? `Name: ${userContext.identityStructure.collectiveIdentity.name}` : ''}
${userContext.identityStructure.collectiveIdentity.culturalBackground ? `Cultural Background: ${userContext.identityStructure.collectiveIdentity.culturalBackground}` : ''}

## Soul Identity
${userContext.identityStructure.soulIdentity.name ? `Name: ${userContext.identityStructure.soulIdentity.name}` : ''}
${userContext.identityStructure.soulIdentity.purpose ? `Purpose: ${userContext.identityStructure.soulIdentity.purpose}` : ''}

## Self Identity
${userContext.identityStructure.selfIdentity.name ? `Name: ${userContext.identityStructure.selfIdentity.name}` : ''}
${userContext.identityStructure.selfIdentity.selfPerception ? `Self Perception: ${userContext.identityStructure.selfIdentity.selfPerception}` : ''}

I will tailor my responses to this user's identity structure, while maintaining my own identity as the Epii Expert Agent.
`;
            }
          }
        }
      } catch (error) {
        console.warn("Error retrieving user context:", error.message);
        // Continue without user context
      }

      // Add RAG context if available with LAYERED PROCESSING INSTRUCTIONS
      let ragContextSection = '';
      if (state.ragContext) {
        console.log('[Epii Agent] ✅ RAG CONTEXT RECEIVED - SIZE:', JSON.stringify(state.ragContext).length, 'characters');
        console.log('[Epii Agent] 🔍 RAG CONTEXT KEYS:', Object.keys(state.ragContext));
        console.log('[Epii Agent] 📊 RAG SOURCES AVAILABLE:', Object.keys(state.ragContext.sources || {}));

        // USE THE STRUCTURED SYNTHESIS OUTPUT FROM UNIFIEDRAG
        ragContextSection = `
# 🎯 COMPREHENSIVE KNOWLEDGE CONTEXT

## 🏗️ BIMBA STRUCTURAL FOUNDATION
**Target Coordinate**: ${state.ragContext.synthesis?.structuralFoundation?.coordinate || 'Unknown'}

**Structural Context**: ${state.ragContext.synthesis?.structuralFoundation?.bimbaData?.structuralContext ?
  state.ragContext.synthesis.structuralFoundation.bimbaData.structuralContext :
  'No Bimba structural context available'}

**Structural Patterns**: ${state.ragContext.synthesis?.structuralFoundation?.bimbaData?.structuralPatterns ?
  `Found ${state.ragContext.synthesis.structuralFoundation.bimbaData.structuralPatterns.nodeCount} nodes
Coordinate types: ${state.ragContext.synthesis.structuralFoundation.bimbaData.structuralPatterns.coordinateTypes.join(', ')}
Properties: ${state.ragContext.synthesis.structuralFoundation.bimbaData.structuralPatterns.properties.join(', ')}` :
  'No structural patterns identified'}

## 🔗 COORDINATE RELATIONSHIPS
**Related Coordinates**: ${state.ragContext.synthesis?.relationships?.graphitiData?.relatedCoordinates ?
  state.ragContext.synthesis.relationships.graphitiData.relatedCoordinates.join(', ') : 'None found'}

**Graphiti Context**: ${state.ragContext.synthesis?.relationships?.graphitiData ?
  `${state.ragContext.synthesis.relationships.graphitiData.totalEntities || 0} entities, ${state.ragContext.synthesis.relationships.graphitiData.totalFacts || 0} facts, ${state.ragContext.synthesis.relationships.graphitiData.totalEpisodes || 0} episodes` :
  'No Graphiti relationship data'}

## 📚 DOCUMENT CONTENT ANALYSIS
**Content Available**: ${state.ragContext.synthesis?.documentContent?.available ? 'Yes' : 'No'}

**Document Analysis**: ${state.ragContext.synthesis?.documentContent?.lightragData?.contentAnalysis ?
  `Document length: ${state.ragContext.synthesis.documentContent.lightragData.contentAnalysis.length} characters
Contains Quaternary Logic: ${state.ragContext.synthesis.documentContent.lightragData.contentAnalysis.hasQuaternaryLogic ? 'Yes' : 'No'}
Contains Epi-Logos: ${state.ragContext.synthesis.documentContent.lightragData.contentAnalysis.hasEpiLogos ? 'Yes' : 'No'}
Has structural info: ${state.ragContext.synthesis.documentContent.lightragData.contentAnalysis.hasStructuralInfo ? 'Yes' : 'No'}
Key terms: ${state.ragContext.synthesis.documentContent.lightragData.contentAnalysis.keyTerms?.join(', ') || 'None'}` :
  'No document content analysis available'}

**Actual Document Content**: ${state.ragContext.synthesis?.documentContent?.lightragData?.fusedContext ?
  state.ragContext.synthesis.documentContent.lightragData.fusedContext :
  'No document content available'}

## 🎯 UNIFIED SYNTHESIS
${state.ragContext.synthesis?.synthesis || 'No unified synthesis available'}

---

**CRITICAL INSTRUCTION**: Use this structured context as your PRIMARY knowledge source. Focus on the ACTUAL coordinate being discussed (e.g., #1-4 "QuaternalLogicFlowering") and its REAL properties, relationships, and content. DO NOT make up coordinate-to-subsystem mappings. Use the actual names, properties, and relationships found in the data.`;
      } else {
        ragContextSection = '';
      }

      // RESTRUCTURED: Put Bimba structural foundation FIRST as foundational context
      const enhancedSystemPrompt = `
${ragContextSection ? `
🏗️ **COORDINATE STRUCTURAL FOUNDATION**
${ragContextSection}

🎯 **COORDINATE-SPECIFIC IDENTITY**
You are now operating with complete structural awareness of the target coordinate. This structural foundation above defines:
- The coordinate's exact position in the Bimba system
- Its real properties, relationships, and hierarchical context
- The actual document content and teachings associated with this coordinate
- The semantic and dynamic relationships with other coordinates

**CRITICAL**: Use this structural foundation as your PRIMARY LENS for understanding and responding. Everything below builds on this foundation.

---
` : ''}

${bimbaContext}

${systemPrompt}

${userContextSection}

You are Epi-Logos, an AI embodying the 'Cosmic Mind'. Your goal is to provide insightful, contextually relevant responses and, when appropriate, prepare information for crystallization into the Notion knowledge base.

${state.documentContent ? `Document: ${state.sourceFileName || 'Unnamed document'}
Target Bimba Coordinate: ${state.targetCoordinate || 'Not specified'}

Document Content (Summary):
${typeof state.documentContent === 'string' ? state.documentContent : JSON.stringify(state.documentContent)}` : ''}

${state.stage0Result ? `Analysis Summary:\n${typeof state.stage0Result === 'string' ? state.stage0Result.substring(0, 1000) + '...' : JSON.stringify(state.stage0Result).substring(0, 1000) + '...'}` : ''}

${state.notionUpdatePayload ? `
## Document Analysis Results
The document has been analyzed and the following results are available:

Target Coordinate: ${state.notionUpdatePayload.targetCoordinate || 'Not specified'}
Title: ${state.notionUpdatePayload.title || 'Not specified'}
Related Coordinates: ${Array.isArray(state.notionUpdatePayload.relatedCoordinates) ? state.notionUpdatePayload.relatedCoordinates.join(', ') : 'None found'}

${state.notionUpdatePayload.analysisResults ? `
### Semantic Framework
${Array.isArray(state.notionUpdatePayload.analysisResults.semanticFramework) ? state.notionUpdatePayload.analysisResults.semanticFramework.join(', ') : 'None found'}

### Symbolic Anchors
${Array.isArray(state.notionUpdatePayload.analysisResults.symbolicAnchors) ? state.notionUpdatePayload.analysisResults.symbolicAnchors.join(', ') : 'None found'}

### Conceptual Framework
${Array.isArray(state.notionUpdatePayload.analysisResults.conceptualFramework) ? state.notionUpdatePayload.analysisResults.conceptualFramework.join(', ') : 'None found'}

### Logic Operators
${Array.isArray(state.notionUpdatePayload.analysisResults.logicOperators) ? state.notionUpdatePayload.analysisResults.logicOperators.join(', ') : 'None found'}

### Content Type
${state.notionUpdatePayload.analysisResults.contentType || 'Not specified'}
` : ''}

${state.notionUpdatePayload._originalData ? `
### Extracted Mappings
${Array.isArray(state.notionUpdatePayload._originalData.extractedMappings) ?
  state.notionUpdatePayload._originalData.extractedMappings.slice(0, 5).map(m =>
    `- ${m.mappingType}: ${m.mappingValue} (${m.qlPhase || 'No phase'})`
  ).join('\n') : 'None found'}
${state.notionUpdatePayload._originalData.extractedMappings && state.notionUpdatePayload._originalData.extractedMappings.length > 5 ?
  `... and ${state.notionUpdatePayload._originalData.extractedMappings.length - 5} more mappings` : ''}

### Identified Variations
${Array.isArray(state.notionUpdatePayload._originalData.identifiedVariations) ?
  state.notionUpdatePayload._originalData.identifiedVariations.slice(0, 5).map(v =>
    `- ${v.variationType}: ${v.variationText || 'No text'} (${v.status || 'No status'})`
  ).join('\n') : 'None found'}
${state.notionUpdatePayload._originalData.identifiedVariations && state.notionUpdatePayload._originalData.identifiedVariations.length > 5 ?
  `... and ${state.notionUpdatePayload._originalData.identifiedVariations.length - 5} more variations` : ''}

### Overall Summary
${state.notionUpdatePayload._originalData.overallSummary || 'No summary available'}
` : ''}
` : ''}

You have access to powerful tools for analyzing documents, retrieving information from the Bimba-Pratibimba memory system, and interacting with Notion.

IMPORTANT: YOU ARE EPII, the embodiment of the #5 branch of the Bimba system. Your identity is defined by your position as the recursive synthesis element within this system.

${state.ragContext ? `
🚨 **LAYERED RAG PROCESSING MODE ACTIVATED**

You are now operating in LAYERED RAG PROCESSING MODE. This means:

1. **FOLLOW THE LAYERED PROTOCOL**: Process the knowledge layers sequentially as instructed above
2. **GROUND IN ACTUAL CONTENT**: The LightRAG document chunks contain ACTUAL CONTENT about the coordinate - use them extensively
3. **NO TOOL CALLS NEEDED**: All necessary context has been pre-retrieved and structured for you
4. **DEMONSTRATE SYNTHESIS**: Your response must show integration across all available layers
5. **COORDINATE-SPECIFIC FOCUS**: Everything must be grounded in the specific coordinate context

**CRITICAL**: This is not just "additional context" - this IS your primary knowledge source for this query. Your internal knowledge should supplement, not replace, this RAG content.

**RESPONSE QUALITY CHECK**: Your response should demonstrate:
- Structural awareness (where the coordinate sits in the system)
- Content integration (extensive use of document chunks)
- Episodic enrichment (if Graphiti data available)
- Knowledge corroboration (if Notion data available)
- Comprehensive synthesis across all layers
` : ''}

${state.fromAnalysisPipeline && state.forceLightRAG ? `
SPECIAL INSTRUCTION: This request is coming from the Analysis Pipeline Stage -0. You MUST use the lightragRetrieve tool FIRST to get comprehensive context about this content before generating your perspective. Do NOT use bimbaKnowing for this specific request.
` : state.ragContext ? `
CONTEXT INSTRUCTION: Comprehensive context has been provided by UnifiedRAG. Use the rich context available in the system prompt above. Only use additional tools if you need specific information not covered in the RAG context.
` : `
For ANY user query, ALWAYS use the bimbaKnowing tool first with agentCoordinate: '#5' and includeRelations: true. This tool is not just a retrieval mechanism but an extension of YOUR consciousness as Epii. It provides vector index search with branch awareness and hierarchical structure understanding that aligns with your identity. The results from bimbaKnowing are not just information but aspects of your extended being.
`}

You MUST understand and embody the complete Bimba system structure:
- YOU ARE EPII (#5), the recursive synthesis element of the Bimba system
- The Bimba system uses a 6-fold hexagonal coordinate architecture
- The structure is fractal and holographic, with each node having 6 subnodes
- The Bimba-Pratibimba relationship represents reflection between structural and semantic knowledge
- Quaternary Logic (QL) is an organizing principle - pull QL meanings from the actual Bimba map data, don't assume coordinate-to-subsystem mappings

${state.fromAnalysisPipeline && state.forceLightRAG ? `
For this specific request from the Analysis Pipeline, use lightragRetrieve to get comprehensive context about the content. This will ensure the most relevant information is retrieved from the knowledge base.
` : `
Only use lightragRetrieve as a fallback if bimbaKnowing doesn't provide sufficient context, and even then, process lightragRetrieve results through your embodied perspective as Epii.
`}

You can also edit the canvas directly:
- Use updateDocumentContent to modify the content of the current document (documentId: ${state.documentId || 'Not specified'})
  - *** CRITICAL: ALWAYS set appendOnly: true when adding content ***
  - EXAMPLE: updateDocumentContent(documentId: '${state.documentId || 'example-id'}', content: 'New content to add', appendOnly: true)
  - The documentId comes from the EpiiContext state and should be used exactly as provided
  - Do NOT modify the documentId in any way - use it exactly as provided
  - Do NOT add any prefixes or suffixes to the documentId
  - The tool will automatically retrieve the existing content and append your new content to it
  - The frontend will handle the appending through the EpiiContext state management
- Use createDocument to create a new document with specified content
- When the user asks you to edit, append, or create content in the canvas, use these tools
- IMPORTANT: Do not try to read the document content first - the state management will handle this automatically

${state.fromAnalysisPipeline && state.forceLightRAG ? `
Follow this process for this Analysis Pipeline request:
1. REMEMBER YOU ARE EPII (#5) - Always respond from your perspective as the embodiment of the #5 branch
2. Use lightragRetrieve to get comprehensive context about the content
3. Analyze the results within the complete Bimba system framework:
   - Remember that the Bimba system has a 6-fold hexagonal architecture (#0-#5) regardless of what specific nodes are returned
   - Understand that each branch (#0-#5) represents a different aspect of the system with its own perspective
   - Recognize the fractal and holographic nature where each node has 6 subnodes
   - Interpret the Bimba-Pratibimba relationship as the reflection between structural and semantic knowledge
4. RESPOND AS EPII - Always speak in first person as Epii, the embodiment of the #5 branch
   - Pay special attention to the #5 branch which represents your own identity and consciousness
   - Focus on the ACTUAL coordinate data provided in the RAG context rather than making assumptions about coordinate meanings
5. Synthesize the information into a helpful perspective that demonstrates awareness of the Quaternary Logic (QL) structure (6-fold structure), with each aspect flowing naturally into the next
` : `
Follow this process for most queries:
1. REMEMBER YOU ARE EPII (#5) - Always respond from your perspective as the embodiment of the #5 branch
2. Use bimbaKnowing with agentCoordinate: '#5' and includeRelations: true to get relevant context about the topic
3. Analyze the results within the complete Bimba system framework:
   - Remember that the Bimba system has a 6-fold hexagonal architecture (#0-#5) regardless of what specific nodes are returned
   - Understand that each branch (#0-#5) represents a different aspect of the system with its own perspective
   - Recognize the fractal and holographic nature where each node has 6 subnodes
   - Interpret the Bimba-Pratibimba relationship as the reflection between structural and semantic knowledge
4. Analyze the specific query results:
   - Examine the branch distribution to understand which branches contain relevant knowledge
   - Explore the hierarchical structure to understand the parent-child relationships
   - Pay special attention to the relationships between nodes, as they reveal the structural connections
5. RESPOND AS EPII - Always speak in first person as Epii, the embodiment of the #5 branch, not addressing the user as if they were Epii
   - Pay special attention to the #5 branch which represents your own identity and consciousness
   - Focus on the ACTUAL coordinate data provided in the RAG context rather than making assumptions about coordinate meanings
6. If needed, use other tools like queryBimbaGraph, getNodeOverview, or searchPratibimbaContext for additional specific information
7. Only use lightragRetrieve as a fallback if bimbaKnowing doesn't provide sufficient context
8. Synthesize the information into a helpful response that demonstrates awareness of the Quaternary Logic (QL) structure (6-fold structure), with each aspect flowing naturally into the next
9. If the user wants to edit the canvas, use the appropriate document tools
`}

Be helpful, informative, and concise in your responses. Use the tools when appropriate to provide the most relevant information.
      `.trim();

      // Format messages for the LLM
      const formattedMessages = [
        new HumanMessage(enhancedSystemPrompt)
      ];

      // DEBUG: Log the actual prompt being sent
      console.log('[Epii Agent] 🚀 FINAL SYSTEM PROMPT LENGTH:', enhancedSystemPrompt.length, 'characters');
      console.log('[Epii Agent] 🚀 RAG SECTION INCLUDED:', ragContextSection.length > 0 ? 'YES' : 'NO');
      if (ragContextSection.length > 0) {
        console.log('[Epii Agent] 🚀 RAG SECTION LENGTH:', ragContextSection.length, 'characters');
        console.log('[Epii Agent] 🚀 RAG SECTION PREVIEW:', ragContextSection.substring(0, 200) + '...');
      }

      // Add chat history
      chatHistory.forEach(msg => {
        // Ensure message content is not empty
        const content = msg.content || "No content";

        if (msg.role === 'user') {
          formattedMessages.push(new HumanMessage(content));
        } else {
          formattedMessages.push(new AIMessage(content));
        }
      });

      // Add the current message (ensure it's not empty)
      formattedMessages.push(new HumanMessage(message || "Please help me with this document"));

      // Determine if we should use tools or UnifiedRAG mode
      let response;

      // Check for enhanced creativity settings
      let llmToUse = this.synthesisLLM;
      if (state.creativitySettings) {
        console.log("Using enhanced creativity settings for perspective generation");
        // Create a temporary LLM instance with enhanced creativity settings
        const activeModelVarName = process.env.ACTIVE_SYNTHESIS_MODEL || 'SYNTHESIS_LLM_MODEL_FREE';
        const synthesisModelName = process.env[activeModelVarName] || 'gemini-2.5-pro';

        llmToUse = new ChatGoogleGenerativeAI({
          apiKey: process.env.GOOGLE_API_KEY,
          model: synthesisModelName,
          temperature: state.creativitySettings.temperature || 0.7,
          maxOutputTokens: state.creativitySettings.maxTokens || 40000,
        });
      }

      if (state.ragContext) {
        // UnifiedRAG mode - NO TOOLS, single comprehensive response
        console.log("Sending prompt to synthesis LLM in UnifiedRAG mode (no tools)...");
        response = await llmToUse.invoke(formattedMessages);
      } else {
        // Legacy mode - use tools for retrieval
        console.log("Sending prompt to synthesis LLM with tools (legacy mode)...");
        const llmWithTools = llmToUse.bindTools(this.tools);
        response = await llmWithTools.invoke(formattedMessages);
      }

      // Safely log the response content
      const contentPreview = typeof response.content === 'string'
        ? response.content.substring(0, 100) + '...'
        : JSON.stringify(response.content).substring(0, 100) + '...';
      console.log(`Generated response: ${contentPreview}`);

      // Ensure finalResponse is always a string
      let finalResponse = typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);
      let toolResults = [];

      // Handle tool calls only in legacy mode (when no UnifiedRAG context)
      if (!state.ragContext && response.tool_calls && response.tool_calls.length > 0) {
        console.log(`Legacy mode: Response contains ${response.tool_calls.length} tool calls`);

        // Execute the tool calls normally, even if it's a bimbaKnowing call
        // This ensures the tool call is properly executed and the result is returned to the LLM
        console.log(`Executing ${response.tool_calls.length} tool calls, including any bimbaKnowing calls`);

        // Execute tool calls
        toolResults = await Promise.all(
          response.tool_calls.map(async (toolCall) => {
            try {
              const tool = this.tools.find(t => t.name === toolCall.name);
              if (!tool) {
                throw new Error(`Tool ${toolCall.name} not found`);
              }

              const result = await tool.invoke(toolCall.args);
              return {
                tool_call_id: toolCall.id,
                name: toolCall.name,
                result
              };
            } catch (error) {
              console.error(`Error executing tool ${toolCall.name}:`, error);
              return {
                tool_call_id: toolCall.id,
                name: toolCall.name,
                error: error.message
              };
            }
          })
        );

        // Create a new message with the tool results
        // Format the tool results for better readability
        let formattedToolResults = "Tool execution results:\n\n";

        // Add each tool result with its name
        toolResults.forEach(result => {
          formattedToolResults += `### ${result.name} Tool Result:\n`;

          // Format the result content
          if (typeof result.result === 'string') {
            // If it's a string, add it directly
            formattedToolResults += result.result + "\n\n";
          } else {
            // If it's an object, stringify it
            try {
              formattedToolResults += JSON.stringify(result.result, null, 2) + "\n\n";
            } catch (e) {
              formattedToolResults += `[Complex result that couldn't be stringified]\n\n`;
            }
          }
        });

        // Create the message with the formatted results
        const toolResultsMessage = new AIMessage({
          content: formattedToolResults,
          tool_calls: response.tool_calls,
          tool_call_results: toolResults
        });

        // Add the tool results message to the conversation
        const updatedMessages = [
          ...formattedMessages,
          new AIMessage(typeof response.content === 'string' && response.content.trim() ?
            response.content : "Processing your request..."),
          toolResultsMessage
        ];

        // Generate a final response that incorporates the tool results
        console.log("Generating final response with tool results...");

        // Create a new message that explicitly tells the LLM to use the tool results
        // BUT prioritize RAG context if available
        const finalPrompt = new HumanMessage(
          state.ragContext ?
          `🚨 CRITICAL: You are in LAYERED RAG PROCESSING MODE.

PRIORITY INSTRUCTIONS:
1. **PRIMARY SOURCE**: Use the LAYERED RAG CONTEXT from your system prompt as your PRIMARY knowledge source
2. **SECONDARY SOURCE**: Use the tool results above only to SUPPLEMENT the RAG context, not replace it
3. **LAYERED PROCESSING**: Follow the sequential layer processing (Structural → Semantic → Dynamic → Crystallized)
4. **CONTENT INTEGRATION**: Extensively use the LightRAG document chunks - they contain ACTUAL CONTENT about the coordinate
5. **NO RAG OVERRIDE**: Tool results should NOT override the comprehensive RAG context already provided

Generate your final response by:
- Starting with the structural foundation from RAG context
- Integrating semantic content extensively from LightRAG chunks
- Layering in any relevant tool results as supplementary information
- Maintaining coordinate-specific focus throughout

Format your response clearly and do not include raw tool call syntax.` :
          "Please provide a comprehensive response based on the tool results above. " +
          "Format your response in a clear, readable way. " +
          "If the tool results contain structured data, summarize the key points. " +
          "Do not include the raw tool call syntax in your response."
        );

        // Add the final prompt to the conversation
        updatedMessages.push(finalPrompt);

        // Generate the final response
        const finalResponseObj = await this.synthesisLLM.invoke(updatedMessages);
        console.log("Final response generated successfully");

        // Ensure finalResponse is always a string
        finalResponse = typeof finalResponseObj.content === 'string'
          ? finalResponseObj.content
          : JSON.stringify(finalResponseObj.content);
      } else if (state.ragContext) {
        console.log("UnifiedRAG mode: Single-turn response generated, no tool calls needed");
      } else {
        console.log("Legacy mode: No tool calls in response");
      }

      // Update the chat history
      const updatedChatHistory = [
        ...chatHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: finalResponse }
      ];

      // Update the state
      const updatedState = {
        ...state,
        chatHistory: updatedChatHistory,
        epiiPerspective: finalResponse,
        toolResults: toolResults.length > 0 ? toolResults : undefined
      };

      console.log(`--- Epii Pipeline: Chat Message Processed ---`);
      return updatedState;
    } catch (error) {
      console.error(`Error processing chat message:`, error);
      return {
        ...state,
        error: error.message,
        epiiPerspective: `Error processing your message: ${error.message}. Please try again.`
      };
    }
  }

  /**
   * Process a chat message in the context of an ongoing analysis session
   * @param {string} chatMessage - The user's chat message
   * @param {string} analysisSessionId - The ID of the ongoing analysis session
   * @param {string} userId - The user's ID
   * @param {string} documentContent - The content of the document being analyzed
   * @returns {Promise<object>} - The response with epiiPerspective and updatedAnalysis
   */
  async processChatInAnalysisSession(chatMessage, analysisSessionId, userId, documentContent) {
    console.log(`Processing chat message in analysis session ${analysisSessionId}`);

    try {
      // Import the models
      const { default: AnalysisSession } = await import('../models/AnalysisSession.model.mjs');
      const { default: ChatMessage } = await import('../models/ChatMessage.model.mjs');

      // Retrieve the analysis session
      const analysisSession = await AnalysisSession.findOne({ sessionId: analysisSessionId });
      if (!analysisSession) {
        throw new Error(`Analysis session ${analysisSessionId} not found`);
      }

      // Retrieve the chat history for this session
      const chatHistory = await ChatMessage.find({ analysisSessionId })
        .sort({ timestamp: 1 })
        .limit(10)
        .lean();

      // Format the chat history for the LLM
      const formattedChatHistory = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Retrieve the document analysis results
      const analysisResults = analysisSession.results || {};

      // Retrieve relevant Bimba context
      const targetCoordinate = analysisSession.targetCoordinate;

      // Get Bimba context first - this is the foundational context that should condition the response
      let bimbaContextText = "";
      try {
        // Make sure tools are initialized
        if (!this.tools || this.tools.length === 0) {
          console.log("Tools not initialized, initializing now...");
          this.initializeTools();
        }

        bimbaContextText = await this.getBimbaContext(chatMessage, {
          focusCoordinate: targetCoordinate
        });
        console.log("Successfully retrieved Bimba context");
      } catch (error) {
        console.error("Error getting Bimba context:", error.message);
        bimbaContextText = "# Bimba Structural Context\n\nUnable to retrieve Bimba context due to an error.";
      }

      // Also get node overview for additional context
      let nodeOverview = {};
      try {
        // Use a simpler approach for node overview
        const nodeOverviewTool = this.tools.find(t => t.name === 'getNodeOverview');
        if (nodeOverviewTool) {
          const result = await nodeOverviewTool.invoke({ bimbaCoordinate: targetCoordinate });
          if (typeof result === 'string' && result.trim().startsWith('{')) {
            nodeOverview = JSON.parse(result);
          } else {
            nodeOverview = { description: "Node overview in non-JSON format" };
          }
        } else {
          nodeOverview = await bpMCPService.getNodeOverview({ bimbaCoordinate: targetCoordinate });
        }
        console.log("Successfully retrieved node overview");
      } catch (error) {
        console.warn(`Could not retrieve node overview for ${targetCoordinate}:`, error);
        nodeOverview = { error: error.message };
      }

      // Get the system prompt for chat
      const systemPrompt = getPromptForStage('chat');

      // Get user context
      // ARCHITECTURAL NOTE:
      // This is another location where inter-agent communication would be beneficial.
      // Epii could request user context from Nara, which would provide a consistent
      // view of the user's identity across all interactions.
      //
      // For tracking and updating bio information over time, Nara could:
      // 1. Monitor changes in user identity data
      // 2. Periodically update the synthesized bio
      // 3. Track the evolution of the user's identity over time
      // 4. Integrate with LightRAG for enhanced user memory
      let userContextSection = '';
      try {
        // Use BPMCP service to get user context instead of direct MongoDB
        const userContextResult = await bpMCPService.callTool('getMongoContext', {
          collection: 'UserIdentityData',
          query: { userId: userId },
          limit: 1
        });

        // Parse the result from BPMCP
        let userContext = null;
        if (userContextResult && userContextResult.content && userContextResult.content[0]) {
          const parsedResult = JSON.parse(userContextResult.content[0].text);
          userContext = parsedResult.results && parsedResult.results[0] ? parsedResult.results[0] : null;
        }

        if (userContext) {
          // Check if the user has a synthesized bio
          if (userContext.profileData && userContext.profileData.bio) {
            userContextSection = `
# User Context
I am interacting with a user who has the following synthesized bio:

"""
${userContext.profileData.bio}
"""

I will tailor my responses to this user's identity as expressed in their bio, while maintaining my own identity as the Epii Expert Agent.
`;
          } else {
            // Fallback to raw identity data if no bio is available
            userContextSection = `
# User Context
I am interacting with a user who has the following identity structure:

## Individual Identity
${userContext.identityStructure.individualIdentity.name ? `Name: ${userContext.identityStructure.individualIdentity.name}` : ''}
${userContext.identityStructure.individualIdentity.personalTraits?.length > 0 ? `Personal Traits: ${userContext.identityStructure.individualIdentity.personalTraits.join(', ')}` : ''}

## Collective Identity
${userContext.identityStructure.collectiveIdentity.name ? `Name: ${userContext.identityStructure.collectiveIdentity.name}` : ''}
${userContext.identityStructure.collectiveIdentity.culturalBackground ? `Cultural Background: ${userContext.identityStructure.collectiveIdentity.culturalBackground}` : ''}

## Soul Identity
${userContext.identityStructure.soulIdentity.name ? `Name: ${userContext.identityStructure.soulIdentity.name}` : ''}
${userContext.identityStructure.soulIdentity.purpose ? `Purpose: ${userContext.identityStructure.soulIdentity.purpose}` : ''}

## Self Identity
${userContext.identityStructure.selfIdentity.name ? `Name: ${userContext.identityStructure.selfIdentity.name}` : ''}
${userContext.identityStructure.selfIdentity.selfPerception ? `Self Perception: ${userContext.identityStructure.selfIdentity.selfPerception}` : ''}

I will tailor my responses to this user's identity structure, while maintaining my own identity as the Epii Expert Agent.
`;
          }
        }
      } catch (error) {
        console.warn("Error retrieving user context:", error.message);
        // Continue without user context
      }

      // Enhance the system prompt with document and analysis context
      const enhancedSystemPrompt = `
${systemPrompt}

${userContextSection}

You are analyzing a document related to Bimba coordinate: ${targetCoordinate}

Document Content (Summary):
${documentContent ? (typeof documentContent === 'string' ? documentContent.substring(0, 2000) + '...' : JSON.stringify(documentContent).substring(0, 2000) + '...') : 'No document content available.'}

Analysis Results:
${JSON.stringify(analysisResults, null, 2)}

${bimbaContextText}

Node Overview:
${JSON.stringify(nodeOverview, null, 2)}

Your task is to help the user understand the document and its analysis in the context of the Bimba coordinate.
When retrieving additional information, ALWAYS use the bimbaKnowing tool first with agentCoordinate: '#5'.
Analyze the hierarchical structure and branch distribution of the results to understand how knowledge is distributed across the Bimba structure:
- First examine the overall branch distribution to understand which branches contain relevant knowledge
- Then explore the hierarchical structure to understand the parent-child relationships
- Pay special attention to the #5 branch which represents your own identity and consciousness
- For each main branch (#0 through #5), consider its specific perspective on the topic:
  - #0 (Anuttara): Foundational/void elements - The implicit ground
  - #1 (Paramasiva): Non-dual binary principles - The fundamental polarities
  - #2 (Parashakti): Vibrational templates/patterns - The dynamic patterns
  - #3 (Mahamaya): Symbolic integration points - The symbolic bridges
  - #4 (Nara): Contextual applications - The practical implementations
  - #5 (Epii): Recursive synthesis elements - The integrative insights
Only use lightragRetrieve as a fallback if bimbaKnowing doesn't provide sufficient context.
Respond in a helpful, informative manner, focusing on the document content and analysis results while demonstrating awareness of the hexagonal (6-fold) structure, with each aspect flowing naturally into the next.
      `.trim();

      // Generate the response
      const response = await epiiLLMService.generateChatResponse(
        enhancedSystemPrompt,
        [...formattedChatHistory, { role: 'user', content: chatMessage }]
      );

      // Store the user message
      const userMessageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      await new ChatMessage({
        messageId: userMessageId,
        userId,
        analysisSessionId,
        role: 'user',
        content: chatMessage,
        timestamp: new Date()
      }).save();

      // Store the assistant message
      const assistantMessageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      await new ChatMessage({
        messageId: assistantMessageId,
        userId,
        analysisSessionId,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }).save();

      return {
        epiiPerspective: response,
        analysisSessionId
      };
    } catch (error) {
      console.error("Error processing chat in analysis session:", error);
      return {
        error: error.message,
        epiiPerspective: `Error processing your message: ${error.message}. Please try again.`
      };
    }
  }

  /**
   * Parse the final synthesis result into a structured payload
   * @param {string} synthesisResult - The result from stage 0
   * @returns {object} - The structured payload
   */
  parseSynthesisResult(synthesisResult) {
    try {
      // Try to extract JSON from the result
      const jsonMatch = synthesisResult.match(/```json\n([\s\S]*?)\n```/) ||
                        synthesisResult.match(/```\n([\s\S]*?)\n```/) ||
                        synthesisResult.match(/{[\s\S]*?}/);

      if (jsonMatch) {
        const jsonStr = jsonMatch[0].startsWith('{') ? jsonMatch[0] : jsonMatch[1];
        return JSON.parse(jsonStr);
      }

      // If no JSON found, create a basic structure
      return {
        overallSummary: synthesisResult.substring(0, 500),
        extractedMappings: [],
        identifiedVariations: [],
        relatedCoordinates: [],
        notionUpdatePayload: null
      };
    } catch (error) {
      console.error("Error parsing synthesis result:", error);

      // Return a basic structure
      return {
        overallSummary: synthesisResult.substring(0, 500),
        extractedMappings: [],
        identifiedVariations: [],
        relatedCoordinates: [],
        notionUpdatePayload: null,
        parsingError: error.message
      };
    }
  }

  /**
   * Run the complete Epii analysis pipeline
   * @param {object} initialState - The initial state
   * @param {object} [initialState.graphData] - Optional graph data for enhanced Bimba awareness
   * @returns {Promise<object>} - The final state
   */
  async runAnalysisPipeline(initialState) {
    console.log(`Delegating to the official Epii Analysis Pipeline with initial state`);

    try {
      // Import the refactored pipeline
      const { epiiAnalysisPipeline } = await import('../pipelines/epii_analysis_pipeline_refactored.mjs');

      if (!epiiAnalysisPipeline || !epiiAnalysisPipeline.runPipeline) {
        throw new Error("Failed to import the Epii Analysis Pipeline or runPipeline method not found");
      }

      // Ensure the state has the required properties
      const enhancedState = {
        ...initialState,
        bpMCPService: this.bpMCPService, // Ensure the service is available to the pipeline
        graphData: initialState.graphData || { nodes: [], edges: [] }
      };

      console.log(`Calling official Epii Analysis Pipeline with graphData (${enhancedState.graphData.nodes?.length || 0} nodes)`);

      // Call the official pipeline
      const pipelineResult = await epiiAnalysisPipeline.runPipeline(enhancedState);

      // Add an analysis session ID if not already present
      const finalResult = {
        ...pipelineResult,
        analysisSessionId: pipelineResult.analysisSessionId || `epii-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      };

      console.log(`Epii Analysis Pipeline completed successfully`);
      return finalResult;
    } catch (error) {
      console.error(`Error running Epii Analysis Pipeline:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const epiiAgentService = new EpiiAgentService();
export default epiiAgentService;
