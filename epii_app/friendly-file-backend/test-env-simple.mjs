import dotenv from 'dotenv';
dotenv.config();
console.log('MONGODB_URI loaded:', !!process.env.MONGODB_URI);
console.log('NEO4J_URI loaded:', !!process.env.NEO4J_URI);
console.log('GOOGLE_API_KEY loaded:', !!process.env.GOOGLE_API_KEY);
console.log('QDRANT_URL loaded:', !!process.env.QDRANT_URL);
