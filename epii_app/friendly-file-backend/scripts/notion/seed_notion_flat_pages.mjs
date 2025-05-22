// seed_notion_flat_pages.mjs
// Phase 1a Notion Seeding Script: Create flat pages in Content Nodes DB for each Bimba node, link coordinates, output mapping

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env from absolute path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('NEO4J_URI:', process.env.NEO4J_URI);
console.log('Loaded .env from:', path.resolve(__dirname, '../../.env'));

import { Client as NotionClient } from '@notionhq/client';
import neo4j from 'neo4j-driver';
import fs from 'fs/promises';

// --- CONFIGURATION ---

const CONTENT_NODES_DB_ID = '1caa4797-123c-8027-a842-d4cd86b4b36a';
const COORDINATES_DB_ID = '1d1a4797-123c-801a-822b-e2db91caee55';
const COORDINATES_DB_TITLE_PROP = 'Bimba Coordinate';
const CONTENT_NODES_DB_TITLE_PROP = 'Node Name';
const CONTENT_NODES_DB_COORD_REL_PROP = '🗺️ Bimba Address';
const OUTPUT_MAP_FILE = 'notion_id_map.json';

// --- INIT CLIENTS ---

const notion = new NotionClient({ auth: process.env.NOTION_API_KEY });

const neo4jDriver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// --- UTILITY FUNCTIONS ---

async function ensureCoordinatePage(coord, coordToNotionPageIdMap) {
  if (coordToNotionPageIdMap[coord]) return coordToNotionPageIdMap[coord];
  // Query for existing page
  const response = await notion.databases.query({
    database_id: COORDINATES_DB_ID,
    filter: {
      property: COORDINATES_DB_TITLE_PROP,
      title: { equals: coord }
    }
  });
  if (response.results.length > 0) {
    const pageId = response.results[0].id;
    coordToNotionPageIdMap[coord] = pageId;
    return pageId;
  }
  // Create new page
  const createResp = await notion.pages.create({
    parent: { database_id: COORDINATES_DB_ID },
    properties: {
      [COORDINATES_DB_TITLE_PROP]: {
        title: [{ text: { content: coord } }]
      }
    }
  });
  const pageId = createResp.id;
  coordToNotionPageIdMap[coord] = pageId;
  return pageId;
}

// --- MAIN SCRIPT ---

async function main() {
  const session = neo4jDriver.session();
  const bimbaToNotionMap = {};
  const coordToNotionPageIdMap = {};

  // 1. Ensure root coordinate '#' exists
  await ensureCoordinatePage('#', coordToNotionPageIdMap);

  // 2. Fetch Bimba nodes and parent relationships
  const cypher = `
    MATCH (n)
    WHERE n.bimbaCoordinate IS NOT NULL
    OPTIONAL MATCH (parent)-[:HAS_LENS|:CONTAINS_SPANDA_STAGE|:HAS_INTERNAL_COMPONENT|:META_STRUCTURE_ELEMENT_OF]->(n)
    RETURN n.bimbaCoordinate AS coord, n.name AS name, parent.bimbaCoordinate AS parentCoord
    ORDER BY size(n.bimbaCoordinate)
  `;
  const result = await session.run(cypher);

  for (const record of result.records) {
    const currentCoord = record.get('coord');
    const currentName = record.get('name') || currentCoord;
    // parentCoord is not used for nesting in this script, but could be logged
    // 1. Ensure coordinate page exists
    await ensureCoordinatePage(currentCoord, coordToNotionPageIdMap);

    // 2. Prepare relation payload (root + specific)
    const rootCoordPageId = coordToNotionPageIdMap['#'];
    const specificCoordPageId = coordToNotionPageIdMap[currentCoord];
    const relationPayload = { relation: [{ id: rootCoordPageId }, { id: specificCoordPageId }] };

    // 3. Create Content Node page (flat, not nested)
    try {
      const createResp = await notion.pages.create({
        parent: { database_id: CONTENT_NODES_DB_ID },
        properties: {
          [CONTENT_NODES_DB_TITLE_PROP]: {
            title: [{ text: { content: currentName } }]
          },
          [CONTENT_NODES_DB_COORD_REL_PROP]: relationPayload
        }
      });
      bimbaToNotionMap[currentCoord] = createResp.id;
      console.log(`Created Notion page for ${currentCoord}: ${createResp.id}`);
    } catch (err) {
      console.error(`Failed to create Notion page for ${currentCoord}:`, err.body || err);
    }
  }

  // 4. Output mapping
  await fs.writeFile(OUTPUT_MAP_FILE, JSON.stringify(bimbaToNotionMap, null, 2), 'utf-8');
  console.log(`Mapping written to ${OUTPUT_MAP_FILE}`);

  await session.close();
  await neo4jDriver.close();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
