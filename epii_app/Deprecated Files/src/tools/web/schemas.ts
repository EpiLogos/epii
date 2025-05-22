import { z } from "zod";

// Web tools schemas
export const SearchWebSchema = z.object({
  query: z.string().describe("Search query to send to the search engine."),
  limit: z.number().int().min(1).max(20).default(5).describe("Maximum number of results to return (default: 5, max: 20)."),
  safeSearch: z.boolean().default(true).describe("Whether to enable safe search filtering."),
  country: z.string().optional().describe("Optional country code to localize search results (e.g., 'us', 'uk', 'fr')."),
  timeRange: z.enum(["day", "week", "month", "year"]).optional().describe("Optional time range to filter results by."),
});

export const ResearchAndIntegrateSchema = z.object({
  topic: z.string().describe("The topic to research."),
  questions: z.array(z.string()).min(1).describe("Specific questions to answer about the topic."),
  maxSources: z.number().int().min(1).max(10).default(5).describe("Maximum number of sources to use (default: 5, max: 10)."),
  format: z.enum(["markdown", "json"]).default("markdown").describe("Output format (default: markdown)."),
});
