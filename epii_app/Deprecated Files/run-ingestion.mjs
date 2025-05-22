import { runIngestionPipeline } from './pipelines/ingestion.pipeline.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the target directory relative to this script's location
const targetDirectory = path.resolve(__dirname, './test_data'); // Changed from data_to_ingest

// Define any specific metadata for this ingestion run
const uploadMetadata = {
  source_type: 'text_file', // Or determine dynamically if needed
  // Add other relevant metadata if required by the pipeline
};

console.log(`Starting ingestion from directory: ${targetDirectory}`);

runIngestionPipeline(targetDirectory, uploadMetadata)
  .then(() => {
    console.log("Ingestion script finished successfully.");
    process.exit(0); // Exit with success code
  })
  .catch((error) => {
    console.error("Ingestion script failed:", error);
    process.exit(1); // Exit with error code
  });
