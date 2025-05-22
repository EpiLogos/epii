import os
from qdrant_client import QdrantClient, models
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file in the current directory
load_dotenv()

QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
# QDRANT_API_KEY = os.getenv("QDRANT_API_KEY") # Add if API key is needed

# Collections managed by LightRAG that might have wrong dimension
COLLECTIONS_TO_DELETE = ["chunks", "entities", "relationships"]

qdrant_url = f"http://{QDRANT_HOST}:{QDRANT_PORT}"

logger.info(f"Attempting to connect to Qdrant at: {qdrant_url}")

try:
    # Initialize Qdrant client
    client = QdrantClient(
        url=qdrant_url,
        # api_key=QDRANT_API_KEY, # Uncomment if using API key
        timeout=60 # Increase timeout
    )

    for collection_name in COLLECTIONS_TO_DELETE:
        logger.info(f"Checking collection: {collection_name}")
        # Check if collection exists before attempting deletion
        try:
            collection_info = client.get_collection(collection_name=collection_name)
            logger.info(f"Collection '{collection_name}' found. Attempting deletion...")
            client.delete_collection(collection_name=collection_name, timeout=60)
            logger.info(f"Successfully deleted Qdrant collection: {collection_name}")
        except Exception as e:
            # Handle cases where collection doesn't exist (might be ValueError or specific Qdrant exception)
            logger.warning(f"Could not delete collection '{collection_name}'. It might not exist or another error occurred: {e}")

except Exception as e:
    logger.error(f"Failed to connect to Qdrant or delete collections: {e}", exc_info=True)
