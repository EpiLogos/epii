import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ResearchAndIntegrateSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import axios from "axios";

// Tool definition
export const researchAndIntegrateTool: Tool = {
  name: "researchAndIntegrate",
  description: "Research a topic by searching the web and integrate the findings.",
  inputSchema: zodToJsonSchema(ResearchAndIntegrateSchema),
};

/**
 * Research a topic by searching the web and integrate the findings
 * @param dependencies Tool dependencies
 * @param args Tool arguments
 * @returns Tool response
 */
export async function handleResearchAndIntegrate(dependencies: ToolDependencies, args: any) {
  try {
    // Validate arguments
    const validatedArgs = ResearchAndIntegrateSchema.parse(args);
    const logPrefix = `[researchAndIntegrate]`;

    console.log(`${logPrefix} Researching topic: "${validatedArgs.topic}"`);
    console.log(`${logPrefix} Questions: ${validatedArgs.questions.join(', ')}`);

    // In a real implementation, we would use a search API and fetch content from web pages
    // For now, we'll simulate the research process

    // Simulate findings for each question
    const findings: Record<string, any> = {};

    for (const question of validatedArgs.questions) {
      console.log(`${logPrefix} Researching question: "${question}"`);

      // Simulate search results for this question
      const searchResults = [
        {
          title: `Example Result 1 for "${question}"`,
          url: "https://example.com/result1",
          snippet: `This is an example search result snippet related to the question "${question}".`,
          content: validatedArgs.includeSourceContent ? `This is the full content of the page related to "${question}" that would be fetched if includeSourceContent is true.` : null
        },
        {
          title: `Example Result 2 for "${question}"`,
          url: "https://example.com/result2",
          snippet: `Another example search result snippet related to the question "${question}".`,
          content: validatedArgs.includeSourceContent ? `This is the full content of the second page related to "${question}" that would be fetched if includeSourceContent is true.` : null
        }
      ];

      // Limit results
      const limitedResults = searchResults.slice(0, validatedArgs.maxSources);

      // Simulate integrated findings for this question
      findings[question] = {
        answer: `This is a simulated answer to the question "${question}" based on the research findings.`,
        sources: limitedResults
      };
    }

    // Generate integrated research report
    const integratedFindings = validatedArgs.questions.map(question => {
      const questionFindings = findings[question];

      return {
        question: question,
        answer: questionFindings.answer,
        sources: questionFindings.sources.map((source: any) => ({
          title: source.title,
          url: source.url,
          snippet: source.snippet
        }))
      };
    });

    // Return results
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          topic: validatedArgs.topic,
          questions: validatedArgs.questions,
          integratedFindings: integratedFindings
        }, null, 2)
      }]
    };
  } catch (error: any) {
    throw handleError(error, "researchAndIntegrate");
  }
}
