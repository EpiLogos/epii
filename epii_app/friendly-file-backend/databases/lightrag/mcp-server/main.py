import os
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import os
import os
import os # Ensure os is imported only once
import logging
import asyncio
import numpy as np
from functools import partial # Import partial
from dotenv import load_dotenv
import uuid  # ADD: for generating valid UUIDs
from lightrag.lightrag import LightRAG
from lightrag.llm.openai import openai_embed, openai_complete_if_cache # Import the functions
from lightrag.utils import EmbeddingFunc # Corrected import path, keep EmbeddingFunc
# Removed unused import: from lightrag.core import DataItem, Component

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="LightRAG MCP Server",
    description="Provides an interface to LightRAG for ingestion and retrieval, harmonized with Bimba coordinates.",
    version="0.1.0",
)

# --- Pydantic Models for API (Moved Before Usage & Corrected) ---
class IngestRequest(BaseModel):
    chunk_text: str # Correct field name
    bimba_coordinates: List[str] = Field(default_factory=list) # Correct field name

class IngestResponse(BaseModel):
    status: str
    message: str
    document_id: str | None = None # Or however LightRAG identifies ingested docs

class RetrieveRequest(BaseModel):
    query: str
    mode: str = Field(default="mix", description="LightRAG query mode: naive, local, global, hybrid, mix")
    top_k: int = Field(default=50, description="Number of results to retrieve")

class RetrieveResponse(BaseModel):
    fused_context: Any # Define more specifically later
    lightrag_raw_result: Any # Optional: for debugging
    status: str

class RawChunksRequest(BaseModel):
    query: str
    coordinate_filter: List[str] = Field(default_factory=list)
    max_chunks: int = Field(default=10)
    threshold: float = Field(default=0.7)

class RawChunksResponse(BaseModel):
    chunks: List[Dict[str, Any]]
    total_found: int
    status: str

# --- Configuration Loading (Example - Refine as needed) ---
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
LIGHTRAG_NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "lightragDB") # DB for LightRAG's graph
BIMBA_NEO4J_DATABASE = "neo4j" # Default DB for Bimba graph

QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "pratibimba_store")

# Construct and set QDRANT_URL environment variable for LightRAG
qdrant_url = f"http://{QDRANT_HOST}:{QDRANT_PORT}"
os.environ["QDRANT_URL"] = qdrant_url
logger.info(f"Setting QDRANT_URL environment variable to: {qdrant_url}")

# --- LLM & Embedding Function Setup ---
# Load API keys and endpoints from .env
GEMINI_API_KEY = os.getenv("LLM_BINDING_API_KEY")
GEMINI_ENDPOINT = os.getenv("LLM_BINDING_HOST")
GEMINI_LLM_MODEL = os.getenv("LLM_MODEL", "gemini-2.5-pro-preview-03-25")
GEMINI_EMBED_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-004")
EMBEDDING_DIM = int(os.getenv("EMBEDDING_DIM", 768))

# Check if API key is provided
if not GEMINI_API_KEY or "your_google_ai_studio_api_key_here" in GEMINI_API_KEY:
    logger.error("Gemini API key not found or not replaced in .env file. Please add it.")
    # You might want to exit or raise an error here in a real application
    # For now, we'll let it proceed but log the error.
    # raise ValueError("Gemini API key is missing in .env file")

# --- Define Wrapper Functions ---
async def wrapped_llm_func(prompt: str, **kwargs):
    """Wrapper to ensure correct arguments are passed to openai_complete_if_cache."""
    # Extract history_messages if present in kwargs, otherwise default to None or []
    history_messages = kwargs.pop('history_messages', None)
    system_prompt = kwargs.pop('system_prompt', None)
    # Add any other specific args openai_complete_if_cache might need from kwargs

    logger.debug(f"wrapped_llm_func called with prompt length: {len(prompt)}, kwargs: {kwargs.keys()}")
    try:
        # Call the underlying function with arguments in the correct order
        return await openai_complete_if_cache(
            model=GEMINI_LLM_MODEL, # Explicitly pass model name first
            prompt=prompt,          # Pass the received prompt second
            system_prompt=system_prompt,
            history_messages=history_messages,
            api_key=GEMINI_API_KEY,
            base_url=GEMINI_ENDPOINT,
            **kwargs # Pass remaining kwargs
        )
    except Exception as e:
        logger.error(f"Error in wrapped_llm_func: {e}", exc_info=True)
        raise # Re-raise the exception

async def wrapped_embedding_func(texts: list[str], **kwargs):
    """Wrapper to ensure correct arguments are passed to openai_embed."""
    logger.debug(f"wrapped_embedding_func called with {len(texts)} texts, kwargs: {kwargs.keys()}")
    try:
        # Call the underlying function with arguments in the correct order
        return await openai_embed(
            texts=texts,
            model=GEMINI_EMBED_MODEL, # Explicitly pass model name
            api_key=GEMINI_API_KEY,
            base_url=GEMINI_ENDPOINT,
            **kwargs # Pass remaining kwargs
        )
    except Exception as e:
        logger.error(f"Error in wrapped_embedding_func: {e}", exc_info=True)
        raise # Re-raise the exception

# Wrap the embedding function in EmbeddingFunc to attach the dimension and max_token_size
DEFAULT_EMBEDDING_MAX_TOKEN_SIZE = 8192
embedding_func_instance = EmbeddingFunc(
    embedding_dim=EMBEDDING_DIM,
    max_token_size=DEFAULT_EMBEDDING_MAX_TOKEN_SIZE,
    func=wrapped_embedding_func # Use the wrapper function here
)

# --- LightRAG Initialization ---
lightrag_instance = LightRAG(
    embedding_func=embedding_func_instance,
    llm_model_func=wrapped_llm_func,
    llm_model_name=GEMINI_LLM_MODEL,
    node2vec_params={'dimensions': EMBEDDING_DIM, 'num_walks': 10, 'walk_length': 40, 'window_size': 2, 'iterations': 3, 'random_seed': 3},
    graph_storage="Neo4JStorage",
    vector_storage="QdrantVectorDBStorage",
    embedding_func_max_async=4,
    llm_model_max_async=1,
    embedding_batch_num=8,
    addon_params={"insert_batch_size": 2}
    # kv_storage="MongoKVStorage", # Uncomment if using MongoDB for KV
    # doc_status_storage="MongoDocStatusStorage" # Uncomment if using MongoDB for Status
)

# --- Application Startup Logic ---
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up LightRAG MCP Server...")
    try:
        await lightrag_instance.initialize_storages()
        logger.info("LightRAG storages initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize LightRAG storages: {e}", exc_info=True)
        # Depending on severity, you might want to prevent the app from starting fully

from qdrant_client import models as qdrant_models # Import Qdrant models
from lightrag.utils import compute_mdhash_id # Import ID generation utility

# --- API Endpoints --- # (Old Pydantic models removed from here)

@app.get("/health", summary="Health Check")
async def health_check():
    """Basic health check endpoint."""
    # TODO: Add checks for DB connections, LightRAG init status
    logger.info("Health check endpoint called.")
    return {"status": "ok", "message": "LightRAG MCP Server is running."}

@app.post("/ingest", response_model=IngestResponse, summary="Ingest Document with Bimba Coordinates")
async def ingest_document(request: IngestRequest = Body(...)): # Use corrected IngestRequest model
    """
    Ingests a single text chunk into LightRAG, building the 'archetypes' graph
    and storing the vector in Qdrant with associated Bimba coordinates in the payload.
    """
    # Access data using correct attribute names from the IngestRequest model
    logger.info(f"Received ingest request for chunk with coordinates: {request.bimba_coordinates}")
    if not lightrag_instance or not lightrag_instance.vector_storage or not lightrag_instance.graph_storage:
         raise HTTPException(status_code=503, detail="LightRAG instance or storages not initialized")
    # Dynamically check if chunks_vdb exists and is the correct type
    # Dynamically check if chunks_vdb exists and is the correct type
    # NOTE: This check might need adjustment depending on how LightRAG exposes storage instances
    # if not hasattr(lightrag_instance, 'chunks_vdb') or not isinstance(lightrag_instance.chunks_vdb, QdrantVectorDBStorage):
    #      raise HTTPException(status_code=500, detail="Vector storage (chunks_vdb) is not configured correctly for Qdrant")

    try:
        # Access data using correct attribute names from the IngestRequest model
        chunk_text = request.chunk_text
        bimba_coords = request.bimba_coordinates
        # Generate a valid UUID string for Qdrant point ID
        chunk_id = str(uuid.uuid4())
        # Assume a placeholder doc_id for now, or require it from Node.js if needed for graph processing
        # Using a hash of the first 100 chars for a pseudo-doc ID might group related chunks loosely
        doc_id = f"doc_{compute_mdhash_id(chunk_text[:100])}"

        # Prepare chunk data structure for LightRAG's internal processing
        # Note: LightRAG's internal methods might expect slightly different structures.
        # We might need to adjust this based on testing or deeper inspection.
        # Key is to have 'content' for embedding and graph processing.
        chunk_for_graph_processing = {
            chunk_id: {
                "content": chunk_text,
                "full_doc_id": doc_id, # Link to the pseudo-doc ID
                "file_path": "api_ingest", # Placeholder file path
                # Add other metadata LightRAG might expect if known (e.g., tokens - calculate if needed)
            }
        }

        # 1. Process Entity/Relation Graph (writes to Neo4j 'archetypes' DB)
        # This step extracts entities/relations from the chunk_text and updates the Neo4j graph
        # specified by NEO4J_DATABASE=archetypes in .env
        logger.info(f"Processing graph for chunk_id: {chunk_id}")
        await lightrag_instance._process_entity_relation_graph(chunk_for_graph_processing)
        logger.info("Processed entity/relation graph.")

        # 2. Generate Embedding for the chunk text
        # LightRAG's internal methods should handle calling the embedding_func passed during init
        # We might need to call a specific LightRAG method here if _process_entity_relation_graph doesn't embed.
        # For now, assume embedding happens within the graph processing or is handled separately if needed.
        # Let's retrieve the embedding directly using the function for upsertion.
        logger.info(f"Generating embedding for chunk_id: {chunk_id}")
        # Pass necessary args like model name if the function requires it and LightRAG doesn't pass it automatically
        # Use the EmbeddingFunc instance which now wraps wrapped_embedding_func
        embedding_vector_array = await embedding_func_instance(texts=[chunk_text]) # Call the instance
        if embedding_vector_array is None or len(embedding_vector_array) == 0:
            raise ValueError("Failed to generate embedding for the chunk.")
        embedding_vector = embedding_vector_array[0] # Get the first (only) embedding
        logger.info("Embedding generated.")

        # 3. Prepare Qdrant Point Payload with Bimba Coordinates
        # Start with the basic metadata LightRAG might use internally
        payload = chunk_for_graph_processing[chunk_id].copy()
        # *** Add the crucial Bimba Coordinates ***
        payload["bimba_coordinates"] = bimba_coords
        # Ensure payload is clean JSON-serializable (should be fine with strings and lists)

        qdrant_point = qdrant_models.PointStruct(
            id=chunk_id, # Use the consistent chunk ID
            vector=embedding_vector.tolist(), # Corrected: Convert the whole array to list
            payload=payload,
        )

        # 4. Upsert the point with enriched payload to Qdrant
        logger.info(f"Upserting point {chunk_id} to Qdrant collection: {QDRANT_COLLECTION}")
        # Access the underlying Qdrant client directly via the storage adapter instance
        # This bypasses any potential payload stripping in a higher-level LightRAG upsert method
        # Ensure chunks_vdb is initialized and accessible
        if not hasattr(lightrag_instance, 'chunks_vdb') or lightrag_instance.chunks_vdb is None:
             raise HTTPException(status_code=500, detail="Vector storage (chunks_vdb) is not initialized or accessible.")
        # Assuming chunks_vdb has a _client attribute holding the Qdrant client
        if not hasattr(lightrag_instance.chunks_vdb, '_client') or lightrag_instance.chunks_vdb._client is None:
             raise HTTPException(status_code=500, detail="Qdrant client instance not found within chunks_vdb.")

        qdrant_client = lightrag_instance.chunks_vdb._client
        qdrant_client.upsert(
             collection_name=QDRANT_COLLECTION, # Use the configured collection name
             points=[qdrant_point],
             wait=True # Ensure operation completes before proceeding
        )
        logger.info("Upserted chunk to Qdrant with Bimba coordinates.")

        # 5. Persist changes (e.g., graph updates, KV stores if used)
        # This calls index_done_callback() on configured storages
        await lightrag_instance._insert_done()

        # Return chunk_id as confirmation, doc_id is less meaningful here
        return IngestResponse(status="success", message=f"Ingested chunk {chunk_id} with Bimba coordinates.", document_id=chunk_id)

    except Exception as e:
        logger.error(f"Detailed ingestion failed for chunk: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Detailed ingestion failed: {str(e)}")

@app.post("/retrieve", response_model=RetrieveResponse, summary="Retrieve Context using LightRAG")
async def retrieve_context(request: RetrieveRequest = Body(...)):
    """
    Retrieves context using LightRAG's 'mix' mode.
    (Note: Bimba graph query and coordinate filtering happen in the calling Node.js service)
    """
    logger.info(f"Received retrieve request for query: '{request.query}'")
    if not lightrag_instance or not lightrag_instance.vector_storage or not lightrag_instance.graph_storage:
         raise HTTPException(status_code=503, detail="LightRAG instance or storages not initialized")

    try:
        # Import QueryParam here or globally if used elsewhere
        from lightrag.base import QueryParam # Corrected import path

        # Use parameters from request
        top_k_value = request.top_k
        query_param = QueryParam(mode=request.mode, top_k=top_k_value)

        # --- Direct Neo4j Connection Test ---
        from neo4j import AsyncGraphDatabase # Import driver

        temp_driver = None
        try:
            logger.debug("Attempting direct Neo4j connection test...")
            # Use credentials and DB name from loaded env vars
            temp_driver = AsyncGraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USERNAME, NEO4J_PASSWORD), database=LIGHTRAG_NEO4J_DATABASE)
            async with temp_driver.session() as session:
                result_cursor = await session.run("MATCH (n) RETURN count(n) AS count")
                record = await result_cursor.single()
                node_count = record['count'] if record else -1
                logger.debug(f"Direct Neo4j connection test successful. Node count in '{LIGHTRAG_NEO4J_DATABASE}': {node_count}")
        except Exception as test_e:
            logger.error(f"Direct Neo4j connection test FAILED: {test_e}", exc_info=True)
            # Raise an HTTP exception to make the failure clear in the API response
            raise HTTPException(status_code=503, detail=f"Direct Neo4j connection test failed: {str(test_e)}")
        finally:
            if temp_driver:
                await temp_driver.close()
                logger.debug("Direct Neo4j test driver closed.")
        # --- End Direct Neo4j Connection Test ---

        # Use different LightRAG methods based on mode
        logger.info(f"Calling LightRAG with mode='{request.mode}', top_k={top_k_value}")

        if request.mode == "naive":
            # Use naive mode for raw vector search (no synthesis)
            logger.info("Using naive mode for raw vector search")

            # DEBUG: Check what's actually in the database
            try:
                # Check Qdrant collection info
                collection_info = await lightrag_instance.chunks_vdb._client.get_collection(QDRANT_COLLECTION)
                logger.info(f"Qdrant collection '{QDRANT_COLLECTION}' has {collection_info.points_count} points")

                # Try a broader search to see if there's ANY data
                broad_search = await lightrag_instance.chunks_vdb._client.search(
                    collection_name=QDRANT_COLLECTION,
                    query_vector=query_embedding,
                    limit=5,
                    score_threshold=0.0,  # Very low threshold
                    with_payload=True
                )
                logger.info(f"Broad search found {len(broad_search)} results")
                for i, result in enumerate(broad_search):
                    logger.info(f"Result {i}: score={result.score}, coordinates={result.payload.get('bimba_coordinates', 'none')}")

            except Exception as debug_e:
                logger.error(f"Debug search failed: {debug_e}")

            result = await lightrag_instance.aquery(request.query, param=query_param)

            # For naive mode, result should be raw search results
            logger.info(f"LightRAG naive retrieval successful. Result type: {type(result)}")
            logger.debug(f"LightRAG Naive Result: {result}")

            return RetrieveResponse(status="success", fused_context=result, lightrag_raw_result=result)
        else:
            # Use aquery for synthesis modes (mix, local, global, hybrid)
            logger.info(f"Using synthesis mode: {request.mode}")
            result = await lightrag_instance.aquery(request.query, param=query_param)

            # The result is the synthesized string response from the LLM
            logger.info(f"LightRAG synthesis retrieval successful. Result type: {type(result)}")
            logger.debug(f"LightRAG Synthesis Result: {result}")

            return RetrieveResponse(status="success", fused_context=result, lightrag_raw_result=result)

    except Exception as e:
        logger.error(f"LightRAG retrieval call failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"LightRAG retrieval call failed: {str(e)}")

@app.post("/raw-chunks", response_model=RawChunksResponse, summary="Retrieve Raw Document Chunks")
async def retrieve_raw_chunks(request: RawChunksRequest = Body(...)):
    """
    Retrieves raw document chunks from Qdrant vector storage with coordinate filtering.
    Returns actual document chunks with scores, not synthesized responses.
    """
    logger.info(f"Received raw chunks request for query: '{request.query}' with coordinates: {request.coordinate_filter}")

    if not lightrag_instance or not lightrag_instance.chunks_vdb:
        raise HTTPException(status_code=503, detail="LightRAG vector storage not initialized")

    try:
        # Generate embedding for the query
        embedding_vector_array = await embedding_func_instance(texts=[request.query])
        if embedding_vector_array is None or len(embedding_vector_array) == 0:
            raise ValueError("Failed to generate embedding for query")

        query_embedding = embedding_vector_array[0]
        logger.info(f"Generated query embedding with dimension: {len(query_embedding)}")

        # Prepare search filter for coordinates if provided
        search_filter = None
        if request.coordinate_filter:
            # Create Qdrant filter for bimba_coordinates
            from qdrant_client.models import Filter, FieldCondition, MatchAny
            search_filter = Filter(
                must=[
                    FieldCondition(
                        key="bimba_coordinates",
                        match=MatchAny(any=request.coordinate_filter)
                    )
                ]
            )
            logger.info(f"Applied coordinate filter: {request.coordinate_filter}")

        # Search Qdrant directly for raw chunks
        search_results = await lightrag_instance.chunks_vdb._client.search(
            collection_name=QDRANT_COLLECTION,
            query_vector=query_embedding,
            limit=request.max_chunks,
            score_threshold=request.threshold,
            query_filter=search_filter,
            with_payload=True
        )

        # Format results as raw chunks with metadata
        chunks = []
        for result in search_results:
            chunk_data = {
                "id": result.id,
                "score": float(result.score),
                "content": result.payload.get("content", ""),
                "bimba_coordinates": result.payload.get("bimba_coordinates", []),
                "full_doc_id": result.payload.get("full_doc_id", ""),
                "file_path": result.payload.get("file_path", ""),
                "metadata": result.payload
            }
            chunks.append(chunk_data)

        logger.info(f"Retrieved {len(chunks)} raw chunks")

        return RawChunksResponse(
            status="success",
            chunks=chunks,
            total_found=len(chunks)
        )

    except Exception as e:
        logger.error(f"Raw chunks retrieval failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Raw chunks retrieval failed: {str(e)}")

# --- Main Execution ---
if __name__ == "__main__":
    import uvicorn
    # Run with uvicorn server, e.g., uvicorn main:app --reload --port 8001
    # The port should be different from the Node.js backend (3001)
    # We'll configure the actual running via MCP settings later.
    logger.info("Starting FastAPI server for development (use MCP config for deployment).")
    # Example: uvicorn.run(app, host="0.0.0.0", port=8001) # Port TBD
