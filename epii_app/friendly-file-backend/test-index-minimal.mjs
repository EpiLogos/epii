import dotenv from 'dotenv';
dotenv.config();

console.log('=== Environment Variables Test ===');
console.log('MONGODB_URI:', !!process.env.MONGODB_URI);
console.log('NEO4J_URI:', !!process.env.NEO4J_URI);
console.log('GOOGLE_API_KEY:', !!process.env.GOOGLE_API_KEY);
console.log('QDRANT_URL:', !!process.env.QDRANT_URL);

// Test importing a service that checks env vars
import './databases/neo4j/neo4j.service.mjs';
