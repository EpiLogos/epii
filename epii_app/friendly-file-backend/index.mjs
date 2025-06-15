import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors'; // Add missing cors import
import path from 'path';
import { fileURLToPath } from 'url';

// Import database connection and configurations
import connectDB from './databases/shared/data/config/db.config.mjs';
import corsOptions from './databases/shared/data/config/cors.config.mjs';

// Import routes
import chatRoutes from './databases/api/routes/chat.routes.mjs';
import filesRoutes from './databases/api/routes/files.routes.mjs';
import agentRoutes from './databases/api/routes/agent.routes.mjs';
import notionRoutes from './databases/api/routes/notion.routes.mjs'; // Import Notion routes
import graphRoutes from './databases/api/routes/graph.routes.mjs'; // Import Graph routes
import nodeDetailsRoutes from './databases/api/routes/nodeDetails.routes.mjs'; // Import Node Details routes
import epiiAgentRoutes from './subsystems/5_epii/5_integration/routes/epii-agent.routes.mjs'; // Import Epii Agent routes
import documentsRoutes from './databases/api/routes/documents.routes.mjs'; // Import Documents routes
import bpmcpRoutes from './databases/api/routes/bpmcp.routes.mjs'; // Import BPMCP routes
import userRoutes from './subsystems/4_nara/5_integration/routes/user.routes.mjs'; // Import User routes
import analysisRoutes from './subsystems/5_epii/5_integration/routes/analysis.routes.mjs'; // Import Analysis routes
import { mahamayaRoutes, initializeRoutes } from './subsystems/4_nara/5_integration/routes/mahamaya-routes.mjs'; // Import Nara Mahamaya routes
import decanicRoutes from './subsystems/4_nara/5_integration/routes/decanic.routes.mjs'; // Import Decanic routes for Epic 2
import skillsRoutes from './databases/api/routes/skills.routes.mjs'; // Import A2A Skills routes

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

console.log('Starting Friendly File Backend Server...');
console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'YES' : 'NO');
console.log('Environment Variables:', process.env);

const app = express();
const port = 3001;

console.log('Applying CORS middleware with options:', corsOptions);
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increased limit to handle large document payloads
app.use('/uploads', express.static('uploads'));

// Async server startup function
async function startServer() {
  // Connect to MongoDB
  connectDB();

  // Initialize Nara Mahamaya routes
  try {
    await initializeRoutes();
    console.log('Nara Mahamaya routes initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Nara Mahamaya routes:', error);
  }

  // Mount routes
  app.use('/api/chat', chatRoutes);
  app.use('/files', filesRoutes);
  app.use('/api/agent', agentRoutes);
  app.use('/api', notionRoutes); // Mount Notion routes under /api
  app.use('/api/graph', graphRoutes); // Mount Graph routes under /api/graph
  app.use('/api/node-details', nodeDetailsRoutes); // Mount Node Details routes under /api/node-details
  app.use('/api/epii-agent', epiiAgentRoutes); // Mount Epii Agent routes under /api/epii-agent
  app.use('/api/documents', documentsRoutes); // Mount Documents routes under /api/documents
  app.use('/api/bpmcp', bpmcpRoutes); // Mount BPMCP routes under /api/bpmcp
  app.use('/api/users', userRoutes); // Mount User routes under /api/users
  app.use('/api/analysis', analysisRoutes); // Mount Analysis routes under /api/analysis
  app.use('/api', mahamayaRoutes); // Mount Nara Mahamaya routes under /api

  // Mount Decanic routes with debug logging
  console.log('Mounting decanic routes...');
  console.log('Decanic routes type:', typeof decanicRoutes);
  app.use('/api/nara/decanic', decanicRoutes); // Mount Decanic routes under /api/nara/decanic
  console.log('Decanic routes mounted successfully');

  // Mount A2A Skills routes
  console.log('Mounting A2A skills routes...');
  app.use('/api/skills', skillsRoutes); // Mount Skills routes under /api/skills
  console.log('A2A skills routes mounted successfully');

  app.listen(port, () => {
    console.log('Server listening on port ' + port);
    console.log('Server URL: http://localhost:' + port);
    console.log('Backend server started successfully');
  });
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
