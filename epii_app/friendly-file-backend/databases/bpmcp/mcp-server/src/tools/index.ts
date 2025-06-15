import { Tool, ToolHandler } from "../types/index.js";

// Import all tool definitions and handlers
import * as bimbaTools from "./bimba/index.js";
import * as pratibimbaTools from "./pratibimba/index.js";
import * as mongoTools from "./mongo/index.js";
import * as notionTools from "./notion/index.js";
import * as webTools from "./web/index.js";
import * as documentTools from "./document/index.js";
import * as graphitiTools from "./graphiti/index.js";
import { broadcastEventTool, broadcastEventHandler } from "./broadcastEvent.js";

// Collect all tool definitions
export const tools: Tool[] = [
  // Bimba tools
  bimbaTools.bimbaKnowingTool,
  bimbaTools.generateBimbaEmbeddingsTool,
  bimbaTools.queryBimbaGraphTool,
  bimbaTools.updateBimbaGraphTool,
  bimbaTools.manageBimbaRelationshipsTool,
  bimbaTools.resolveBimbaCoordinateTool,

  // Pratibimba tools
  pratibimbaTools.searchPratibimbaContextTool,

  // Mongo tools
  mongoTools.getMongoContextTool,

  // Notion tools
  notionTools.queryNotionTool,
  notionTools.getNotionPagePropertiesTool,
  notionTools.appendNotionBlockTool,
  notionTools.crystallizeToNotionTool,

  // Web tools
  webTools.searchWebTool,
  webTools.researchAndIntegrateTool,

  // Document tools
  documentTools.listDocumentsTool,
  documentTools.getDocumentByIdTool,
  documentTools.listDocumentsByCoordinateTool,
  documentTools.storeDocumentTool,
  documentTools.updateDocumentTool,
  documentTools.deleteDocumentTool,
  documentTools.startDocumentAnalysisTool,

  // Graphiti tools (Phase 2 Epic 0)
  graphitiTools.addGraphitiEpisodeTool,
  graphitiTools.searchGraphitiEntitiesTool,
  graphitiTools.searchGraphitiFactsTool,
  graphitiTools.getGraphitiContextTool,
  graphitiTools.getGraphitiEpisodesTool,
  graphitiTools.deleteGraphitiEpisodeTool,
  graphitiTools.deleteGraphitiEntityEdgeTool,
  graphitiTools.getGraphitiEntityEdgeTool,
  graphitiTools.clearGraphitiGraphTool,
  graphitiTools.getGraphitiStatusTool,

  // Event tools
  broadcastEventTool,
];

// Export all handlers
export const handlers: Record<string, ToolHandler> = {
  // Bimba handlers
  "bimbaKnowing": bimbaTools.handleBimbaKnowing,
  "generateBimbaEmbeddings": bimbaTools.handleGenerateBimbaEmbeddings,
  "queryBimbaGraph": bimbaTools.handleQueryBimbaGraph,
  "updateBimbaGraph": bimbaTools.handleUpdateBimbaGraph,
  "manageBimbaRelationships": bimbaTools.handleManageBimbaRelationships,
  "resolveBimbaCoordinate": bimbaTools.handleResolveBimbaCoordinate,

  // Pratibimba handlers
  "searchPratibimbaContext": pratibimbaTools.handleSearchPratibimbaContext,

  // Mongo handlers
  "getMongoContext": mongoTools.handleGetMongoContext,

  // Notion handlers
  "queryNotion": notionTools.handleQueryNotion,
  "getNotionPageProperties": notionTools.handleGetNotionPageProperties,
  "appendNotionBlock": notionTools.handleAppendNotionBlock,
  "crystallizeToNotion": notionTools.handleCrystallizeToNotion,

  // Web handlers
  "searchWeb": webTools.handleSearchWeb,
  "researchAndIntegrate": webTools.handleResearchAndIntegrate,

  // Document handlers
  "listDocuments": documentTools.handleListDocuments,
  "getDocumentById": documentTools.handleGetDocumentById,
  "listDocumentsByCoordinate": documentTools.handleListDocumentsByCoordinate,
  "storeDocument": documentTools.handleStoreDocument,
  "updateDocument": documentTools.handleUpdateDocument,
  "deleteDocument": documentTools.handleDeleteDocument,
  "startDocumentAnalysis": documentTools.handleStartDocumentAnalysis,

  // Graphiti handlers (Phase 2 Epic 0)
  "addGraphitiEpisode": graphitiTools.handleAddGraphitiEpisode,
  "searchGraphitiEntities": graphitiTools.handleSearchGraphitiEntities,
  "searchGraphitiFacts": graphitiTools.handleSearchGraphitiFacts,
  "getGraphitiContext": graphitiTools.handleGetGraphitiContext,
  "getGraphitiEpisodes": graphitiTools.handleGetGraphitiEpisodes,
  "deleteGraphitiEpisode": graphitiTools.handleDeleteGraphitiEpisode,
  "deleteGraphitiEntityEdge": graphitiTools.handleDeleteGraphitiEntityEdge,
  "getGraphitiEntityEdge": graphitiTools.handleGetGraphitiEntityEdge,
  "clearGraphitiGraph": graphitiTools.handleClearGraphitiGraph,
  "getGraphitiStatus": graphitiTools.handleGetGraphitiStatus,

  // Event handlers
  "broadcastEvent": broadcastEventHandler,
};
