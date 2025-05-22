import { qlCycleGraph } from '../graph/ql_cycle.graph.mjs'; // Keep for Nara mode for now
import { runPipeline as runEpiiPipeline } from '../pipelines/epii_analysis_pipeline_refactored.mjs'; // Import the refactored Epii pipeline
// Placeholder for future Nara mode specific logic/graph
// import { naraSimpleRAG } from '../workflows/nara.workflow.mjs';

// Placeholder functions for different mode workflows
// async function runEpiiCycle(initialState) { // Replaced by runEpiiAnalysisPipeline
//     console.log("--- Running Epii Mode (Full QL Cycle) ---");
//     // TODO: Potentially add Epii-specific state initialization or checks
//     try {
//         const result = await qlCycleGraph.invoke(initialState);
//         console.log("Epii Cycle Result:", result);
//         return result;
//     } catch (error) {
//         console.error("Error invoking Epii QL Cycle:", error);
//         return { error: `Epii Cycle Error: ${error.message}` };
//     }
// }

async function runNaraMode(initialState) {
    console.log("--- Running Nara Mode (Simple RAG Placeholder) ---");
    // TODO: Implement simpler RAG path using LightRAG/B-P MCP tools + LLM
    // For now, just return a placeholder response
    return {
        llmResponse: { // Mimic final state structure
            content: `Placeholder response for Nara mode. Query: "${initialState.userQuery}"`,
            _getType: () => 'ai' // Mimic AIMessage type
        }
    };
    // Later, this might call a subset of QL nodes or specific Nara agent logic
    // const result = await naraSimpleRAG(initialState);
    // return result;
}


const handleChatRequest = async (req, res) => {
    // Destructure all possible parameters
    const { userId, message, history, mode = 'nara', targetCoordinate, fileId, documentContent, documentId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    // Check for required parameters based on the mode
    if (mode === 'epii') {
        // For Epii mode, we need a message
        if (!message) {
            return res.status(400).json({ error: 'message is required for epii mode' });
        }
    } else {
        // For Nara mode, we need a message
        if (!message) {
            return res.status(400).json({ error: 'message is required for nara mode' });
        }
    }

    console.log(`Received chat request for userId: ${userId}, mode: ${mode}`);
    if (mode === 'epii') {
        if (documentId) {
            console.log(`Chat with document context, documentId: ${documentId}`);
        } else if (targetCoordinate) {
            console.log(`Chat with coordinate context: ${targetCoordinate}`);
        } else {
            console.log(`Standard chat without specific context`);
        }
    }

    const initialState = {
        userId,
        userQuery: message,
        history: history || [], // Ensure history is an array
        mode, // Pass mode into the state
        targetCoordinate, // Add targetCoordinate to initialState
        fileId, // Add fileId to initialState
        documentContent, // Add document content to initialState
        documentId // Add documentId to initialState
    };

    try {
        let finalState;
        if (mode === 'epii') {
            // Invoke the Epii analysis pipeline
            finalState = await runEpiiPipeline(initialState);
        } else { // Default to Nara mode
            // Keep Nara mode using the placeholder for now
            finalState = await runNaraMode(initialState);
        }

        if (finalState.error) {
             console.error(`Error in ${mode} mode processing:`, finalState.error);
             // Send a generic error or the specific one depending on policy
             return res.status(500).json({ error: `Processing error in ${mode} mode.` });
        }

        // Handle response based on mode
        if (mode === 'epii') {
            // This is an Epii mode chat message
            res.json({
                message: finalState.epiiPerspective || finalState.llmResponse?.content || 'No response generated',
                documentId: finalState.documentId,
                targetCoordinate: finalState.targetCoordinate,
                tool_calls: finalState.toolResults || null
            });
        } else { // Nara mode response handling
            const finalAiMessage = finalState.llmResponse;
            if (!finalAiMessage) {
                 console.error("Nara mode final state did not contain llmResponse:", finalState);
                 return res.status(500).json({ error: 'Failed to generate final AI response for Nara mode.' });
            }
            res.json({
                response: finalAiMessage.content,
                tool_calls: finalAiMessage.tool_calls || null,
                displayCoordinate: finalState.displayCoordinate || null,
            });
        }

    } catch (error) {
        console.error('Error processing chat request:', error);
        res.status(500).json({ error: 'Internal server error during chat processing.' });
    }
};

export default { handleChatRequest };
