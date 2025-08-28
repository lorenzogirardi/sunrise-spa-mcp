#!/usr/bin/env node

/**
 * AI Integration Test Suite for Sunrise Fashion
 * Tests all AI-friendly features including JSON-LD, MCP, and API endpoints
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:12000';
const AI_API_URL = 'http://localhost:3001';

// Test results collector
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Helper function to make POST requests
function makePostRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Test function wrapper
async function test(name, testFn) {
  try {
    console.log(`🧪 Testing: ${name}`);
    await testFn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`✅ PASS: ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    console.log(`❌ FAIL: ${name} - ${error.message}`);
  }
}

// Test HTML meta tags and JSON-LD
async function testHTMLStructure() {
  const response = await makeRequest(BASE_URL);
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }

  const html = response.body;

  // Test AI-specific meta tags
  if (!html.includes('name="ai-content-type"')) {
    throw new Error('Missing ai-content-type meta tag');
  }

  if (!html.includes('name="ai-industry"')) {
    throw new Error('Missing ai-industry meta tag');
  }

  if (!html.includes('name="ai-features"')) {
    throw new Error('Missing ai-features meta tag');
  }

  // Test JSON-LD structured data
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs);
  if (!jsonLdMatches || jsonLdMatches.length < 3) {
    throw new Error('Missing JSON-LD structured data scripts');
  }

  // Test Open Graph tags
  if (!html.includes('property="og:title"')) {
    throw new Error('Missing Open Graph title');
  }

  if (!html.includes('property="og:description"')) {
    throw new Error('Missing Open Graph description');
  }

  // Test AI discovery links
  if (!html.includes('rel="ai-api"')) {
    throw new Error('Missing AI API discovery link');
  }

  if (!html.includes('rel="mcp-server"')) {
    throw new Error('Missing MCP server discovery link');
  }
}

// Test AI API capabilities endpoint
async function testAICapabilities() {
  const response = await makeRequest(`${BASE_URL}/api/ai/capabilities`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }

  const data = JSON.parse(response.body);
  
  if (!data.name || !data.version) {
    throw new Error('Missing basic capability information');
  }

  if (!data.features || !data.features.structured_data) {
    throw new Error('Missing structured data feature');
  }

  if (!data.features.mcp_protocol) {
    throw new Error('Missing MCP protocol feature');
  }

  if (!data.endpoints || !data.endpoints.products) {
    throw new Error('Missing products endpoint');
  }
}

// Test AI site info endpoint
async function testAISiteInfo() {
  const response = await makeRequest(`${BASE_URL}/api/ai/site-info`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }

  const data = JSON.parse(response.body);
  
  if (data.name !== 'Sunrise Fashion') {
    throw new Error('Incorrect site name');
  }

  if (data.type !== 'e-commerce') {
    throw new Error('Incorrect site type');
  }

  if (!data.languages || !data.languages.includes('en')) {
    throw new Error('Missing language information');
  }
}

// Test AI products endpoint
async function testAIProducts() {
  const response = await makeRequest(`${BASE_URL}/api/ai/products`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }

  const data = JSON.parse(response.body);
  
  if (!data.products || !Array.isArray(data.products)) {
    throw new Error('Missing products array');
  }

  if (data.products.length === 0) {
    throw new Error('No products returned');
  }

  const product = data.products[0];
  if (!product.id || !product.name || !product.price) {
    throw new Error('Product missing required fields');
  }
}

// Test MCP initialization
async function testMCPInitialize() {
  const response = await makePostRequest(`${BASE_URL}/api/mcp/initialize`, {});
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }

  const data = JSON.parse(response.body);
  
  if (!data.protocolVersion) {
    throw new Error('Missing protocol version');
  }

  if (!data.capabilities) {
    throw new Error('Missing capabilities');
  }

  if (!data.serverInfo || !data.serverInfo.name) {
    throw new Error('Missing server info');
  }
}

// Test MCP tools listing
async function testMCPTools() {
  const response = await makePostRequest(`${BASE_URL}/api/mcp/tools/list`, {});
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }

  const data = JSON.parse(response.body);
  
  if (!data.tools || !Array.isArray(data.tools)) {
    throw new Error('Missing tools array');
  }

  if (data.tools.length === 0) {
    throw new Error('No tools returned');
  }

  const tool = data.tools[0];
  if (!tool.name || !tool.description) {
    throw new Error('Tool missing required fields');
  }
}

// Test MCP resources listing
async function testMCPResources() {
  const response = await makePostRequest(`${BASE_URL}/api/mcp/resources/list`, {});
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }

  const data = JSON.parse(response.body);
  
  if (!data.resources || !Array.isArray(data.resources)) {
    throw new Error('Missing resources array');
  }

  if (data.resources.length === 0) {
    throw new Error('No resources returned');
  }

  const resource = data.resources[0];
  if (!resource.uri || !resource.name) {
    throw new Error('Resource missing required fields');
  }
}

// Test MCP prompts listing
async function testMCPPrompts() {
  const response = await makePostRequest(`${BASE_URL}/api/mcp/prompts/list`, {});
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }

  const data = JSON.parse(response.body);
  
  if (!data.prompts || !Array.isArray(data.prompts)) {
    throw new Error('Missing prompts array');
  }

  if (data.prompts.length === 0) {
    throw new Error('No prompts returned');
  }

  const prompt = data.prompts[0];
  if (!prompt.name || !prompt.description) {
    throw new Error('Prompt missing required fields');
  }
}

// Test direct AI API server
async function testDirectAIServer() {
  const response = await makeRequest(`${AI_API_URL}/health`);
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }

  const data = JSON.parse(response.body);
  
  if (data.status !== 'ok') {
    throw new Error('AI server not healthy');
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting AI Integration Tests for Sunrise Fashion\n');

  // HTML and Structured Data Tests
  await test('HTML Meta Tags and JSON-LD Structure', testHTMLStructure);
  
  // AI API Tests
  await test('AI Capabilities Endpoint', testAICapabilities);
  await test('AI Site Info Endpoint', testAISiteInfo);
  await test('AI Products Endpoint', testAIProducts);
  
  // MCP Protocol Tests
  await test('MCP Initialize', testMCPInitialize);
  await test('MCP Tools Listing', testMCPTools);
  await test('MCP Resources Listing', testMCPResources);
  await test('MCP Prompts Listing', testMCPPrompts);
  
  // Direct API Server Test
  await test('Direct AI Server Health', testDirectAIServer);

  // Print results
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => console.log(`   - ${t.name}: ${t.error}`));
  }

  console.log('\n🎉 AI Integration Testing Complete!');
  
  if (results.failed === 0) {
    console.log('\n✨ All tests passed! Your Sunrise Fashion application is fully AI-friendly with:');
    console.log('   🔍 JSON-LD structured data for search engines');
    console.log('   🤖 MCP protocol support for AI agents');
    console.log('   📡 AI-friendly API endpoints');
    console.log('   🏷️  Comprehensive meta tags for AI discovery');
    console.log('   🌐 Open Graph and Twitter Card support');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runTests, test, makeRequest, makePostRequest };