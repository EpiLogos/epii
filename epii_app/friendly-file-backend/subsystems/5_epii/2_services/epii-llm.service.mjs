import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from "langsmith";
import { traceable } from "langsmith/traceable";
import { RunTree } from "langsmith/run_trees";
import langsmithTracing from '../../../databases/shared/services/langsmith-tracing.mjs';
import { getCachedLLMResponse } from '../../../databases/shared/utils/cache.utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded correctly
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check if API key is loaded
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Error: GOOGLE_API_KEY not found in environment variables.");
  process.exit(1);
}

/**
 * Epii LLM Service - Provides specialized LLM instances for different stages
 * of the Epii document analysis pipeline.
 */
class EpiiLLMService {
  constructor() {
    // Initialize LLM instances for different pipeline stages
    this.initializeLLMs();

    // Initialize embeddings model
    this.initializeEmbeddings();

    console.log("Epii LLM Service initialized successfully.");
  }

  /**
   * Initialize different LLM instances for various pipeline stages
   */
  initializeLLMs() {
    // Stage -4: Contextualization LLM (needs strong context understanding)
    this.contextLLM = new ChatGoogleGenerativeAI({
      apiKey,
      model: process.env.EPII_CONTEXT_LLM_MODEL || process.env.SYNTHESIS_LLM_MODEL_PAID,
      temperature: 0.3,
      maxOutputTokens: 4096,
    });

    // Stage -3: Structure Integration LLM (needs pattern recognition)
    this.structureLLM = new ChatGoogleGenerativeAI({
      apiKey,
      model: process.env.EPII_STRUCTURE_LLM_MODEL || process.env.SYNTHESIS_LLM_MODEL_PAID,
      temperature: 0.2,
      maxOutputTokens: 4096,
    });

    // Stage -2: Concept Relation LLM (needs strong reasoning)
    this.relationLLM = new ChatGoogleGenerativeAI({
      apiKey,
      model: process.env.EPII_RELATION_LLM_MODEL || process.env.SYNTHESIS_LLM_MODEL_PAID,
      temperature: 0.2,
      maxOutputTokens: 4096,
    });

    // Stage -1: Core Element Definition LLM (needs precision and longer output)
    this.elementLLM = new ChatGoogleGenerativeAI({
      apiKey,
      model: process.env.EPII_ELEMENT_LLM_MODEL || process.env.SYNTHESIS_LLM_MODEL_PAID,
      temperature: 0.1,
      maxOutputTokens: 8192,  // Increased from 4096 to handle detailed core elements
    });

    // Stage -0: Payload Synthesis LLM (needs creativity and integration)
    this.synthesisLLM = new ChatGoogleGenerativeAI({
      apiKey,
      model: process.env.EPII_SYNTHESIS_LLM_MODEL || process.env.SYNTHESIS_LLM_MODEL_PAID,
      temperature: 0.4,
      maxOutputTokens: 8192,
    });

    // Chat LLM for interactive document exploration
    this.chatLLM = new ChatGoogleGenerativeAI({
      apiKey,
      model: process.env.EPII_CHAT_LLM_MODEL || process.env.SYNTHESIS_LLM_MODEL_PAID,
      temperature: 0.7,
      maxOutputTokens: 4096,
    });
  }

  /**
   * Initialize embeddings model
   */
  initializeEmbeddings() {
    try {
      this.embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey,
        model: process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004",
      });
    } catch (error) {
      console.error("Failed to initialize embeddings model:", error);
      this.embeddings = null;
    }
  }

  /**
   * Get the appropriate LLM for a specific pipeline stage
   * @param {number} stage - The pipeline stage (-4 to 0)
   * @returns {ChatGoogleGenerativeAI} - The appropriate LLM instance
   */
  getLLMForStage(stage) {
    switch(stage) {
      case -4: return this.contextLLM;
      case -3: return this.structureLLM;
      case -2: return this.relationLLM;
      case -1: return this.elementLLM;
      case 0: return this.synthesisLLM;
      default: return this.synthesisLLM; // Default to synthesis LLM
    }
  }

  /**
   * Generate content using the appropriate LLM for a specific stage
   * @param {number} stage - The pipeline stage (-4 to 0)
   * @param {string} systemPrompt - The system prompt
   * @param {string} userPrompt - The user prompt
   * @param {object} options - Additional options
   * @param {RunTree} [options.parentRun] - Optional parent run for tracing
   * @returns {Promise<string>} - The generated content
   */
  async generateContent(stage, systemPrompt, userPrompt, options = {}) {
    const llm = this.getLLMForStage(stage);
    const stageName = this.getStageName(stage);
    const { parentRun, ...llmOptions } = options;

    // Create inputs object for tracing
    const inputs = {
      systemPrompt,
      userPrompt,
      model: llm.model,
      temperature: llm.temperature,
      maxOutputTokens: llm.maxOutputTokens,
      ...llmOptions
    };

    try {
      // Determine if this call should be cached
      // Only cache deterministic calls (low temperature) and non-creative stages
      const shouldCache = llm.temperature <= 0.1 || stage === -1 || stage === -2;

      // If we have a parent run, create a child run for this LLM call
      if (parentRun) {
        const llmRun = langsmithTracing.createLLMRun(
          parentRun,
          `${stageName} LLM Call`,
          inputs
        );

        try {
          let content;

          if (shouldCache) {
            // Use cached LLM response if applicable
            content = await getCachedLLMResponse(
              userPrompt,
              async (prompt, opts) => {
                const response = await llm.invoke([
                  ["system", systemPrompt],
                  ["human", prompt]
                ]);
                return response.content;
              },
              { ...llmOptions, systemPrompt, temperature: llm.temperature }
            );
          } else {
            // Direct LLM call for non-cached responses
            const response = await llm.invoke([
              ["system", systemPrompt],
              ["human", userPrompt]
            ]);
            content = response.content;
          }

          // End the run with success
          langsmithTracing.endRunSuccess(llmRun, { content });
          return content;
        } catch (error) {
          // End the run with error
          langsmithTracing.endRunError(llmRun, error);
          throw error;
        }
      } else {
        // Direct LLM call without tracing
        try {
          if (shouldCache) {
            // Use cached LLM response if applicable
            return await getCachedLLMResponse(
              userPrompt,
              async (prompt, opts) => {
                const response = await llm.invoke([
                  ["system", systemPrompt],
                  ["human", prompt]
                ]);
                return response.content;
              },
              { ...llmOptions, systemPrompt, temperature: llm.temperature }
            );
          } else {
            // Direct LLM call for non-cached responses
            const response = await llm.invoke([
              ["system", systemPrompt],
              ["human", userPrompt]
            ]);
            return response.content;
          }
        } catch (error) {
          console.error(`Error in direct LLM call for stage ${stage}:`, error);
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error generating content for stage ${stage}:`, error);
      throw error;
    }
  }

  /**
   * Get a human-readable name for a pipeline stage
   * @param {number} stage - The pipeline stage (-4 to 0)
   * @returns {string} - The stage name
   */
  getStageName(stage) {
    switch(stage) {
      case -4: return "Contextualization";
      case -3: return "Structure Integration";
      case -2: return "Concept Relation";
      case -1: return "Core Element Definition";
      case 0: return "Payload Synthesis";
      default: return `Stage ${stage}`;
    }
  }

  /**
   * Generate chat response for document exploration
   * @param {string} systemPrompt - The system prompt
   * @param {Array} messages - The chat history
   * @param {object} options - Additional options
   * @returns {Promise<string>} - The generated response
   */
  async generateChatResponse(systemPrompt, messages, options = {}) {
    try {
      console.log(`Generating chat response with ${messages.length} messages...`);

      // Format messages for the LLM
      const formattedMessages = [
        ["system", systemPrompt],
        ...messages.map(msg => [
          msg.role === 'user' ? 'human' : 'assistant',
          msg.content || (msg.role === 'user' ? "Please help me" : "I'll help you with that")
        ])
      ];

      // Simple direct call to the LLM without tracing
      const response = await this.chatLLM.invoke(formattedMessages);

      // Safely handle response content
      const content = typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

      console.log(`Generated response: ${content.substring(0, 50)}...`);
      return content;
    } catch (error) {
      console.error("Error generating chat response:", error);
      return `I'm sorry, I encountered an error while processing your request: ${error.message}`;
    }
  }

  /**
   * Generate embeddings for text
   * @param {string} text - The text to embed
   * @param {object} options - Additional options
   * @param {RunTree} [options.parentRun] - Optional parent run for tracing
   * @returns {Promise<number[]>} - The embedding vector
   */
  async generateEmbedding(text, options = {}) {
    if (!this.embeddings) {
      throw new Error("Embeddings model not initialized");
    }

    const { parentRun } = options;

    // Create inputs object for tracing
    const inputs = {
      text,
      model: this.embeddings.model
    };

    try {
      let embedding;

      // If we have a parent run, create a child run for this embedding call
      if (parentRun) {
        const embeddingRun = langsmithTracing.createToolRun(
          parentRun,
          "Generate Embedding",
          inputs
        );

        try {
          embedding = await this.embeddings.embedQuery(text);

          // End the run with success
          langsmithTracing.endRunSuccess(embeddingRun, {
            embedding_size: embedding.length,
            // Don't include the full embedding vector in the trace to save space
            embedding_sample: embedding.slice(0, 5)
          });
        } catch (error) {
          // End the run with error
          langsmithTracing.endRunError(embeddingRun, error);
          throw error;
        }
      } else {
        // Direct embedding call without tracing
        embedding = await this.embeddings.embedQuery(text);
      }

      return embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const epiiLLMService = new EpiiLLMService();
export default epiiLLMService;
