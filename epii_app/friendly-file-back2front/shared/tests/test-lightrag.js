/**
 * ISOLATED LIGHTRAG TESTING
 * Test different LightRAG retrieval methods to find the right approach
 */

import axios from 'axios';

const LIGHTRAG_MCP_SERVER_URL = process.env.LIGHTRAG_MCP_SERVER_URL || "http://localhost:8001";
const DOCUMENT_ID = "682b1229c49971f59b070ca5";
const COORDINATE = "#1-4";

console.log(`🧪 TESTING LIGHTRAG RETRIEVAL METHODS`);
console.log(`📍 LightRAG Server: ${LIGHTRAG_MCP_SERVER_URL}`);
console.log(`📄 Document ID: ${DOCUMENT_ID}`);
console.log(`🎯 Coordinate: ${COORDINATE}`);
console.log(`=====================================`);

async function testLightRAGMethods() {
  try {
    // Test 1: Naive mode with document content query
    console.log(`\n🔍 TEST 1: Naive mode with content query`);
    const test1 = await axios.post(`${LIGHTRAG_MCP_SERVER_URL}/retrieve`, {
      query: "Quaternary Logic principles foundations tetradic structure four-fold logic systems",
      mode: "naive",
      top_k: 5
    });
    console.log(`✅ TEST 1 RESULT:`, JSON.stringify(test1.data, null, 2));
    
    // Test 2: Local mode 
    console.log(`\n🔍 TEST 2: Local mode`);
    const test2 = await axios.post(`${LIGHTRAG_MCP_SERVER_URL}/retrieve`, {
      query: "Quaternary Logic principles foundations",
      mode: "local",
      top_k: 5
    });
    console.log(`✅ TEST 2 RESULT:`, JSON.stringify(test2.data, null, 2));
    
    // Test 3: Mix mode
    console.log(`\n🔍 TEST 3: Mix mode`);
    const test3 = await axios.post(`${LIGHTRAG_MCP_SERVER_URL}/retrieve`, {
      query: "Quaternary Logic principles",
      mode: "mix",
      top_k: 5
    });
    console.log(`✅ TEST 3 RESULT:`, JSON.stringify(test3.data, null, 2));
    
    // Test 4: Global mode
    console.log(`\n🔍 TEST 4: Global mode`);
    const test4 = await axios.post(`${LIGHTRAG_MCP_SERVER_URL}/retrieve`, {
      query: "Quaternary Logic",
      mode: "global",
      top_k: 5
    });
    console.log(`✅ TEST 4 RESULT:`, JSON.stringify(test4.data, null, 2));
    
    // Test 5: Document title query
    console.log(`\n🔍 TEST 5: Document title query (naive)`);
    const test5 = await axios.post(`${LIGHTRAG_MCP_SERVER_URL}/retrieve`, {
      query: "Basic Partially Expanded Quaternal Logic",
      mode: "naive",
      top_k: 5
    });
    console.log(`✅ TEST 5 RESULT:`, JSON.stringify(test5.data, null, 2));
    
    // Test 6: Simple terms
    console.log(`\n🔍 TEST 6: Simple terms (naive)`);
    const test6 = await axios.post(`${LIGHTRAG_MCP_SERVER_URL}/retrieve`, {
      query: "logic tetradic four",
      mode: "naive",
      top_k: 5
    });
    console.log(`✅ TEST 6 RESULT:`, JSON.stringify(test6.data, null, 2));
    
    // Test 7: Raw chunks endpoint with coordinate filter
    console.log(`\n🔍 TEST 7: Raw chunks with coordinate filter`);
    try {
      const test7 = await axios.post(`${LIGHTRAG_MCP_SERVER_URL}/raw-chunks`, {
        query: "Quaternary Logic",
        coordinate_filter: [COORDINATE],
        max_chunks: 5,
        threshold: 0.1
      });
      console.log(`✅ TEST 7 RESULT:`, JSON.stringify(test7.data, null, 2));
    } catch (rawError) {
      console.log(`❌ TEST 7 FAILED:`, rawError.message);
    }
    
    // Test 8: Coordinate-specific query
    console.log(`\n🔍 TEST 8: Coordinate-specific query`);
    const test8 = await axios.post(`${LIGHTRAG_MCP_SERVER_URL}/retrieve`, {
      query: `${COORDINATE} QuaternalLogicFlowering`,
      mode: "naive",
      top_k: 5
    });
    console.log(`✅ TEST 8 RESULT:`, JSON.stringify(test8.data, null, 2));
    
  } catch (error) {
    console.error(`❌ ERROR:`, error.message);
    if (error.response) {
      console.error(`❌ RESPONSE:`, error.response.data);
    }
  }
}

// Run the tests
testLightRAGMethods().then(() => {
  console.log(`\n🏁 LIGHTRAG TESTING COMPLETE`);
}).catch(error => {
  console.error(`💥 TESTING FAILED:`, error);
});
