// Graphiti Tools for BPMCP - Phase 2 Epic 0 Implementation
// Provides coordinate-aware integration with Graphiti temporal knowledge graph

// Export tool definitions
export { addGraphitiEpisodeTool } from "./addGraphitiEpisode.js";
export { searchGraphitiEntitiesTool } from "./searchGraphitiEntities.js";
export { searchGraphitiFactsTool } from "./searchGraphitiFacts.js";
export { getGraphitiContextTool } from "./getGraphitiContext.js";
export { getGraphitiEpisodesTool } from "./getGraphitiEpisodes.js";
export { 
  deleteGraphitiEpisodeTool,
  deleteGraphitiEntityEdgeTool,
  getGraphitiEntityEdgeTool,
  clearGraphitiGraphTool,
  getGraphitiStatusTool
} from "./graphitiUtils.js";

// Export tool handlers
export { handleAddGraphitiEpisode } from "./addGraphitiEpisode.js";
export { handleSearchGraphitiEntities } from "./searchGraphitiEntities.js";
export { handleSearchGraphitiFacts } from "./searchGraphitiFacts.js";
export { handleGetGraphitiContext } from "./getGraphitiContext.js";
export { handleGetGraphitiEpisodes } from "./getGraphitiEpisodes.js";
export { 
  handleDeleteGraphitiEpisode,
  handleDeleteGraphitiEntityEdge,
  handleGetGraphitiEntityEdge,
  handleClearGraphitiGraph,
  handleGetGraphitiStatus
} from "./graphitiUtils.js";

// Export client and schemas
export { GraphitiClient } from "./client.js";
export * from "./schemas.js";
