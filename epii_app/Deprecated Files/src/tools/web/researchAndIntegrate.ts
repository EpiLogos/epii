import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { ResearchAndIntegrateSchema } from "./schemas.js";
import { zodToJsonSchema } from "../../utils/zodToJsonSchema.js";
import { Tool, ToolDependencies } from "../../types/index.js";
import { handleError } from "../../utils/error.js";
import axios from "axios";
import { handleSearchWeb } from "./searchWeb.js";

// Tool definition
export const researchAndIntegrateTool: Tool = {
  name: "researchAndIntegrate",
  description: "Research a topic and integrate findings into a coherent response.",
  inputSchema: zodToJsonSchema(ResearchAndIntegrateSchema),
};

/**
 * Research a topic and integrate findings
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
    
    // 1. Search for each question
    const searchResults = [];
    
    for (const question of validatedArgs.questions) {
      // Combine topic and question for better search results
      const searchQuery = `${validatedArgs.topic} ${question}`;
      
      // Use the searchWeb tool to get results
      const searchResponse = await handleSearchWeb(dependencies, {
        query: searchQuery,
        limit: validatedArgs.maxSources,
        safeSearch: true
      });
      
      // Parse the search results
      const searchData = JSON.parse(searchResponse.content[0].text);
      
      // Add to search results
      searchResults.push({
        question: question,
        results: searchData.results
      });
    }
    
    // 2. Fetch content from top results
    const sourceContents = [];
    
    for (const questionResults of searchResults) {
      for (const result of questionResults.results) {
        try {
          // Fetch the page content
          const response = await axios.get(result.url, {
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          // Extract text content (simple approach)
          let content = response.data;
          
          // Remove HTML tags
          content = content.replace(/<[^>]*>/g, ' ');
          
          // Remove extra whitespace
          content = content.replace(/\s+/g, ' ').trim();
          
          // Limit content length
          content = content.substring(0, 5000);
          
          // Add to source contents
          sourceContents.push({
            title: result.title,
            url: result.url,
            content: content,
            question: questionResults.question
          });
          
          console.log(`${logPrefix} Successfully fetched content from ${result.url}`);
        } catch (fetchError: any) {
          console.error(`${logPrefix} Error fetching content from ${result.url}:`, fetchError);
          // Continue with other sources
        }
        
        // Limit the number of sources
        if (sourceContents.length >= validatedArgs.maxSources) {
          break;
        }
      }
    }
    
    // 3. Integrate findings
    const findings = {};
    
    for (const question of validatedArgs.questions) {
      // Get sources relevant to this question
      const relevantSources = sourceContents.filter(source => source.question === question);
      
      // Extract key information
      const information = relevantSources.map(source => {
        return {
          title: source.title,
          url: source.url,
          excerpt: source.content.substring(0, 500)
        };
      });
      
      // Add to findings
      findings[question] = {
        sources: information,
        sourceCount: information.length
      };
    }
    
    // 4. Format response
    let response;
    
    if (validatedArgs.format === 'markdown') {
      let markdown = `# Research: ${validatedArgs.topic}\n\n`;
      
      for (const question of validatedArgs.questions) {
        markdown += `## ${question}\n\n`;
        
        const questionFindings = findings[question];
        
        if (questionFindings.sourceCount === 0) {
          markdown += "No relevant sources found.\n\n";
        } else {
          markdown += "### Sources\n\n";
          
          for (const source of questionFindings.sources) {
            markdown += `- [${source.title}](${source.url})\n`;
            markdown += `  > ${source.excerpt}...\n\n`;
          }
        }
      }
      
      response = markdown;
    } else {
      // JSON format
      response = JSON.stringify({
        topic: validatedArgs.topic,
        questions: validatedArgs.questions.map(question => {
          return {
            question: question,
            sources: findings[question].sources
          };
        })
      }, null, 2);
    }
    
    // Return results
    return {
      content: [{
        type: "text",
        text: response
      }]
    };
  } catch (error: any) {
    throw handleError(error, "researchAndIntegrate");
  }
}
