/**
 * Nara Subsystem Expert Agent (#5-4-4) Logic
 *
 * Provides contextual application, personalization, and dialogue management.
 * Applies Jungian framework concepts and manages user identity.
 * Primarily informs Node +4 (Contextualize) and Node -1 (Perspective Analysis).
 */

// Import necessary services
import axios from 'axios';

// BPMCP Service URL (for accessing MongoDB, Neo4j, Qdrant, and Notion)
const BPMCP_SERVICE_URL = process.env.BPMCP_SERVICE_URL || 'http://localhost:3030';

/**
 * Query the BPMCP service for user context
 * @param {string} userId The user ID
 * @returns {Promise<Object>} The user context
 */
async function getUserContext(userId) {
    try {
        const response = await axios.post(`${BPMCP_SERVICE_URL}/mongo/query`, {
            collection: 'UserIdentityData',
            query: { userId },
            limit: 1
        });

        return response.data.success ? response.data.data[0] : null;
    } catch (error) {
        console.error('Error querying user context:', error);
        return null;
    }
}

/**
 * Query the BPMCP service for conversation history
 * @param {string} userId The user ID
 * @param {number} limit The maximum number of messages to retrieve
 * @returns {Promise<Array>} The conversation history
 */
async function getConversationHistory(userId, limit = 10) {
    try {
        const response = await axios.post(`${BPMCP_SERVICE_URL}/mongo/query`, {
            collection: 'UserInteractions',
            query: { userId },
            sort: { timestamp: -1 },
            limit
        });

        return response.data.success ? response.data.data : [];
    } catch (error) {
        console.error('Error querying conversation history:', error);
        return [];
    }
}

/**
 * Query the Neo4j Bimba graph for relevant nodes
 * @param {string} query The Cypher query
 * @returns {Promise<Array>} The query results
 */
async function queryBimbaGraph(query) {
    try {
        const response = await axios.post(`${BPMCP_SERVICE_URL}/graph/query`, {
            query
        });

        return response.data.success ? response.data.data : [];
    } catch (error) {
        console.error('Error querying Bimba graph:', error);
        return [];
    }
}

/**
 * Generate an archetypal signature for a user
 * @param {string} userId The user ID
 * @param {Object} userData The user data
 * @returns {Promise<Object>} The archetypal signature
 */
async function generateArchetypalSignature(userId, userData) {
    // This is a simplified implementation
    // In a real implementation, this would use the birthdate and natal chart data
    // to generate a comprehensive archetypal signature

    if (!userData || !userData.birthdate) {
        return {
            userId,
            signature: {
                keyNumbers: [],
                decanicAlignments: [],
                coreArchetypes: []
            },
            error: 'Insufficient user data'
        };
    }

    // Extract birthdate components
    const birthdate = new Date(userData.birthdate);
    const day = birthdate.getDate();
    const month = birthdate.getMonth() + 1;
    const year = birthdate.getFullYear();

    // Calculate basic numerological values
    const dayNumber = day;
    const monthNumber = month;
    const yearNumber = Array.from(String(year), Number).reduce((a, b) => a + b, 0);
    const lifePathNumber = (dayNumber + monthNumber + yearNumber) % 9 || 9;

    // Map to archetypal signatures (simplified)
    const archetypeMap = {
        1: ['Pioneer', 'Leader'],
        2: ['Diplomat', 'Peacemaker'],
        3: ['Creator', 'Communicator'],
        4: ['Builder', 'Organizer'],
        5: ['Freedom-Seeker', 'Adventurer'],
        6: ['Nurturer', 'Harmonizer'],
        7: ['Mystic', 'Seeker'],
        8: ['Achiever', 'Authority'],
        9: ['Humanitarian', 'Visionary']
    };

    return {
        userId,
        signature: {
            keyNumbers: [dayNumber, monthNumber, yearNumber, lifePathNumber],
            decanicAlignments: [], // Would be derived from natal chart
            coreArchetypes: archetypeMap[lifePathNumber] || []
        }
    };
}

/**
 * Map a user to the concrescence cycle
 * @param {string} userId The user ID
 * @param {string} userContextDescription The user's context description
 * @param {Array} userHistory The user's conversation history
 * @returns {Promise<Object>} The concrescence phase mapping
 */
async function mapToConcrescenceCycle(userId, userContextDescription, userHistory) {
    // This is a simplified implementation
    // In a real implementation, this would analyze the user's context and history
    // to determine their current phase in the 12-fold concrescence cycle

    // Get the concrescence cycle model from the Bimba graph
    const concrescenceModel = await queryBimbaGraph(`
        MATCH (c:ConcrescencePhase)
        RETURN c
        ORDER BY c.position
    `);

    // Simple heuristic for demonstration purposes
    // In reality, this would be a much more sophisticated analysis
    const keywords = {
        '+0': ['beginning', 'start', 'seed', 'potential', 'void'],
        '+1': ['define', 'structure', 'form', 'concept', 'idea'],
        '+2': ['relate', 'connect', 'dynamic', 'process', 'flow'],
        '+3': ['integrate', 'synthesize', 'combine', 'unify', 'whole'],
        '+4': ['contextualize', 'personalize', 'apply', 'embody', 'live'],
        '+5': ['transcend', 'meta', 'beyond', 'recursive', 'complete'],
        '-0': ['reflect', 'review', 'evaluate', 'assess', 'consider'],
        '-1': ['analyze', 'perspective', 'viewpoint', 'angle', 'lens'],
        '-2': ['deconstruct', 'symbolize', 'represent', 'signify', 'mean'],
        '-3': ['dynamize', 'energize', 'activate', 'mobilize', 'charge'],
        '-4': ['structure', 'organize', 'arrange', 'order', 'classify'],
        '-5': ['ground', 'root', 'foundation', 'base', 'support']
    };

    // Count keyword occurrences in the context description and recent history
    const counts = {};
    for (const [phase, words] of Object.entries(keywords)) {
        counts[phase] = 0;
        for (const word of words) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const contextMatches = (userContextDescription || '').match(regex) || [];
            counts[phase] += contextMatches.length;

            // Check recent history
            for (const interaction of userHistory.slice(0, 5)) {
                const historyMatches = (interaction.content || '').match(regex) || [];
                counts[phase] += historyMatches.length * 0.5; // Weight history less than current context
            }
        }
    }

    // Find the phase with the highest count
    let currentPhase = '+0';
    let maxCount = 0;
    for (const [phase, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            currentPhase = phase;
        }
    }

    // Get phase description from the model
    const phaseDescription = concrescenceModel.find(p => p.position === currentPhase)?.description ||
        'Unknown phase in the concrescence cycle';

    // Generate recommendations based on the phase
    const recommendations = [];
    switch (currentPhase) {
        case '+0':
            recommendations.push(
                'Focus on opening to new possibilities',
                'Practice meditation to connect with the void',
                'Allow new seeds of potential to emerge'
            );
            break;
        case '+1':
            recommendations.push(
                'Work on defining and structuring your ideas',
                'Create clear conceptual frameworks',
                'Focus on logical organization'
            );
            break;
        // Add cases for other phases...
        default:
            recommendations.push(
                'Reflect on your current position in the cycle',
                'Consider what phase might come next',
                'Practice awareness of the cyclical nature of transformation'
            );
    }

    return {
        userId,
        phase: currentPhase,
        explanation: phaseDescription,
        recommendations
    };
}

/**
 * Provides contextual application, personalization, and dialogue management.
 * Applies Jungian framework concepts.
 * Primarily informs Node +4 (Contextualize) and Node -1 (Perspective Analysis).
 *
 * @param {import("../../graph/ql_cycle.graph.mjs").SystemState} currentState The current state of the QL cycle.
 * @param {any} additionalInput Specific input relevant to the agent's task (e.g., synthesized info, symbolic data).
 * @returns {Promise<object>} An object containing the agent's output/perspective to update the state.
 */
async function invokeNaraExpertAgent(currentState, additionalInput) {
    console.log("--- Invoking Nara Expert Agent (#5-4-4) ---");

    try {
        const { userId, userQuery } = currentState;

        if (!userId) {
            console.warn("Nara Expert Agent: No user ID provided");
            return {
                naraPerspective: "Unable to provide personalized perspective without user ID.",
                refinedPromptContext: currentState.finalPromptContext,
                suggestedVisualizations: []
            };
        }

        // Retrieve user context
        console.log(`Retrieving context for user ${userId}`);
        const userContext = await getUserContext(userId);
        console.log(`User context retrieved:`, userContext ? 'Success' : 'Not found');

        // Retrieve conversation history
        const conversationHistory = await getConversationHistory(userId);
        console.log(`Retrieved ${conversationHistory.length} conversation history items`);

        // Determine the current node in the QL cycle
        const isAnalysisPhase = additionalInput?.currentNode?.startsWith("-");
        const currentNode = additionalInput?.currentNode || (isAnalysisPhase ? "-1" : "+4");

        let output = {};

        if (isAnalysisPhase) {
            // Node -1: Perspective Analysis
            console.log("Nara Expert Agent: Performing Perspective Analysis (Node -1)");

            // Generate archetypal signature if not already available
            let archetypalSignature = userContext?.archetypalSignature;
            if (!archetypalSignature) {
                archetypalSignature = await generateArchetypalSignature(userId, userContext);
                console.log("Generated archetypal signature:", archetypalSignature);
            }

            // Analyze the query through the lens of the user's archetypal signature
            const personalizedAnalysis = `Query "${userQuery}" analyzed through the lens of user's archetypal signature: ${JSON.stringify(archetypalSignature.signature.coreArchetypes)}`;

            output = {
                naraPerspective: personalizedAnalysis,
                userArchetypalSignature: archetypalSignature,
                personalContext: {
                    userProfile: userContext,
                    recentInteractions: conversationHistory.slice(0, 3)
                }
            };
        } else {
            // Node +4: Contextualization
            console.log("Nara Expert Agent: Performing Contextualization (Node +4)");

            // Map user to concrescence cycle
            const concrescenceMapping = await mapToConcrescenceCycle(
                userId,
                currentState.synthesizedInfo || userQuery,
                conversationHistory
            );
            console.log("Mapped user to concrescence cycle:", concrescenceMapping);

            // Refine the prompt context with personalized elements
            const refinedPromptContext = {
                ...currentState.finalPromptContext,
                userArchetypalSignature: userContext?.archetypalSignature,
                concrescencePhase: concrescenceMapping.phase,
                personalRecommendations: concrescenceMapping.recommendations
            };

            // Suggest visualizations based on the user's archetypal signature and concrescence phase
            const suggestedVisualizations = [];
            if (userContext?.archetypalSignature?.signature?.coreArchetypes?.length > 0) {
                suggestedVisualizations.push({
                    type: 'archetypal-mandala',
                    archetypes: userContext.archetypalSignature.signature.coreArchetypes,
                    description: 'A mandala visualization representing the user\'s core archetypes'
                });
            }

            suggestedVisualizations.push({
                type: 'concrescence-cycle',
                currentPhase: concrescenceMapping.phase,
                description: 'A visualization of the 12-fold concrescence cycle with the user\'s current position highlighted'
            });

            output = {
                naraPerspective: `Personalized context for user ${userId} in concrescence phase ${concrescenceMapping.phase}. ${concrescenceMapping.explanation}`,
                refinedPromptContext,
                suggestedVisualizations,
                concrescenceMapping
            };
        }

        console.log("Nara Expert Agent Output:", output);
        return output;
    } catch (error) {
        console.error("Error in Nara Expert Agent:", error);
        return {
            naraPerspective: "Error in Nara Expert Agent: " + error.message,
            refinedPromptContext: currentState.finalPromptContext,
            suggestedVisualizations: [],
            error: error.message
        };
    }
}

export { invokeNaraExpertAgent };
