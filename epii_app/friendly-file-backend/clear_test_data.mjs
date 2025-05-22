import { qdrantClient, QDRANT_COLLECTION_NAME } from './services/qdrant.service.mjs';
import { getDb, MONGODB_DB_NAME } from './services/mongo.service.mjs'; // Removed closeDb import

const MONGO_COLLECTION_TO_DROP = 'IngestedData'; // Collection used by ingestion pipeline

async function clearQdrantCollection() {
  console.log(`--- Clearing Qdrant Collection: ${QDRANT_COLLECTION_NAME} ---`);
  if (!qdrantClient) {
    console.error("Qdrant client not available. Skipping Qdrant clear.");
    return false;
  }

  try {
    console.log(`Attempting to delete all points from collection '${QDRANT_COLLECTION_NAME}'...`);
    // We need a filter that matches all points.
    // A simple way is to filter for points that have a mandatory field, like 'timestamp'.
    // Adjust the field name if 'timestamp' isn't guaranteed on all your points.
    // Corrected method name from deletePoints to delete
    // Removed points: [] as it's not needed when deleting by filter
    const deleteResult = await qdrantClient.delete(QDRANT_COLLECTION_NAME, {
       filter: {
           must: [
               {
                   key: 'timestamp', // Assuming 'timestamp' exists on all points
                   range: { gte: '1970-01-01T00:00:00Z' } // Match any valid timestamp
               }
           ]
       }
    });
    console.log("Qdrant delete points result:", deleteResult);
    if (deleteResult?.status === 'ok' || deleteResult?.status === 'acknowledged') {
         console.log(`Successfully cleared points from Qdrant collection '${QDRANT_COLLECTION_NAME}'.`);
         return true;
    } else {
        console.warn(`Qdrant delete operation status: ${deleteResult?.status}. Collection might not be fully cleared.`);
        return false;
    }
  } catch (error) {
    // Handle case where collection might not exist - that's okay for clearing.
    if (error.message?.includes('Not found') || error.status === 404 || error.code === 'NOT_FOUND' || error.message?.includes('doesn\'t exist')) {
        console.log(`Qdrant collection '${QDRANT_COLLECTION_NAME}' does not exist. Nothing to clear.`);
        return true; // Considered success as the end state is an empty collection
    } else {
        console.error(`Error clearing Qdrant collection '${QDRANT_COLLECTION_NAME}':`, error);
        return false;
    }
  }
}

async function clearMongoCollection() {
    console.log(`--- Clearing MongoDB Collection: ${MONGO_COLLECTION_TO_DROP} ---`);
    let db;
    try {
        db = await getDb();
        if (!db) {
            console.error("MongoDB connection not available. Skipping MongoDB clear.");
            return false;
        }
        console.log(`Attempting to drop collection '${MONGO_COLLECTION_TO_DROP}' from database '${MONGODB_DB_NAME}'...`);
        const collections = await db.listCollections({ name: MONGO_COLLECTION_TO_DROP }).toArray();
        if (collections.length > 0) {
            await db.collection(MONGO_COLLECTION_TO_DROP).drop();
            console.log(`Successfully dropped MongoDB collection '${MONGO_COLLECTION_TO_DROP}'.`);
        } else {
            console.log(`MongoDB collection '${MONGO_COLLECTION_TO_DROP}' does not exist. Nothing to drop.`);
        }
        return true;
    } catch (error) {
        console.error(`Error dropping MongoDB collection '${MONGO_COLLECTION_TO_DROP}':`, error);
        return false;
    }
}

async function main() {
    console.log("Starting test data clearing process...");

    const qdrantCleared = await clearQdrantCollection();
    const mongoCleared = await clearMongoCollection();

    if (qdrantCleared && mongoCleared) {
        console.log("\nTest data clearing process completed successfully.");
    } else {
        console.error("\nTest data clearing process finished with errors.");
    }

    // MongoDB connection closing is handled by the service or process exit
    console.log("MongoDB connection managed globally or closeDb not exported/needed here.");
}

main().catch(error => {
    console.error("Clearing script failed:", error);
    process.exit(1);
});
