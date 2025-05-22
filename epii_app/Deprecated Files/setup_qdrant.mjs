import { qdrantClient, QDRANT_COLLECTION_NAME } from './services/qdrant.service.mjs';
import dotenv from 'dotenv';

// Load environment variables to get the vector size
dotenv.config({ path: './.env' });

// Define vector parameters based on environment variables
const VECTOR_SIZE = parseInt(process.env.QDRANT_VECTOR_SIZE || '768', 10); // Default to 768 if not set
const DISTANCE_METRIC = 'Cosine'; // Cosine is suitable for semantic similarity

async function setupQdrantCollection() {
  console.log(`--- Setting up Qdrant Collection: ${QDRANT_COLLECTION_NAME} ---`);

  if (!qdrantClient) {
    console.error("Qdrant client is not initialized. Cannot setup collection.");
    return;
  }

  try {
    // Check if collection exists
    console.log(`Checking if collection '${QDRANT_COLLECTION_NAME}' exists...`);
    // Attempt to get collection info.
    const collectionInfo = await qdrantClient.getCollection(QDRANT_COLLECTION_NAME);
    console.log(`Collection '${QDRANT_COLLECTION_NAME}' already exists.`);

    // Verify existing collection parameters
    const existingVectorParams = collectionInfo.vectors_config?.params; // Structure for single vector config
    if (!existingVectorParams || existingVectorParams.size !== VECTOR_SIZE || existingVectorParams.distance !== DISTANCE_METRIC) {
        console.warn(`Existing collection parameters do not match desired config (Size: ${VECTOR_SIZE}, Distance: ${DISTANCE_METRIC}).`);
        console.warn(`Existing params: Size: ${existingVectorParams?.size}, Distance: ${existingVectorParams?.distance}`);
        console.log(`Recreating collection '${QDRANT_COLLECTION_NAME}'...`);
        try {
            await qdrantClient.deleteCollection(QDRANT_COLLECTION_NAME);
            console.log(`Deleted existing collection '${QDRANT_COLLECTION_NAME}'.`);
            await qdrantClient.createCollection(QDRANT_COLLECTION_NAME, {
                vectors: {
                    size: VECTOR_SIZE,
                    distance: DISTANCE_METRIC,
                },
            });
            console.log(`Successfully recreated collection '${QDRANT_COLLECTION_NAME}' with correct parameters.`);
        } catch (recreationError) {
            console.error(`Failed to recreate collection '${QDRANT_COLLECTION_NAME}':`, recreationError);
            return; // Stop if recreation fails
        }
    } else {
        console.log("Existing collection parameters match desired config.");
    }

  } catch (error) {
    // Check if error indicates collection not found
    if (error.message?.includes('Not found') || error.status === 404 || error.code === 'NOT_FOUND' || error.message?.includes('doesn\'t exist')) {
      console.log(`Collection '${QDRANT_COLLECTION_NAME}' not found. Creating...`);
      try {
        await qdrantClient.createCollection(QDRANT_COLLECTION_NAME, {
          vectors: {
            size: VECTOR_SIZE,
            distance: DISTANCE_METRIC,
          },
          // Add other configurations like indexing options if needed later
          // e.g., hnsw_config, optimizers_config, quantization_config
        });
        console.log(`Successfully created collection '${QDRANT_COLLECTION_NAME}' with vector size ${VECTOR_SIZE} and distance metric ${DISTANCE_METRIC}.`);
      } catch (creationError) {
        console.error(`Failed to create collection '${QDRANT_COLLECTION_NAME}':`, creationError);
      }
    } else {
      // Log other errors encountered during check
      console.error(`Error checking/accessing collection '${QDRANT_COLLECTION_NAME}':`, error);
    }
  } finally {
    console.log("--- Qdrant Setup Complete ---");
    // Note: The qdrantClient doesn't typically need explicit closing for a short script
  }
}

setupQdrantCollection();
