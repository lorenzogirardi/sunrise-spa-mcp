/**
 * AI Integration Test Utilities
 * Helper functions to test AI-friendly features
 */

export class AITestUtils {
  constructor() {
    this.testResults = [];
  }

  // Test JSON-LD structured data presence
  testStructuredData() {
    const results = {
      test: 'JSON-LD Structured Data',
      passed: false,
      details: []
    };

    try {
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      
      if (jsonLdScripts.length === 0) {
        results.details.push('❌ No JSON-LD scripts found');
        return results;
      }

      results.details.push(`✅ Found ${jsonLdScripts.length} JSON-LD scripts`);

      jsonLdScripts.forEach((script, index) => {
        try {
          const data = JSON.parse(script.textContent);
          const type = data['@type'] || 'Unknown';
          results.details.push(`✅ Script ${index + 1}: Valid ${type} schema`);
        } catch (error) {
          results.details.push(`❌ Script ${index + 1}: Invalid JSON - ${error.message}`);
        }
      });

      results.passed = jsonLdScripts.length > 0;
    } catch (error) {
      results.details.push(`❌ Error testing structured data: ${error.message}`);
    }

    this.testResults.push(results);
    return results;
  }

  // Test meta tags presence
  testMetaTags() {
    const results = {
      test: 'Meta Tags',
      passed: false,
      details: []
    };

    const requiredMetaTags = [
      { selector: 'meta[name="description"]', name: 'Description' },
      { selector: 'meta[name="keywords"]', name: 'Keywords' },
      { selector: 'meta[property="og:title"]', name: 'Open Graph Title' },
      { selector: 'meta[property="og:description"]', name: 'Open Graph Description' },
      { selector: 'meta[name="twitter:card"]', name: 'Twitter Card' },
      { selector: 'meta[name="ai-content-type"]', name: 'AI Content Type' },
      { selector: 'link[rel="canonical"]', name: 'Canonical URL' }
    ];

    let foundTags = 0;

    requiredMetaTags.forEach(tag => {
      const element = document.querySelector(tag.selector);
      if (element) {
        results.details.push(`✅ ${tag.name}: Found`);
        foundTags++;
      } else {
        results.details.push(`❌ ${tag.name}: Missing`);
      }
    });

    results.passed = foundTags === requiredMetaTags.length;
    results.details.unshift(`Found ${foundTags}/${requiredMetaTags.length} required meta tags`);

    this.testResults.push(results);
    return results;
  }

  // Test AI API endpoints
  async testAIApiEndpoints() {
    const results = {
      test: 'AI API Endpoints',
      passed: false,
      details: []
    };

    const endpoints = [
      '/api/ai/capabilities',
      '/api/ai/site-info',
      '/api/ai/products',
      '/api/ai/categories',
      '/api/ai/schema'
    ];

    let workingEndpoints = 0;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          results.details.push(`✅ ${endpoint}: Working (${response.status})`);
          workingEndpoints++;
        } else {
          results.details.push(`❌ ${endpoint}: Failed (${response.status})`);
        }
      } catch (error) {
        results.details.push(`❌ ${endpoint}: Error - ${error.message}`);
      }
    }

    results.passed = workingEndpoints === endpoints.length;
    results.details.unshift(`${workingEndpoints}/${endpoints.length} endpoints working`);

    this.testResults.push(results);
    return results;
  }

  // Test MCP endpoints
  async testMCPEndpoints() {
    const results = {
      test: 'MCP Endpoints',
      passed: false,
      details: []
    };

    const mcpEndpoints = [
      { path: '/api/mcp/initialize', method: 'POST', body: { protocolVersion: '2024-11-05' } },
      { path: '/api/mcp/tools/list', method: 'POST', body: {} },
      { path: '/api/mcp/resources/list', method: 'POST', body: {} },
      { path: '/api/mcp/prompts/list', method: 'POST', body: {} }
    ];

    let workingEndpoints = 0;

    for (const endpoint of mcpEndpoints) {
      try {
        const response = await fetch(endpoint.path, {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(endpoint.body)
        });

        if (response.ok) {
          const data = await response.json();
          results.details.push(`✅ ${endpoint.path}: Working`);
          workingEndpoints++;
        } else {
          results.details.push(`❌ ${endpoint.path}: Failed (${response.status})`);
        }
      } catch (error) {
        results.details.push(`❌ ${endpoint.path}: Error - ${error.message}`);
      }
    }

    results.passed = workingEndpoints === mcpEndpoints.length;
    results.details.unshift(`${workingEndpoints}/${mcpEndpoints.length} MCP endpoints working`);

    this.testResults.push(results);
    return results;
  }

  // Test AI discovery features
  testAIDiscovery() {
    const results = {
      test: 'AI Discovery Features',
      passed: false,
      details: []
    };

    const discoveryFeatures = [
      { selector: 'link[rel="ai-api"]', name: 'AI API Discovery Link' },
      { selector: 'link[rel="mcp-server"]', name: 'MCP Server Discovery Link' },
      { selector: 'meta[name="mcp-capabilities"]', name: 'MCP Capabilities Meta' },
      { selector: 'meta[name="ai-capabilities"]', name: 'AI Capabilities Meta' }
    ];

    let foundFeatures = 0;

    discoveryFeatures.forEach(feature => {
      const element = document.querySelector(feature.selector);
      if (element) {
        results.details.push(`✅ ${feature.name}: Found`);
        foundFeatures++;
      } else {
        results.details.push(`❌ ${feature.name}: Missing`);
      }
    });

    // Check for window objects
    if (typeof window !== 'undefined') {
      if (window.aiApi) {
        results.details.push('✅ Window.aiApi: Available');
        foundFeatures++;
      } else {
        results.details.push('❌ Window.aiApi: Not available');
      }

      if (window.mcpCapabilities) {
        results.details.push('✅ Window.mcpCapabilities: Available');
        foundFeatures++;
      } else {
        results.details.push('❌ Window.mcpCapabilities: Not available');
      }
    }

    results.passed = foundFeatures >= 4; // At least 4 out of 6 features should work
    results.details.unshift(`Found ${foundFeatures} discovery features`);

    this.testResults.push(results);
    return results;
  }

  // Test semantic markup
  testSemanticMarkup() {
    const results = {
      test: 'Semantic Markup',
      passed: false,
      details: []
    };

    const semanticElements = [
      { selector: '[itemscope]', name: 'Microdata itemscope' },
      { selector: '[itemtype]', name: 'Microdata itemtype' },
      { selector: '[itemprop]', name: 'Microdata itemprop' },
      { selector: '[data-ai-action]', name: 'AI action attributes' },
      { selector: '[data-product-id]', name: 'Product ID attributes' }
    ];

    let foundElements = 0;

    semanticElements.forEach(element => {
      const elements = document.querySelectorAll(element.selector);
      if (elements.length > 0) {
        results.details.push(`✅ ${element.name}: Found ${elements.length} elements`);
        foundElements++;
      } else {
        results.details.push(`❌ ${element.name}: Not found`);
      }
    });

    results.passed = foundElements >= 2; // At least some semantic markup should be present
    results.details.unshift(`Found ${foundElements} types of semantic markup`);

    this.testResults.push(results);
    return results;
  }

  // Run all tests
  async runAllTests() {
    console.log('🤖 Running AI Integration Tests...\n');

    // Run synchronous tests
    this.testStructuredData();
    this.testMetaTags();
    this.testAIDiscovery();
    this.testSemanticMarkup();

    // Run asynchronous tests
    await this.testAIApiEndpoints();
    await this.testMCPEndpoints();

    return this.generateReport();
  }

  // Generate test report
  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(test => test.passed).length;
    const failedTests = totalTests - passedTests;

    const report = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        score: Math.round((passedTests / totalTests) * 100)
      },
      results: this.testResults,
      recommendations: this.generateRecommendations()
    };

    // Log report to console
    console.log('📊 AI Integration Test Report');
    console.log('================================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Score: ${report.summary.score}%\n`);

    this.testResults.forEach(test => {
      console.log(`${test.passed ? '✅' : '❌'} ${test.test}`);
      test.details.forEach(detail => console.log(`  ${detail}`));
      console.log('');
    });

    if (report.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }

    return report;
  }

  // Generate recommendations based on test results
  generateRecommendations() {
    const recommendations = [];
    
    this.testResults.forEach(test => {
      if (!test.passed) {
        switch (test.test) {
          case 'JSON-LD Structured Data':
            recommendations.push('Add JSON-LD structured data scripts to improve AI understanding');
            break;
          case 'Meta Tags':
            recommendations.push('Complete missing meta tags for better SEO and AI discovery');
            break;
          case 'AI API Endpoints':
            recommendations.push('Fix AI API endpoints to enable AI agent interaction');
            break;
          case 'MCP Endpoints':
            recommendations.push('Implement MCP protocol endpoints for advanced AI integration');
            break;
          case 'AI Discovery Features':
            recommendations.push('Add AI discovery meta tags and links for better agent detection');
            break;
          case 'Semantic Markup':
            recommendations.push('Add semantic HTML markup for improved content understanding');
            break;
        }
      }
    });

    return recommendations;
  }

  // Clear test results
  clearResults() {
    this.testResults = [];
  }
}

// Export singleton instance
export const aiTestUtils = new AITestUtils();

// Convenience function to run tests from console
export const runAITests = () => aiTestUtils.runAllTests();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.aiTestUtils = aiTestUtils;
  window.runAITests = runAITests;
}