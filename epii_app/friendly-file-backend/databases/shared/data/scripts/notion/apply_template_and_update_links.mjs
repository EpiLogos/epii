// apply_template_and_update_links.mjs
// Updates Content Node pages in Notion with full Bimba Address (all parent coordinates)
// Automatically unarchives each page before updating

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Client as NotionClient } from '@notionhq/client';
import fs from 'fs/promises';

// Load .env from absolute path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const NOTION_ID_MAP_PATH = path.resolve(__dirname, '../../../../notion_id_map.json');

const notion = new NotionClient({ auth: process.env.NOTION_API_KEY });

// Utility: Calculate all parent coordinates for a given coordinate string
function getAllParentCoords(coord) {
  if (!coord.startsWith('#')) return [];
  const parts = coord.slice(1).split(/[-.]/);
  const coords = ['#'];
  let current = '';
  for (let i = 0; i < parts.length; i++) {
    current += (current ? '-' : '#') + parts[i];
    coords.push(current);
  }
  return coords;
}

async function main() {
  // 1. Read the Notion ID map
  const notionIdMap = JSON.parse(await fs.readFile(NOTION_ID_MAP_PATH, 'utf-8'));

  // 2. Iterate through Content Node pages and update Bimba Address
  for (const [coord, pageId] of Object.entries(notionIdMap)) {
    // a. Check and unarchive the page if needed
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (page.archived) {
      await notion.pages.update({ page_id: pageId, archived: false });
      console.log(`Unarchived page for ${coord}`);
    }

    // b. Update Bimba Address property with all parent coordinates
    const allCoords = getAllParentCoords(coord);
    const relationIds = allCoords
      .map(c => notionIdMap[c])
      .filter(Boolean)
      .map(id => ({ id }));
    await notion.pages.update({
      page_id: pageId,
      properties: {
        "🗺️ Bimba Address": { relation: relationIds }
      }
    });
    console.log(`Updated Bimba Address for page ${coord}`);
  }

  console.log('Bimba Address updated for all Content Node pages.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
