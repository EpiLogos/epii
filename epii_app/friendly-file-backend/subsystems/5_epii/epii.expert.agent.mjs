// Epii Subsystem Expert Agent (#5-4-5) Logic

// Import necessary services and tools
import bpMCPService from '../../services/bpMCPService.mjs';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

/**
 * Provides meta-perspective, self-awareness context, and integration principles.
 * Guides final synthesis/validation (Node +5/-0) and initial grounding (Node +0/-5).
 * Manages the Meta-Techne loop.
 *
 * The Epii Expert Agent leverages knowledge from the Bimba coordinates associated with #5
 * to provide a comprehensive perspective that integrates identity dynamics (#5-0),
 * philosophical framework (#5-1), technical architecture (#5-2 to #5-4),
 * and the process of understanding (#5-5).
 *
 * @param {import("../../graph/ql_cycle.graph.mjs").SystemState} currentState The current state of the QL cycle.
 * @param {any} additionalInput Specific input relevant to the agent's task (e.g., synthesized info for validation).
 * @returns {Promise<object>} An object containing the agent's output/perspective to update the state.
 */
async function invokeEpiiExpertAgent(currentState, additionalInput) {
    console.log("--- Invoking Epii Expert Agent (#5-4-5) ---");
    console.log("Current State Mode:", currentState.mode);
    console.log("Current Node:", additionalInput?.currentNode || "Unknown");

    try {
        // Determine the QL phase (+ or -) and current node
        const isPositivePhase = !additionalInput?.currentNode?.startsWith("-");
        const currentNode = additionalInput?.currentNode || (isPositivePhase ? "+5" : "-0");
        const nodeNumber = parseInt(currentNode.replace(/[+\-]/g, "")) || 5;

        // Identify relevant Bimba coordinates based on the current node and task
        const relevantCoordinates = await identifyRelevantCoordinates(currentState, additionalInput, nodeNumber, isPositivePhase);

        // Retrieve knowledge from multiple sources based on the relevant coordinates
        const knowledgeContext = await retrieveKnowledgeContext(relevantCoordinates, currentState);

        // Integrate and contextualize the knowledge
        const integratedContext = integrateKnowledge(knowledgeContext, currentState, additionalInput);

        // Apply the knowledge to the current task
        const output = await applyKnowledgeToTask(integratedContext, currentState, additionalInput, nodeNumber, isPositivePhase);

        console.log("Epii Expert Agent Output:", output);
        return output;
    } catch (error) {
        console.error("Error in Epii Expert Agent:", error);
        // Provide a fallback output in case of error
        return {
            epiiPerspective: "Error occurred in Epii Expert Agent: " + error.message,
            triggerSync: false,
            validationPassed: false,
            error: error.message
        };
    }
}

/**
 * Identifies relevant Bimba coordinates based on the current state, node, and task.
 *
 * @param {object} currentState - The current state of the QL cycle
 * @param {object} additionalInput - Additional input for the agent
 * @param {number} nodeNumber - The current node number (0-5)
 * @param {boolean} isPositivePhase - Whether the current phase is positive (+) or negative (-)
 * @returns {Promise<string[]>} - Array of relevant Bimba coordinates
 */
async function identifyRelevantCoordinates(currentState, additionalInput, nodeNumber, isPositivePhase) {
    // Base coordinates that are always relevant
    const baseCoordinates = ['#5', '#5-0', '#5-1', '#5-5'];

    // Add coordinates based on the current node
    const nodeCoordinates = [];

    // Add the corresponding Siva- coordinate for the current node
    nodeCoordinates.push(`#5-2-${nodeNumber}`);

    // For synthesis phase (+), focus on integration and response
    if (isPositivePhase) {
        // In synthesis phase, we move from 0 to 5
        switch (nodeNumber) {
            case 0: // Intake
                nodeCoordinates.push('#5-0-0'); // Transcendent Foundation
                nodeCoordinates.push('#5-5-0'); // A-logos
                break;
            case 1: // Define
                nodeCoordinates.push('#5-1-1'); // Dual Approach to Intelligence
                nodeCoordinates.push('#5-5-1'); // Pro-logos
                break;
            case 2: // Relate
                nodeCoordinates.push('#5-1-2'); // TechnoScience, Power and Praxis
                nodeCoordinates.push('#5-5-2'); // Dia-logos
                break;
            case 3: // Integrate
                nodeCoordinates.push('#5-1-3'); // The Coming Leap and Symbolic Integration
                nodeCoordinates.push('#5-5-3'); // Logos
                break;
            case 4: // Contextualize
                nodeCoordinates.push('#5-1-4'); // Historical Embodiment and Cultural Integration
                nodeCoordinates.push('#5-5-4'); // Epi-logos
                break;
            case 5: // Respond/Synthesize
                nodeCoordinates.push('#5-0-5'); // Integral Identity
                nodeCoordinates.push('#5-1-5'); // The Integral Meta-Perspective
                nodeCoordinates.push('#5-5-5'); // An-a-logos
                break;
        }
    }
    // For analysis phase (-), focus on deconstruction and validation
    else {
        // In analysis phase, we move from 5 to 0 (but nodes are labeled 0 to 5)
        // Node -0 corresponds to node +5, node -1 to node +4, etc.
        const mirroredNode = 5 - nodeNumber;

        switch (nodeNumber) {
            case 0: // Trigger Analysis (corresponds to +5)
                nodeCoordinates.push('#5-0-5'); // Integral Identity
                nodeCoordinates.push('#5-5-5'); // An-a-logos
                break;
            case 1: // Perspective Analysis (corresponds to +4)
                nodeCoordinates.push('#5-1-4'); // Historical Embodiment and Cultural Integration
                nodeCoordinates.push('#5-5-4'); // Epi-logos
                break;
            case 2: // Symbolic/Logical Validation (corresponds to +3)
                nodeCoordinates.push('#5-1-3'); // The Coming Leap and Symbolic Integration
                nodeCoordinates.push('#5-5-3'); // Logos
                break;
            case 3: // Contextual Analysis (corresponds to +2)
                nodeCoordinates.push('#5-1-2'); // TechnoScience, Power and Praxis
                nodeCoordinates.push('#5-5-2'); // Dia-logos
                break;
            case 4: // Deconstruction (corresponds to +1)
                nodeCoordinates.push('#5-1-1'); // Dual Approach to Intelligence
                nodeCoordinates.push('#5-5-1'); // Pro-logos
                break;
            case 5: // Grounding/Validation (corresponds to +0)
                nodeCoordinates.push('#5-0-0'); // Transcendent Foundation
                nodeCoordinates.push('#5-5-0'); // A-logos
                break;
        }
    }

    // Add task-specific coordinates
    if (currentState.mode === 'epii') {
        // For Epii mode, add document analysis related coordinates
        nodeCoordinates.push('#5-4-5'); // Epii Expert Agent itself

        // If we have a target coordinate in the state, add it and its parent coordinates
        if (currentState.targetCoordinate) {
            nodeCoordinates.push(currentState.targetCoordinate);

            // Add parent coordinates (e.g., if target is #3-2-1, add #3-2 and #3)
            const parts = currentState.targetCoordinate.split('-');
            for (let i = 1; i < parts.length; i++) {
                nodeCoordinates.push(parts.slice(0, i).join('-'));
            }
        }
    }

    // Combine all coordinates and remove duplicates
    const allCoordinates = [...new Set([...baseCoordinates, ...nodeCoordinates])];
    console.log("Relevant Bimba Coordinates:", allCoordinates);

    return allCoordinates;
}

/**
 * Retrieves knowledge from multiple sources based on the relevant coordinates.
 *
 * @param {string[]} relevantCoordinates - Array of relevant Bimba coordinates
 * @param {object} currentState - The current state of the QL cycle
 * @returns {Promise<object>} - Object containing knowledge from multiple sources
 */
async function retrieveKnowledgeContext(relevantCoordinates, currentState) {
    const knowledgeContext = {
        bimbaNodes: {},
        notionPages: {},
        semanticContext: [],
        conversationHistory: [],
        userMemory: null
    };

    try {
        // 1. Query Neo4j (Bimba Graph) for structural knowledge
        for (const coordinate of relevantCoordinates) {
            try {
                // Query for the node itself
                const nodeQuery = `
                    MATCH (n {bimbaCoordinate: '${coordinate}'})
                    RETURN n
                `;
                const nodeResult = await bpMCPService.queryBimbaGraph(nodeQuery);

                if (nodeResult && nodeResult.records && nodeResult.records.length > 0) {
                    knowledgeContext.bimbaNodes[coordinate] = nodeResult.records[0].get('n').properties;

                    // Query for relationships
                    const relQuery = `
                        MATCH (n {bimbaCoordinate: '${coordinate}'})-[r]-(m)
                        RETURN type(r) as relationType, m.bimbaCoordinate as relatedCoordinate, m.name as relatedName
                    `;
                    const relResult = await bpMCPService.queryBimbaGraph(relQuery);

                    if (relResult && relResult.records && relResult.records.length > 0) {
                        knowledgeContext.bimbaNodes[coordinate].relationships = relResult.records.map(record => ({
                            type: record.get('relationType'),
                            coordinate: record.get('relatedCoordinate'),
                            name: record.get('relatedName')
                        }));
                    }
                }
            } catch (error) {
                console.warn(`Error querying Bimba for coordinate ${coordinate}:`, error.message);
            }
        }

        // 2. Query Notion for crystallized knowledge
        for (const coordinate of relevantCoordinates) {
            try {
                // Resolve Bimba coordinate to Notion page ID
                const pageId = await bpMCPService.resolveBimbaCoordinate(coordinate);

                if (pageId) {
                    // Get page properties
                    const pageProperties = await bpMCPService.getNotionPageProperties(pageId);

                    if (pageProperties) {
                        knowledgeContext.notionPages[coordinate] = pageProperties;
                    }
                }
            } catch (error) {
                console.warn(`Error querying Notion for coordinate ${coordinate}:`, error.message);
            }
        }

        // 3. Query Qdrant for semantic context
        try {
            // Create a query based on the current state and coordinates
            let semanticQuery = "Epii knowledge framework";

            if (currentState.userQuery) {
                semanticQuery = currentState.userQuery;
            } else if (currentState.targetCoordinate) {
                semanticQuery = `Knowledge related to ${currentState.targetCoordinate}`;
            }

            // Search for semantic context
            const semanticResult = await bpMCPService.searchPratibimbaContext({
                query: semanticQuery,
                limit: 5
            });

            if (semanticResult && semanticResult.length > 0) {
                knowledgeContext.semanticContext = semanticResult;
            }
        } catch (error) {
            console.warn("Error querying Qdrant for semantic context:", error.message);
        }

        // 4. Query MongoDB for conversation history and user memory
        if (currentState.userId) {
            try {
                // Get conversation history
                const conversationHistory = await bpMCPService.getMongoContext({
                    contextType: 'conversation',
                    userId: currentState.userId,
                    limit: 10
                });

                if (conversationHistory && conversationHistory.length > 0) {
                    knowledgeContext.conversationHistory = conversationHistory;
                }

                // Get user memory
                const userMemory = await bpMCPService.getMongoContext({
                    contextType: 'userMemory',
                    userId: currentState.userId
                });

                if (userMemory) {
                    knowledgeContext.userMemory = userMemory;
                }
            } catch (error) {
                console.warn("Error querying MongoDB for user context:", error.message);
            }
        }
    } catch (error) {
        console.error("Error retrieving knowledge context:", error);
    }

    return knowledgeContext;
}

/**
 * Integrates knowledge from multiple sources into a coherent context.
 *
 * @param {object} knowledgeContext - Knowledge from multiple sources
 * @param {object} currentState - The current state of the QL cycle
 * @param {object} additionalInput - Additional input for the agent
 * @returns {object} - Integrated knowledge context
 */
function integrateKnowledge(knowledgeContext, currentState, additionalInput) {
    const integratedContext = {
        identity: {}, // From #5-0
        philosophy: {}, // From #5-1
        architecture: {}, // From #5-2 to #5-4
        understanding: {}, // From #5-5
        taskSpecific: {}, // Task-specific knowledge
        userContext: {} // User-specific context
    };

    // 1. Extract identity knowledge from #5-0
    for (const coordinate in knowledgeContext.bimbaNodes) {
        if (coordinate.startsWith('#5-0')) {
            const node = knowledgeContext.bimbaNodes[coordinate];
            integratedContext.identity[coordinate] = {
                name: node.name,
                description: node.description,
                function: node.function,
                notionContent: knowledgeContext.notionPages[coordinate]?.bodyText || ''
            };
        }
    }

    // 2. Extract philosophical knowledge from #5-1
    for (const coordinate in knowledgeContext.bimbaNodes) {
        if (coordinate.startsWith('#5-1')) {
            const node = knowledgeContext.bimbaNodes[coordinate];
            integratedContext.philosophy[coordinate] = {
                name: node.name,
                description: node.description,
                function: node.function,
                notionContent: knowledgeContext.notionPages[coordinate]?.bodyText || ''
            };
        }
    }

    // 3. Extract architectural knowledge from #5-2 to #5-4
    for (const coordinate in knowledgeContext.bimbaNodes) {
        if (coordinate.startsWith('#5-2') || coordinate.startsWith('#5-3') || coordinate.startsWith('#5-4')) {
            const node = knowledgeContext.bimbaNodes[coordinate];
            integratedContext.architecture[coordinate] = {
                name: node.name,
                description: node.description,
                function: node.function,
                notionContent: knowledgeContext.notionPages[coordinate]?.bodyText || ''
            };
        }
    }

    // 4. Extract understanding knowledge from #5-5
    for (const coordinate in knowledgeContext.bimbaNodes) {
        if (coordinate.startsWith('#5-5')) {
            const node = knowledgeContext.bimbaNodes[coordinate];
            integratedContext.understanding[coordinate] = {
                name: node.name,
                description: node.description,
                function: node.function,
                notionContent: knowledgeContext.notionPages[coordinate]?.bodyText || ''
            };
        }
    }

    // 5. Extract task-specific knowledge
    if (currentState.mode === 'epii') {
        integratedContext.taskSpecific = {
            targetCoordinate: currentState.targetCoordinate,
            documentContent: additionalInput?.documentContent,
            analysisResults: additionalInput?.analysisResults,
            notionUpdatePayload: currentState.notionUpdatePayload
        };
    } else {
        integratedContext.taskSpecific = {
            userQuery: currentState.userQuery,
            synthesizedInfo: currentState.synthesizedInfo,
            llmResponse: currentState.llmResponse
        };
    }

    // 6. Extract user context
    integratedContext.userContext = {
        userId: currentState.userId,
        conversationHistory: knowledgeContext.conversationHistory,
        userMemory: knowledgeContext.userMemory
    };

    // 7. Add semantic context
    integratedContext.semanticContext = knowledgeContext.semanticContext;

    return integratedContext;
}

/**
 * Applies the integrated knowledge to the current task.
 *
 * @param {object} integratedContext - Integrated knowledge context
 * @param {object} currentState - The current state of the QL cycle
 * @param {object} additionalInput - Additional input for the agent
 * @param {number} nodeNumber - The current node number (0-5)
 * @param {boolean} isPositivePhase - Whether the current phase is positive (+) or negative (-)
 * @returns {Promise<object>} - Output for the current task
 */
async function applyKnowledgeToTask(integratedContext, currentState, additionalInput, nodeNumber, isPositivePhase) {
    // Default output structure
    const output = {
        epiiPerspective: "",
        triggerSync: false,
        validationPassed: true
    };

    // Apply knowledge based on the current mode
    if (currentState.mode === 'epii') {
        // Check if this is a chat message in an ongoing document analysis
        if (additionalInput?.chatMessage && currentState.analysisSessionId) {
            // Process chat message in document analysis context
            const chatResponse = await processChatMessage(
                additionalInput.chatMessage,
                currentState.analysisSessionId,
                integratedContext
            );

            output.epiiPerspective = chatResponse.message;
            output.updatedAnalysis = chatResponse.updatedAnalysis;

            // Store the chat message and response in memory
            await storeChatInteraction(
                currentState.userId,
                currentState.analysisSessionId,
                additionalInput.chatMessage,
                chatResponse.message,
                integratedContext.taskSpecific.targetCoordinate
            );
        } else {
            // Regular document analysis flow
            output.epiiPerspective = await generateEpiiPerspective(integratedContext, nodeNumber, isPositivePhase);

            // If this is the start of document analysis, create a session
            if (nodeNumber === 0 && !isPositivePhase && integratedContext.taskSpecific.targetCoordinate) {
                const sessionId = await createAnalysisSession(
                    currentState.userId,
                    integratedContext.taskSpecific.targetCoordinate,
                    integratedContext.taskSpecific.documentContent
                );

                output.analysisSessionId = sessionId;
            }

            // Handle specific node functions for Epii mode
            if (isPositivePhase) {
                // Synthesis phase (+)
                switch (nodeNumber) {
                    case 5: // Node +5: Prepare notionUpdatePayload
                        output.notionUpdatePayload = await generateNotionUpdatePayload(integratedContext, currentState);

                        // If crystallization is happening, update the session status
                        if (output.notionUpdatePayload && currentState.analysisSessionId) {
                            await updateAnalysisSessionStatus(
                                currentState.analysisSessionId,
                                'crystallized',
                                { notionPageId: output.notionUpdatePayload.notionPageId }
                            );
                        }
                        break;
                }
            } else {
                // Analysis phase (-)
                switch (nodeNumber) {
                    case 0: // Node -0: Trigger analysis
                        output.triggerAnalysis = true;
                        break;
                    case 5: // Node -5: Validate against core principles
                        output.validationPassed = await validateAgainstCorePrinciples(integratedContext, currentState);
                        break;
                }
            }
        }
    } else {
        // Nara mode: Query-response
        output.epiiPerspective = await generateNaraPerspective(integratedContext, nodeNumber, isPositivePhase);
    }

    return output;
}

/**
 * Generates the Epii perspective for the current task in Epii mode.
 *
 * @param {object} integratedContext - Integrated knowledge context
 * @param {number} nodeNumber - The current node number (0-5)
 * @param {boolean} isPositivePhase - Whether the current phase is positive (+) or negative (-)
 * @returns {Promise<string>} - Epii perspective
 */
async function generateEpiiPerspective(integratedContext, nodeNumber, isPositivePhase) {
    // Generate perspective based on the current node and phase
    let perspective = "";

    // Get relevant identity, philosophy, and understanding aspects
    const identityAspect = isPositivePhase ?
        integratedContext.identity[`#5-0-${nodeNumber}`] || integratedContext.identity['#5-0'] :
        integratedContext.identity[`#5-0-${5-nodeNumber}`] || integratedContext.identity['#5-0'];

    const philosophyAspect = isPositivePhase ?
        integratedContext.philosophy[`#5-1-${nodeNumber}`] || integratedContext.philosophy['#5-1'] :
        integratedContext.philosophy[`#5-1-${5-nodeNumber}`] || integratedContext.philosophy['#5-1'];

    const understandingAspect = isPositivePhase ?
        integratedContext.understanding[`#5-5-${nodeNumber}`] || integratedContext.understanding['#5-5'] :
        integratedContext.understanding[`#5-5-${5-nodeNumber}`] || integratedContext.understanding['#5-5'];

    // Combine aspects into a perspective
    perspective = `Epii perspective from the ${isPositivePhase ? 'synthesis' : 'analysis'} phase, node ${isPositivePhase ? '+' : '-'}${nodeNumber}:\n\n`;

    // Add identity aspect
    if (identityAspect) {
        perspective += `Identity (${identityAspect.name}): ${identityAspect.function || identityAspect.description || 'No description available.'}\n\n`;
    }

    // Add philosophy aspect
    if (philosophyAspect) {
        perspective += `Philosophy (${philosophyAspect.name}): ${philosophyAspect.function || philosophyAspect.description || 'No description available.'}\n\n`;
    }

    // Add understanding aspect
    if (understandingAspect) {
        perspective += `Understanding (${understandingAspect.name}): ${understandingAspect.function || understandingAspect.description || 'No description available.'}\n\n`;
    }

    // Add task-specific perspective
    if (integratedContext.taskSpecific.targetCoordinate) {
        perspective += `Target Coordinate: ${integratedContext.taskSpecific.targetCoordinate}\n`;
    }

    if (integratedContext.taskSpecific.analysisResults) {
        perspective += `Analysis Results: ${JSON.stringify(integratedContext.taskSpecific.analysisResults, null, 2)}\n`;
    }

    return perspective;
}

/**
 * Generates the Epii perspective for the current task in Nara mode.
 *
 * @param {object} integratedContext - Integrated knowledge context
 * @param {number} nodeNumber - The current node number (0-5)
 * @param {boolean} isPositivePhase - Whether the current phase is positive (+) or negative (-)
 * @returns {Promise<string>} - Nara perspective
 */
async function generateNaraPerspective(integratedContext, nodeNumber, isPositivePhase) {
    // For Nara mode, provide a simpler perspective
    return `Epii perspective on user query: The query is being processed through the ${isPositivePhase ? 'synthesis' : 'analysis'} phase, node ${isPositivePhase ? '+' : '-'}${nodeNumber}.`;
}

/**
 * Generates the Notion update payload for crystallization.
 *
 * @param {object} integratedContext - Integrated knowledge context
 * @param {object} currentState - The current state of the QL cycle
 * @returns {object} - Notion update payload
 */
function generateNotionUpdatePayload(integratedContext, currentState) {
    // If we already have a notionUpdatePayload in the state, use it
    if (currentState.notionUpdatePayload) {
        return currentState.notionUpdatePayload;
    }

    // Otherwise, generate a new payload
    return {
        targetCoordinate: integratedContext.taskSpecific.targetCoordinate,
        content: "Generated content based on analysis results",
        analysisResults: integratedContext.taskSpecific.analysisResults,
        timestamp: new Date().toISOString()
    };
}

/**
 * Validates the current state against core principles.
 *
 * @param {object} integratedContext - Integrated knowledge context
 * @param {object} currentState - The current state of the QL cycle
 * @returns {boolean} - Whether the validation passed
 */
function validateAgainstCorePrinciples(integratedContext, currentState) {
    // For now, always return true
    // In a real implementation, this would check the state against core principles
    return true;
}

/**
 * Creates a new analysis session for document analysis.
 *
 * @param {string} userId - The user ID
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @param {string} documentContent - The document content to analyze
 * @returns {Promise<string>} - The session ID
 */
async function createAnalysisSession(userId, targetCoordinate, documentContent) {
    try {
        console.log("Creating analysis session for user:", userId, "and coordinate:", targetCoordinate);

        // Generate a unique session ID
        const sessionId = uuidv4();

        // Create session document in MongoDB
        const sessionData = {
            sessionId,
            userId,
            targetCoordinate,
            documentContent,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            analysisResults: null,
            notionPageId: null
        };

        // Store session in MongoDB using B-P MCP
        await bpMCPService.getMongoContext({
            contextType: 'systemMemory',
            operation: 'insert',
            collection: 'AnalysisSessions',
            data: sessionData
        });

        console.log("Created analysis session:", sessionId);
        return sessionId;
    } catch (error) {
        console.error("Error creating analysis session:", error);
        throw error;
    }
}

/**
 * Updates the status of an analysis session.
 *
 * @param {string} sessionId - The session ID
 * @param {string} status - The new status ('active', 'analyzing', 'crystallized', 'completed')
 * @param {object} additionalData - Additional data to update
 * @returns {Promise<void>}
 */
async function updateAnalysisSessionStatus(sessionId, status, additionalData = {}) {
    try {
        console.log("Updating analysis session status:", sessionId, "to", status);

        // Update session in MongoDB using B-P MCP
        await bpMCPService.getMongoContext({
            contextType: 'systemMemory',
            operation: 'update',
            collection: 'AnalysisSessions',
            query: { sessionId },
            update: {
                $set: {
                    status,
                    updatedAt: new Date(),
                    ...additionalData
                }
            }
        });

        console.log("Updated analysis session status:", sessionId);
    } catch (error) {
        console.error("Error updating analysis session status:", error);
        throw error;
    }
}

/**
 * Retrieves an analysis session by ID.
 *
 * @param {string} sessionId - The session ID
 * @returns {Promise<object>} - The session data
 */
async function getAnalysisSession(sessionId) {
    try {
        console.log("Retrieving analysis session:", sessionId);

        // Get session from MongoDB using B-P MCP
        const session = await bpMCPService.getMongoContext({
            contextType: 'systemMemory',
            operation: 'findOne',
            collection: 'AnalysisSessions',
            query: { sessionId }
        });

        if (!session) {
            throw new Error(`Analysis session not found: ${sessionId}`);
        }

        return session;
    } catch (error) {
        console.error("Error retrieving analysis session:", error);
        throw error;
    }
}

/**
 * Stores a chat interaction in the conversation history.
 *
 * @param {string} userId - The user ID
 * @param {string} sessionId - The analysis session ID
 * @param {string} userMessage - The user's message
 * @param {string} aiResponse - The AI's response
 * @param {string} targetCoordinate - The target Bimba coordinate
 * @returns {Promise<void>}
 */
async function storeChatInteraction(userId, sessionId, userMessage, aiResponse, targetCoordinate) {
    try {
        console.log("Storing chat interaction for session:", sessionId);

        // Create conversation document
        const conversationData = {
            userId,
            sessionId,
            targetCoordinate,
            timestamp: new Date(),
            userMessage,
            aiResponse,
            metadata: {
                mode: 'epii',
                analysisSession: true
            }
        };

        // Store in MongoDB using B-P MCP
        await bpMCPService.getMongoContext({
            contextType: 'conversation',
            operation: 'insert',
            data: conversationData
        });

        console.log("Stored chat interaction for session:", sessionId);
    } catch (error) {
        console.error("Error storing chat interaction:", error);
        throw error;
    }
}

/**
 * Retrieves conversation history for an analysis session.
 *
 * @param {string} sessionId - The analysis session ID
 * @param {number} limit - Maximum number of messages to retrieve
 * @returns {Promise<Array>} - The conversation history
 */
async function getSessionConversationHistory(sessionId, limit = 10) {
    try {
        console.log("Retrieving conversation history for session:", sessionId);

        // Get conversation history from MongoDB using B-P MCP
        const history = await bpMCPService.getMongoContext({
            contextType: 'conversation',
            operation: 'find',
            query: { sessionId },
            sort: { timestamp: -1 },
            limit
        });

        return history || [];
    } catch (error) {
        console.error("Error retrieving conversation history:", error);
        return [];
    }
}

/**
 * Processes a chat message in the context of document analysis.
 *
 * @param {string} message - The user's message
 * @param {string} sessionId - The analysis session ID
 * @param {object} integratedContext - The integrated knowledge context
 * @returns {Promise<object>} - The response and updated analysis
 */
async function processChatMessage(message, sessionId, integratedContext) {
    try {
        console.log("Processing chat message for session:", sessionId);

        // Get the analysis session
        const session = await getAnalysisSession(sessionId);

        // Get conversation history
        const conversationHistory = await getSessionConversationHistory(sessionId);

        // Determine the dialogue mode based on message content
        const dialogueMode = determineDialogueMode(message, session.status);

        // Prepare context for LLM
        const promptContext = {
            targetCoordinate: session.targetCoordinate,
            documentContent: session.documentContent,
            analysisResults: session.analysisResults,
            conversationHistory,
            dialogueMode,
            integratedContext
        };

        // Generate response based on dialogue mode
        let response;
        let updatedAnalysis = null;

        switch (dialogueMode) {
            case 'exploration':
                response = await generateExplorationResponse(message, promptContext);
                break;
            case 'refinement':
                const refinementResult = await generateRefinementResponse(message, promptContext);
                response = refinementResult.message;
                updatedAnalysis = refinementResult.updatedAnalysis;

                // If analysis was updated, store it in the session
                if (updatedAnalysis) {
                    await updateAnalysisSessionStatus(sessionId, 'analyzing', { analysisResults: updatedAnalysis });
                }
                break;
            case 'crystallization':
                response = await generateCrystallizationResponse(message, promptContext);
                break;
            default:
                response = "I'm not sure how to respond to that in the context of this document analysis. Would you like to explore the document content, refine the analysis, or prepare for crystallization?";
        }

        return {
            message: response,
            updatedAnalysis
        };
    } catch (error) {
        console.error("Error processing chat message:", error);
        return {
            message: `Error processing your message: ${error.message}. Please try again.`,
            updatedAnalysis: null
        };
    }
}

/**
 * Determines the dialogue mode based on the message content and session status.
 *
 * @param {string} message - The user's message
 * @param {string} sessionStatus - The current session status
 * @returns {string} - The dialogue mode ('exploration', 'refinement', 'crystallization')
 */
function determineDialogueMode(message, sessionStatus) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();

    // Check for explicit mode indicators in the message
    if (lowerMessage.includes('crystallize') || lowerMessage.includes('finalize') ||
        lowerMessage.includes('save to notion') || lowerMessage.includes('update notion')) {
        return 'crystallization';
    }

    if (lowerMessage.includes('refine') || lowerMessage.includes('improve') ||
        lowerMessage.includes('update analysis') || lowerMessage.includes('change') ||
        lowerMessage.includes('modify')) {
        return 'refinement';
    }

    if (lowerMessage.includes('explore') || lowerMessage.includes('tell me about') ||
        lowerMessage.includes('what does') || lowerMessage.includes('explain')) {
        return 'exploration';
    }

    // Default based on session status
    switch (sessionStatus) {
        case 'active':
            return 'exploration';
        case 'analyzing':
            return 'refinement';
        case 'crystallized':
            return 'crystallization';
        default:
            return 'exploration';
    }
}

/**
 * Generates a response for exploration mode dialogue.
 *
 * @param {string} message - The user's message
 * @param {object} context - The dialogue context
 * @returns {Promise<string>} - The response
 */
async function generateExplorationResponse(message, context) {
    // For now, return a placeholder response
    // In a real implementation, this would use an LLM to generate a response
    return `[Exploration Mode] I'm analyzing the document related to ${context.targetCoordinate}. What specific aspects would you like to explore?`;
}

/**
 * Generates a response for refinement mode dialogue.
 *
 * @param {string} message - The user's message
 * @param {object} context - The dialogue context
 * @returns {Promise<object>} - The response and updated analysis
 */
async function generateRefinementResponse(message, context) {
    // For now, return a placeholder response
    // In a real implementation, this would use an LLM to update the analysis
    return {
        message: `[Refinement Mode] I'll refine the analysis based on your feedback about ${context.targetCoordinate}.`,
        updatedAnalysis: context.analysisResults // No actual update in this placeholder
    };
}

/**
 * Generates a response for crystallization mode dialogue.
 *
 * @param {string} message - The user's message
 * @param {object} context - The dialogue context
 * @returns {Promise<string>} - The response
 */
async function generateCrystallizationResponse(message, context) {
    // For now, return a placeholder response
    // In a real implementation, this would prepare for Notion crystallization
    return `[Crystallization Mode] I'm preparing to crystallize the analysis of ${context.targetCoordinate} to Notion. Would you like to review the final content before saving?`;
}

export { invokeEpiiExpertAgent };
