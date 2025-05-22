import { Client } from "@notionhq/client";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables relative to the project root (.env in friendly-file-backend)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_CRYSTALLIZED_DB_ID; // Need DB ID for creating pages

if (!NOTION_API_KEY) {
  console.warn("Notion environment variable (NOTION_API_KEY) not set. Notion client initialization will fail.");
  // throw new Error("Missing required Notion environment variable: NOTION_API_KEY.");
}
if (!NOTION_DATABASE_ID) {
    console.warn("Notion environment variable (NOTION_CRYSTALLIZED_DB_ID) not set. Cannot create pages without target database ID.");
    // throw new Error("Missing required Notion environment variable: NOTION_CRYSTALLIZED_DB_ID.");
}

let notionClient = null;

if (NOTION_API_KEY) {
    try {
        notionClient = new Client({ auth: NOTION_API_KEY });
        console.log("Notion client initialized successfully.");
        // Could add a test call here, e.g., retrieve database info
    } catch (error) {
        console.error("Failed to initialize Notion client:", error);
        notionClient = null;
    }
}

export { notionClient, NOTION_DATABASE_ID };
