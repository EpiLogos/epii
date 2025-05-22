import express from 'express';
import { Document } from "@langchain/core/documents";
// Removed embedAndStoreChunks from import as it's handled by the Python server now
import { chunkDocuments, getBimbaCoordinateMap } from '../pipelines/ingestion.pipeline.mjs';
// Note: runIngestionPipeline is not typically called from an API route directly,
// but keeping the import for potential future refactoring or direct triggering if needed.
// import { runIngestionPipeline } from '../pipelines/ingestion.pipeline.mjs';

const router = express.Router();

// POST /api/ingest/text
// Accepts raw text content and metadata, then processes it through the ingestion pipeline.
router.post('/text', async (req, res) => {
    const { textContent, metadata } = req.body;

    if (!textContent || typeof textContent !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid textContent in request body.' });
    }
    if (!metadata || typeof metadata !== 'object') {
         return res.status(400).json({ error: 'Missing or invalid metadata object in request body.' });
    }
     // Basic check for targetCoordinates, adjust as needed
    if (!metadata.targetCoordinates || !Array.isArray(metadata.targetCoordinates)) {
       console.warn("Metadata received without targetCoordinates for text ingestion.");
       // Decide if this is an error or if default coordinates should be used
       // return res.status(400).json({ error: 'Metadata must include targetCoordinates array.' });
    }


    console.log(`Received text ingestion request. Metadata:`, metadata);

    try {
        // 1. Create a LangChain Document object
        // Ensure metadata includes essential fields like source if possible
        const docMetadata = {
            source: metadata.source || 'procured_text', // Default source if not provided
            ...metadata // Include all provided metadata
        };
        const documents = [new Document({ pageContent: textContent, metadata: docMetadata })];

        // 2. Get Bimba Map (needed for coordinate assignment during storage)
        const coordinateMap = await getBimbaCoordinateMap();
        if (!coordinateMap) {
            console.error("Ingestion failed: Cannot run ingestion without Bimba coordinate map.");
            return res.status(500).json({ error: "Failed to load Bimba coordinate map." });
        }

        // 3. Chunk the document
        // Attach metadata BEFORE chunking (chunkDocuments expects metadata on the doc)
        documents.forEach(doc => {
            doc.metadata = { ...(doc.metadata || {}), ...metadata };
        });
        const chunks = await chunkDocuments(documents);

        // 4. Embed and Store - This logic is now handled by the Python server via runIngestionPipeline
        // Instead of calling embedAndStoreChunks, this endpoint might need to:
        // a) Save the raw text to a temporary file in the ingestion directory
        // b) Trigger runIngestionPipeline on that directory
        // c) Or directly call the Python /ingest endpoint (less ideal as it bypasses pipeline logic)
        // For now, let's comment out the old call and log a TODO.
        // await embedAndStoreChunks(chunks, coordinateMap);
        console.warn("TODO: Refactor /api/ingest/text endpoint. Embedding and storage now handled by LightRAG server via runIngestionPipeline.");
        // For now, just log success, but no actual storage happened via this route.
        // Consider triggering the main pipeline or returning an appropriate message.
        // Option: Trigger the pipeline (requires file handling)
        // Option: Return a message indicating manual pipeline run is needed for this text.
        // Let's return a message for now.

        console.log(`Received text for ingestion. Source: ${docMetadata.source}. Manual pipeline run required.`);
        // res.status(200).json({ message: 'Text content successfully ingested.', chunkCount: chunks.length });
        res.status(200).json({ message: 'Text received. Run ingestion pipeline manually or via dedicated trigger.', chunkCount: chunks.length });

    } catch (error) {
        console.error('Error during procured text ingestion:', error);
        res.status(500).json({ error: 'Failed to ingest text content.', details: error.message });
    }
});

export default router;
