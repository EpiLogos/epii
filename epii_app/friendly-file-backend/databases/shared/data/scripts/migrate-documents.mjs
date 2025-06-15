/**
 * MongoDB Document Migration Script
 * 
 * This script migrates documents from the lowercase "documents" collection
 * to the correct capitalized "Documents" and "pratibimbaDocuments" collections.
 * 
 * Usage:
 * node scripts/migrate-documents.mjs
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'bpmcp';

// Source and destination collections
const SOURCE_COLLECTION = 'documents'; // lowercase (incorrect)
const BIMBA_COLLECTION = 'Documents'; // capitalized (correct)
const PRATIBIMBA_COLLECTION = 'pratibimbaDocuments'; // correct

async function migrateDocuments() {
  console.log('Starting document migration...');
  console.log(`MongoDB URI: ${MONGODB_URI}`);
  console.log(`Database: ${DB_NAME}`);
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Check if source collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes(SOURCE_COLLECTION)) {
      console.log(`Source collection "${SOURCE_COLLECTION}" does not exist. No migration needed.`);
      return;
    }
    
    console.log(`Found source collection: ${SOURCE_COLLECTION}`);
    
    // Get all documents from source collection
    const sourceCollection = db.collection(SOURCE_COLLECTION);
    const documents = await sourceCollection.find({}).toArray();
    
    console.log(`Found ${documents.length} documents in source collection`);
    
    // Create destination collections if they don't exist
    if (!collectionNames.includes(BIMBA_COLLECTION)) {
      await db.createCollection(BIMBA_COLLECTION);
      console.log(`Created destination collection: ${BIMBA_COLLECTION}`);
    }
    
    if (!collectionNames.includes(PRATIBIMBA_COLLECTION)) {
      await db.createCollection(PRATIBIMBA_COLLECTION);
      console.log(`Created destination collection: ${PRATIBIMBA_COLLECTION}`);
    }
    
    const bimbaCollection = db.collection(BIMBA_COLLECTION);
    const pratibimbaCollection = db.collection(PRATIBIMBA_COLLECTION);
    
    // Counters for statistics
    let bimbaCount = 0;
    let pratibimbaCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Process each document
    for (const doc of documents) {
      try {
        // Determine document type
        let documentType = doc.documentType || 'bimba'; // Default to bimba if not specified
        
        // Additional heuristics to determine document type
        if (!doc.documentType) {
          if (doc.bimbaId || doc.sourceSelection || doc.crystallizationIntent || doc.crystallizationDate) {
            documentType = 'pratibimba';
          }
        }
        
        // Check if document already exists in destination collection
        const destCollection = documentType === 'pratibimba' ? pratibimbaCollection : bimbaCollection;
        const existingDoc = await destCollection.findOne({ _id: doc._id });
        
        if (existingDoc) {
          console.log(`Document ${doc._id} already exists in destination collection. Skipping.`);
          skippedCount++;
          continue;
        }
        
        // Add documentType field if missing
        if (!doc.documentType) {
          doc.documentType = documentType;
        }
        
        // Insert document into appropriate collection
        await destCollection.insertOne(doc);
        
        if (documentType === 'pratibimba') {
          pratibimbaCount++;
        } else {
          bimbaCount++;
        }
        
        console.log(`Migrated document ${doc._id} to ${documentType === 'pratibimba' ? PRATIBIMBA_COLLECTION : BIMBA_COLLECTION}`);
      } catch (error) {
        console.error(`Error migrating document ${doc._id}:`, error);
        errorCount++;
      }
    }
    
    // Print statistics
    console.log('\nMigration complete!');
    console.log(`Total documents processed: ${documents.length}`);
    console.log(`Migrated to ${BIMBA_COLLECTION}: ${bimbaCount}`);
    console.log(`Migrated to ${PRATIBIMBA_COLLECTION}: ${pratibimbaCount}`);
    console.log(`Skipped (already exist): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    
    // Ask if user wants to delete the source collection
    console.log('\nWARNING: The source collection still exists.');
    console.log('To delete it, run the following command in MongoDB shell:');
    console.log(`db.${SOURCE_COLLECTION}.drop()`);
    console.log('Or restart this script with the --delete-source flag');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateDocuments().catch(console.error);
