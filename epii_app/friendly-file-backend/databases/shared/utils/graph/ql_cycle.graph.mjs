import { StateGraph, END } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools"; // Use DynamicStructuredTool
import { z } from "zod"; // Import Zod
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from 'dotenv';
import axios from 'axios'; // Import axios

// Import Locally Defined Tool Instances (Potentially used by imported nodes)
import { queryBimbaGraphTool } from '../tools/graph.tools.mjs';
import { searchPratibimbaContextTool } from '../tools/vector.tools.mjs';
import { getConversationHistoryTool, getUserContextTool, manageMemoryTool } from '../tools/mongo.tools.mjs';
// import { proposeNotionUpdateTool } from '../tools/notion.tools.mjs';

// Import Services (Potentially used by imported nodes)
import { embedText } from '../../services/google-ai-agent.service.mjs';
// import { getDb } from "../databases/mongodb/mongo.service.mjs"; // Now imported within node_5_respond_update

// Import Node Functions
import { node_0_Intake } from './nodes/node_0_intake.mjs';
import { node_1_Define } from './nodes/node_1_define.mjs';
import { node_2_Relate } from './nodes/node_2_relate.mjs';
import { node_3_Integrate } from './nodes/node_3_integrate.mjs';
import { node_4_Contextualize } from './nodes/node_4_contextualize.mjs';
import { node_5_Respond_Update } from './nodes/node_5_respond_update.mjs';


// Load environment variables (adjust path relative to graph file location)
// Note: Env vars are also loaded within each node file now for potential standalone testing,
// but loading here ensures they are available for LLM init if needed globally.
dotenv.config({ path: '../.env' });

// --- Configuration ---
// LLM Initialization is now handled within the node files where they are used (node_3, node_5)
// const LIGHTRAG_MCP_SERVER_URL = process.env.LIGHTRAG_MCP_SERVER_URL || "http://localhost:8001"; // Config now likely needed in node_2_relate.mjs

/**
 * @typedef {object} SystemState Represents the state of the QL Cycle graph.
 * @property {string} userId - Input user ID.
 * @property {string} userQuery - Input user query.
 * @property {BaseMessage[]} history - Input conversation history (LangChain message objects).
 * @property {string} [mode] - Added to track 'epii' or 'nara' mode.
 * @property {string[]} [initialKeywords] - From Node 0.
 * @property {Array<{name: string, bimba_coordinate: string, labels: string[]}>} [identifiedConcepts] - From Node 1. // Updated type
 * @property {any} [lightragContext] - Raw context from LightRAG (Node 2).
 * @property {any} [bimbaContext] - Raw context from direct Bimba query (Node 2).
 * @property {any} [filteredSemanticContext] - Raw context from filtered Qdrant search (Node 2).
 * @property {string | null} [displayCoordinate] - The single Bimba coordinate selected for frontend display (Node 2).
 * @property {string} [synthesizedInfo] - From Node 3 (LLM synthesis).
 * @property {any} [finalPromptContext] - From Node 4 (Formatted info + history).
 * @property {BaseMessage} [llmResponse] - Final AI message from Node 5.
 * @property {any} [notionUpdatePayload] - Data prepared for Notion tool in Node 5 (via hypothetical tool call).
 * @property {any} [kgUpdateProposal] - Data prepared for potential Bimba update (future).
 * @property {string} [error] - Error message if any node fails.
 */

// Define the full graph state schema structure (used by StateGraph channels)
const graphStateSchema = {
    userId: null,
    userQuery: null,
    history: [],
    mode: 'nara', // Default mode, controller should override
    initialKeywords: null,
    identifiedConcepts: null,
    lightragContext: null,
    bimbaContext: null,
    filteredSemanticContext: null,
    displayCoordinate: null,
    synthesizedInfo: null,
    finalPromptContext: null,
    llmResponse: null,
    notionUpdatePayload: null,
    kgUpdateProposal: null,
    error: null,
};


// --- Node Definitions (Imported from ./nodes/) ---
// The actual async function definitions are now in separate files.


// --- Graph Definition ---

/** @type {import("@langchain/langgraph").Channels} */
const channels = graphStateSchema; // Define channels using the state structure

const workflow = new StateGraph({
  channels: graphStateSchema, // Use the schema with all keys defined
});

// Add nodes using the imported functions
workflow.addNode("node_0_Intake", node_0_Intake);
workflow.addNode("node_1_Define", node_1_Define);
workflow.addNode("node_2_Relate", node_2_Relate);
workflow.addNode("node_3_Integrate", node_3_Integrate);
workflow.addNode("node_4_Contextualize", node_4_Contextualize);
workflow.addNode("node_5_Respond_Update", node_5_Respond_Update);

// Define edges for the sequential QL + cycle
// TODO: Add conditional logic based on 'mode' and (-) cycle implementation later
workflow.setEntryPoint("node_0_Intake");
workflow.addEdge("node_0_Intake", "node_1_Define");
workflow.addEdge("node_1_Define", "node_2_Relate");
workflow.addEdge("node_2_Relate", "node_3_Integrate");
workflow.addEdge("node_3_Integrate", "node_4_Contextualize");
workflow.addEdge("node_4_Contextualize", "node_5_Respond_Update");
workflow.addEdge("node_5_Respond_Update", END); // End after the final node

// Compile the graph
const qlCycleGraph = workflow.compile();

export { qlCycleGraph }; // Export the compiled graph
// Note: SystemState is defined via JSDoc, not exported as a type
