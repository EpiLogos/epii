import { Client as NotionClient } from "@notionhq/client";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Config, Services } from "../types/index.js";

/**
 * Initialize services
 * @param config Configuration object
 * @returns Services
 */
export function initializeServices(config: Config): Services {
  // Initialize Notion client
  const notionClient = new NotionClient({
    auth: config.notion.apiKey,
  });
  
  // Initialize Google embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: config.google.apiKey,
    modelName: config.google.embeddingModel,
  });
  
  return {
    notionClient,
    embeddings,
  };
}
