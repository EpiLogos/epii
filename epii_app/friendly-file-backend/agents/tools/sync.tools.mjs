import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { notionClient, NOTION_DATABASE_ID } from "../../services/notion.service.mjs";
import { graph } from "../../services/neo4j.service.mjs"; // For executing Cypher
import { qdrantClient, QDRANT_COLLECTION_NAME } from "../../services/qdrant.service.mjs"; // For updating metadata
import { getDb } from "../../services/mongo.service.mjs"; // For storing/retrieving last sync time

// --- Sync Notion Updates Tool ---

const syncNotionUpdatesSchema = z.object({
  since: z.string().datetime({ offset: true }).optional().describe("Optional ISO 8601 timestamp. If provided, syncs pages updated after this time. Otherwise, uses the last sync timestamp stored by the system."),
  // Add other potential filters later, e.g., specific page IDs, tags
});

// Helper function to get/set last sync time (using MongoDB)
const SYSTEM_CONFIG_COLLECTION = 'SystemConfig';
const LAST_SYNC_KEY = 'lastNotionSyncTimestamp';

async function getLastSyncTime() {
  try {
    const db = await getDb();
    if (!db) return null;
    const configCollection = db.collection(SYSTEM_CONFIG_COLLECTION);
    const config = await configCollection.findOne({ _id: LAST_SYNC_KEY });
    return config ? config.value : null; // Return the timestamp string or null
  } catch (error) {
    console.error("Error getting last sync time:", error);
    return null;
  }
}

async function setLastSyncTime(timestamp) {
  try {
    const db = await getDb();
    if (!db) return;
    const configCollection = db.collection(SYSTEM_CONFIG_COLLECTION);
    await configCollection.updateOne(
      { _id: LAST_SYNC_KEY },
      { $set: { value: timestamp } },
      { upsert: true } // Create if doesn't exist
    );
    console.log(`Updated last sync time to: ${timestamp}`);
  } catch (error) {
    console.error("Error setting last sync time:", error);
  }
}


const syncNotionUpdatesTool = new DynamicStructuredTool({
  name: "syncNotionUpdates",
  description: `Checks the verified 'Crystallized Knowledge' database in Notion (ID: ${NOTION_DATABASE_ID || 'Not Set'}) for recently updated pages and syncs the relevant information back to the Bimba knowledge graph (Neo4j) and Pratibimba vector store metadata (Qdrant). Can be filtered by providing a 'since' timestamp.`,
  schema: syncNotionUpdatesSchema,
  func: async ({ since }) => {
    console.log(`Starting Notion sync process...`);
    if (!notionClient || !NOTION_DATABASE_ID || !graph || !qdrantClient) {
      return "Error: Required clients (Notion, Neo4j, Qdrant) or Notion DB ID are not available.";
    }

    let pagesSyncedCount = 0;
    let errorsEncountered = 0;
    const currentSyncStartTime = new Date().toISOString(); // Timestamp for this sync run

    try {
      const lastSync = since || await getLastSyncTime();
      console.log(`Syncing Notion pages updated since: ${lastSync || 'Beginning of time'}`);

      const queryParams = {
        database_id: NOTION_DATABASE_ID,
        filter: {
          and: [
            {
              property: "Status", // Assuming a 'Status' property exists
              select: {
                equals: "Verified" // Only sync verified pages
              }
            },
            // Add timestamp filter only if lastSync is available
            ...(lastSync ? [{
              timestamp: "last_edited_time",
              last_edited_time: {
                after: lastSync
              }
            }] : [])
          ]
        },
        sorts: [ // Process oldest first
          {
            timestamp: "last_edited_time",
            direction: "ascending"
          }
        ]
      };

      // TODO: Implement pagination for large result sets using start_cursor
      const response = await notionClient.databases.query(queryParams);

      console.log(`Found ${response.results.length} Notion pages to potentially sync.`);

      for (const page of response.results) {
        try {
          console.log(`Processing page: ${page.id} (Title: ${page.properties.Name?.title[0]?.plain_text || 'N/A'})`);

          // --- 1. Parse Notion Page ---
          // Extract relevant data from page.properties and potentially page content (blocks)
          // This logic depends heavily on the Notion DB structure
          const pageId = page.id;
          const properties = page.properties;
          // Example: Extracting a 'ConceptName' property and 'QLTags' multi-select
          const conceptName = properties.Name?.title[0]?.plain_text; // Adjust property name 'Name'
          const qlTags = properties['QL Tags']?.multi_select.map(tag => tag.name) || []; // Adjust property name 'QL Tags'
          const description = properties.Description?.rich_text[0]?.plain_text || ''; // Adjust property name 'Description'
          // ... extract other relevant properties ...

          if (!conceptName) {
              console.warn(`Skipping page ${pageId}: Missing concept name.`);
              continue;
          }

          // --- 2. Translate to Bimba Updates (Neo4j Cypher) ---
          // Generate Cypher query to MERGE/SET node properties in Neo4j
          // Example: Merge concept node and set properties
          const cypherQuery = `
            MERGE (c:Concept {name: $name})
            ON CREATE SET c.notionPageId = $pageId, c.description = $description, c.qlTags = $qlTags, c.lastSynced = timestamp()
            ON MATCH SET c.notionPageId = $pageId, c.description = $description, c.qlTags = $qlTags, c.lastSynced = timestamp()
            RETURN c.name as conceptName
          `;
          const cypherParams = { name: conceptName, pageId, description, qlTags };

          // --- 3. Execute Bimba Updates ---
          console.log(`Executing Cypher for ${conceptName}:`, cypherQuery, cypherParams);
          const neo4jResult = await graph.query(cypherQuery, cypherParams);
          console.log(`Neo4j update result for ${conceptName}:`, neo4jResult);

          // --- 4. Translate to Pratibimba Updates (Qdrant Metadata) ---
          // Find corresponding point in Qdrant (assuming ID matches Notion Page ID or a stored memoryId)
          // Update the payload metadata (e.g., ql_tags)
          // This requires knowing how Notion pages link to Qdrant points (e.g., via notionPageId in payload)
          const qdrantPointId = pageId; // Assumption: Qdrant point ID = Notion Page ID
          const qdrantPayloadUpdate = {
              ql_tags: qlTags, // Update QL tags in Qdrant payload
              lastSynced: currentSyncStartTime,
              // ... update other relevant metadata ...
          };
          console.log(`Updating Qdrant point ${qdrantPointId} with payload:`, qdrantPayloadUpdate);
          // Use setPayload or overwritePayload depending on desired behavior
          await qdrantClient.setPayload(QDRANT_COLLECTION_NAME, {
              payload: qdrantPayloadUpdate,
              points: [qdrantPointId],
              wait: true,
          });


          pagesSyncedCount++;
        } catch (pageError) {
          console.error(`Error processing page ${page.id}:`, pageError);
          errorsEncountered++;
        }
      }

      // --- 5. Update Last Sync Time ---
      // Only update if the sync was successful or partially successful
      if (errorsEncountered < response.results.length) { // Or adjust condition as needed
         await setLastSyncTime(currentSyncStartTime);
      }

      return JSON.stringify({
          success: true,
          pagesFound: response.results.length,
          pagesSynced: pagesSyncedCount,
          errors: errorsEncountered,
          lastSyncTimeUpdatedTo: (errorsEncountered < response.results.length) ? currentSyncStartTime : await getLastSyncTime() // Report the time it was set to
      });

    } catch (error) {
      console.error("Error during Notion sync process:", error.body || error);
      return `Error syncing Notion updates: ${error.message || error.body}`;
    }
  },
});

export { syncNotionUpdatesTool };
