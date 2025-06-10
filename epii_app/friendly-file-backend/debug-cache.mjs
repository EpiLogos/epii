#!/usr/bin/env node

/**
 * Debug Cache Contents
 * Quick script to check what's actually in the analysis results cache
 */

import { getAnalysisResultsFromCache, hasAnalysisResultsInCache } from './utils/documentCache.utils.mjs';

const DOCUMENT_ID = '682b1229c49971f59b070ca5'; // The document ID from your logs

async function debugCache() {
  console.log('🔍 Debugging Analysis Results Cache...\n');
  
  try {
    // Check if document has analysis results in cache
    console.log(`1. Checking if document ${DOCUMENT_ID} has analysis results in cache...`);
    const hasResults = await hasAnalysisResultsInCache(DOCUMENT_ID);
    console.log(`   Has results: ${hasResults}\n`);
    
    if (hasResults) {
      // Get the analysis results
      console.log(`2. Getting analysis results from cache...`);
      const results = await getAnalysisResultsFromCache(DOCUMENT_ID);
      
      if (results) {
        console.log(`   ✅ Found results with structure: ${Object.keys(results).join(', ')}`);
        
        // Check for notionUpdatePayload specifically
        if (results.notionUpdatePayload) {
          console.log(`   ✅ notionUpdatePayload found at top level`);
          console.log(`   📋 notionUpdatePayload keys: ${Object.keys(results.notionUpdatePayload).join(', ')}`);
          console.log(`   🎯 Target coordinate: ${results.notionUpdatePayload.targetCoordinate}`);
        } else {
          console.log(`   ❌ notionUpdatePayload NOT found at top level`);
          
          // Check nested locations
          if (results.fullAnalysisResults && results.fullAnalysisResults.notionUpdatePayload) {
            console.log(`   📍 Found notionUpdatePayload in fullAnalysisResults`);
          } else if (results.results && results.results.notionUpdatePayload) {
            console.log(`   📍 Found notionUpdatePayload in results`);
          } else {
            console.log(`   ❌ notionUpdatePayload not found anywhere`);
          }
        }
        
        // Show timestamp
        if (results.timestamp) {
          console.log(`   ⏰ Cached at: ${results.timestamp}`);
        }
      } else {
        console.log(`   ❌ No results returned from cache`);
      }
    } else {
      console.log(`   ❌ No analysis results found in cache for document ${DOCUMENT_ID}`);
    }
    
  } catch (error) {
    console.error('❌ Error debugging cache:', error);
  }
}

debugCache().catch(console.error);
