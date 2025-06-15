import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs/promises';
import { Client } from "@notionhq/client";
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Keep dotenv for potential future use

const notion = new Client({
  auth: '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', // Hardcoded API Key
});

const notion_content_nodes_index_path = path.resolve(__dirname, '../../../notion_content_nodes_index.json');
const notion_id_map_path = path.resolve(__dirname, '../../../notion_id_map.json');

async function buildNotionIndex() {
  try {
    const idMapContent = await fs.readFile(notion_id_map_path, 'utf8');
    const idMap = JSON.parse(idMapContent);

    let existingIndex = [];
    try {
      const indexContent = await fs.readFile(notion_content_nodes_index_path, 'utf8');
      existingIndex = JSON.parse(indexContent);
    } catch (error) {
      console.log("Index file not found, creating new one");
    }

    for (const bimbaCoordinate in idMap) {
      const notionPageId = idMap[bimbaCoordinate];

      try {
        const pageMetadata = await notion.pages.retrieve({
          page_id: notionPageId,
        });

        const blockChildrenResponse = await notion.blocks.children.list({
          block_id: notionPageId,
          page_size: 100, // Adjust as needed
        });

        const blockChildren = blockChildrenResponse.results;

        const indexEntry = {
          bimbaCoordinate: bimbaCoordinate,
          notionPageId: notionPageId,
          notionParentDatabaseId: pageMetadata.parent.database_id || null,
          title: pageMetadata.properties.NodeName?.title[0]?.plain_text || null,
          archived: pageMetadata.archived,
          in_trash: pageMetadata.in_trash,
          url: pageMetadata.url,
          properties: pageMetadata.properties,
          blockChildren: blockChildren.map(block => ({
            id: block.id,
            type: block.type,
            has_children: block.has_children,
            archived: block.archived,
          })),
        };

        existingIndex.push(indexEntry);
        console.log(`Successfully processed ${bimbaCoordinate}`);

      } catch (error) {
        console.error(`Error processing ${bimbaCoordinate} (Page ID: ${notionPageId}):`, error);
      }
    }

    await fs.writeFile(notion_content_nodes_index_path, JSON.stringify(existingIndex, null, 2));
    console.log('Notion index built successfully!');

  } catch (error) {
    console.error('Error building Notion index:', error);
  }
}

buildNotionIndex();
