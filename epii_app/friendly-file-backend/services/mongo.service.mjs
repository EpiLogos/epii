import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables relative to the project root (.env in friendly-file-backend)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'epii_logos_db'; // Default DB name if not set

if (!MONGODB_URI) {
  console.warn("MongoDB environment variable (MONGODB_URI) not set. MongoDB connection will fail.");
  // Depending on requirements, you might throw an error here instead:
  // throw new Error("Missing required MongoDB environment variable: MONGODB_URI.");
}

let client = null;
let db = null;

async function connectToMongoDB() {
  if (db && client?.topology?.isConnected()) {
    // console.log('Already connected to MongoDB');
    return { client, db };
  }

  if (!MONGODB_URI) {
    console.error("Cannot connect to MongoDB: MONGODB_URI is not defined.");
    return { client: null, db: null };
  }

  try {
    client = new MongoClient(MONGODB_URI); // Add options if needed, e.g., { useNewUrlParser: true, useUnifiedTopology: true } for older drivers
    await client.connect();
    db = client.db(MONGODB_DB_NAME);
    console.log(`Successfully connected to MongoDB database: ${MONGODB_DB_NAME}`);
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    client = null;
    db = null;
    // Optionally re-throw or handle error appropriately
    // throw error;
    return { client, db };
  }
}

// Export a function that returns the connected db instance
// This ensures the connection is established before the db is used
async function getDb() {
  if (!db || !client?.topology?.isConnected()) {
    await connectToMongoDB();
  }
  return db;
}

// Optionally export the client if direct client access is needed elsewhere
async function getClient() {
   if (!client || !client?.topology?.isConnected()) {
    await connectToMongoDB();
  }
  return client;
}


export { connectToMongoDB, getDb, getClient, MONGODB_DB_NAME };
