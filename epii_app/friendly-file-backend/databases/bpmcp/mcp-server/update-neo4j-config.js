// Script to update Neo4j configuration for GenAI plugin
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Initialize dotenv
dotenv.config();

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Neo4j home directory from environment variable or use default
const NEO4J_HOME = process.env.NEO4J_HOME;

if (!NEO4J_HOME) {
  console.error('NEO4J_HOME environment variable is not set.');
  console.error('Please set NEO4J_HOME to the root directory of your Neo4j installation.');
  console.error('Example: export NEO4J_HOME=/path/to/neo4j');
  process.exit(1);
}

// Path to neo4j.conf
const configPath = path.join(NEO4J_HOME, 'conf', 'neo4j.conf');

// Check if config file exists
if (!fs.existsSync(configPath)) {
  console.error(`Config file not found at ${configPath}`);
  process.exit(1);
}

// Read current config
console.log(`Reading Neo4j configuration from ${configPath}...`);
const configContent = fs.readFileSync(configPath, 'utf8');

// Prepare new config lines
const newConfigLines = [
  '',
  '# GenAI Plugin Configuration',
  'dbms.security.procedures.unrestricted=genai.*',
  'dbms.security.procedures.allowlist=genai.*,apoc.*,db.*',
  '',
  '# Vector module configuration',
  'server.jvm.additional=--add-modules=jdk.incubator.vector',
  '',
  '# Google AI Embeddings Configuration',
  `genai.google.api.key=${process.env.GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY'}`,
  `genai.google.project.id=${process.env.GOOGLE_PROJECT_ID || 'YOUR_GOOGLE_PROJECT_ID'}`,
  'genai.google.model.embedding=textembedding-gecko@latest',
  '',
  '# Enable vector index procedures',
  'dbms.security.procedures.unrestricted=db.index.vector.*',
  ''
];

// Check if config already contains these settings
let configUpdated = false;
const configLines = configContent.split('\n');
const updatedConfigLines = [...configLines];

// Check if GenAI plugin configuration is already present
if (!configContent.includes('dbms.security.procedures.unrestricted=genai.*')) {
  console.log('Adding GenAI plugin configuration...');
  updatedConfigLines.push(...newConfigLines);
  configUpdated = true;
}

// Write updated config if changes were made
if (configUpdated) {
  console.log('Updating Neo4j configuration...');

  // Create backup of original config
  const backupPath = `${configPath}.backup.${Date.now()}`;
  fs.copyFileSync(configPath, backupPath);
  console.log(`Backup of original configuration created at ${backupPath}`);

  // Write updated config
  fs.writeFileSync(configPath, updatedConfigLines.join('\n'), 'utf8');
  console.log('Neo4j configuration updated successfully.');
  console.log('Please restart Neo4j for the changes to take effect.');
} else {
  console.log('No configuration changes needed. Neo4j is already configured for GenAI plugin.');
}

console.log('\nConfiguration update completed.');
