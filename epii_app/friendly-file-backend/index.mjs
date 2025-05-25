import express from 'express';
import cors from 'cors'; // Add missing cors import
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import database connection and configurations
import connectDB from './config/db.config.mjs';
import corsOptions from './config/cors.config.mjs';

// Import routes
import chatRoutes from './routes/chat.routes.mjs';
import filesRoutes from './routes/files.routes.mjs';
import agentRoutes from './routes/agent.routes.mjs';
// import ingestionRoutes from './routes/ingestion.routes.mjs'; // Import ingestion routes
import notionRoutes from './routes/notion.routes.mjs'; // Import Notion routes
import graphRoutes from './routes/graph.routes.mjs'; // Import Graph routes
import nodeDetailsRoutes from './routes/nodeDetails.routes.mjs'; // Import Node Details routes
import epiiAgentRoutes from './routes/epii-agent.routes.mjs'; // Import Epii Agent routes
import documentsRoutes from './routes/documents.routes.mjs'; // Import Documents routes
import bpmcpRoutes from './routes/bpmcp.routes.mjs'; // Import BPMCP routes
import userRoutes from './routes/user.routes.mjs'; // Import User routes
import analysisRoutes from './routes/analysis.routes.mjs'; // Import Analysis routes

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

console.log('Starting Friendly File Backend Server...');
console.log('Environment Variables:', process.env);

const app = express();
const port = 3001;

console.log('Applying CORS middleware with options:', corsOptions);
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increased limit to handle large document payloads
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// Mount routes
app.use('/api/chat', chatRoutes);
app.use('/files', filesRoutes);
app.use('/api/agent', agentRoutes);
// app.use('/api/ingest', ingestionRoutes); // Mount ingestion routes
app.use('/api', notionRoutes); // Mount Notion routes under /api
app.use('/api/graph', graphRoutes); // Mount Graph routes under /api/graph
app.use('/api/node-details', nodeDetailsRoutes); // Mount Node Details routes under /api/node-details
app.use('/api/epii-agent', epiiAgentRoutes); // Mount Epii Agent routes under /api/epii-agent
app.use('/api/documents', documentsRoutes); // Mount Documents routes under /api/documents
app.use('/api/bpmcp', bpmcpRoutes); // Mount BPMCP routes under /api/bpmcp
app.use('/api/users', userRoutes); // Mount User routes under /api/users
app.use('/api/analysis', analysisRoutes); // Mount Analysis routes under /api/analysis

app.listen(port, () => {
  console.log('Server listening on port ' + port);
  console.log('Server URL: http://localhost:' + port);
  console.log('Backend server started successfully');
});
