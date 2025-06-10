#!/usr/bin/env node

/**
 * Test Backend Server Status
 * Quick script to check if the backend server is running and endpoints are accessible
 */

import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:3001';

async function testEndpoint(path, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BACKEND_URL}${path}`, options);
    
    return {
      path,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    };
  } catch (error) {
    return {
      path,
      error: error.message,
      ok: false
    };
  }
}

async function main() {
  console.log('🔍 Testing Backend Server Status...\n');
  
  // Test basic server health
  console.log('1. Testing basic server connectivity...');
  const healthCheck = await testEndpoint('/');
  console.log(`   ${healthCheck.ok ? '✅' : '❌'} ${healthCheck.path}: ${healthCheck.status || 'ERROR'} ${healthCheck.statusText || healthCheck.error}`);
  
  if (!healthCheck.ok) {
    console.log('\n❌ Backend server is not running or not accessible at http://localhost:3001');
    console.log('💡 Try running: cd epii_app/friendly-file-backend && npm start');
    process.exit(1);
  }
  
  // Test analysis routes
  console.log('\n2. Testing analysis endpoints...');
  const analysisEndpoints = [
    '/api/analysis',
    '/api/analysis/crystallize'
  ];
  
  for (const endpoint of analysisEndpoints) {
    const result = await testEndpoint(endpoint, 'POST', { test: true });
    console.log(`   ${result.status === 400 || result.status === 404 ? '⚠️' : result.ok ? '✅' : '❌'} ${endpoint}: ${result.status || 'ERROR'} ${result.statusText || result.error}`);
  }
  
  // Test other critical endpoints
  console.log('\n3. Testing other critical endpoints...');
  const otherEndpoints = [
    '/api/documents',
    '/api/skills',
    '/api/bpmcp'
  ];
  
  for (const endpoint of otherEndpoints) {
    const result = await testEndpoint(endpoint);
    console.log(`   ${result.ok ? '✅' : '❌'} ${endpoint}: ${result.status || 'ERROR'} ${result.statusText || result.error}`);
  }
  
  console.log('\n✅ Backend server status check completed!');
  console.log('💡 If crystallization is still failing, check the server logs for detailed error messages.');
}

main().catch(console.error);
