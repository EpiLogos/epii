import { z } from "zod";

// Web tools schemas
export const SearchWebSchema = z.object({
  query: z.string().describe("Search query to execute."),
  limit: z.number().int().min(1).max(20).default(5).describe("Maximum number of results to return (default: 5)."),
  includeContent: z.boolean().default(false).describe("Whether to include the content of the search results."),
});

export const ResearchAndIntegrateSchema = z.object({
  topic: z.string().describe("The topic to research."),
  questions: z.array(z.string()).describe("Specific questions to answer about the topic."),
  maxSources: z.number().int().min(1).max(20).default(5).describe("Maximum number of sources to use per question (default: 5)."),
  includeSourceContent: z.boolean().default(false).describe("Whether to include the full content of the sources in the response."),
});
