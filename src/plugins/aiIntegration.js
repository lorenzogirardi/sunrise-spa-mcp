/**
 * AI Integration Plugin for Vue.js
 * Provides AI-friendly features and MCP support
 */

import { useStructuredData } from '../composables/useStructuredData.js';
import { useSEO } from '../composables/useSEO.js';
import { aiApiService } from '../services/aiApiService.js';
import { mcpServer } from '../services/mcpServer.js';

export default {
  install(app) {
    // Global properties for AI integration
    app.config.globalProperties.$ai = {
      structuredData: useStructuredData,
      seo: useSEO,
      apiService: aiApiService,
      mcpServer: mcpServer
    };

    // Provide AI services globally
    app.provide('aiServices', {
      structuredData: useStructuredData,
      seo: useSEO,
      apiService: aiApiService,
      mcpServer: mcpServer
    });

    // Initialize MCP server endpoints if running in browser
    if (typeof window !== 'undefined') {
      initializeMCPEndpoints();
      initializeAIApiEndpoints();
      setupAIMetaTags();
    }

    // Add global mixin for AI features
    app.mixin({
      created() {
        // Auto-setup structured data for components with aiMetadata
        if (this.$options.aiMetadata) {
          this.setupAIMetadata();
        }
      },
      methods: {
        setupAIMetadata() {
          const { addStructuredData } = useStructuredData();
          const { setBasicSEO } = useSEO();
          
          const metadata = this.$options.aiMetadata;
          
          if (metadata.structuredData) {
            addStructuredData(metadata.structuredData);
          }
          
          if (metadata.seo) {
            setBasicSEO(metadata.seo);
          }
        }
      }
    });
  }
};

// Initialize MCP endpoints for browser environment
function initializeMCPEndpoints() {
  // Create a simple HTTP handler for MCP requests
  window.mcpHandler = async (method, path, body) => {
    try {
      const response = await fetch(path, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MCP request failed:', error);
      throw error;
    }
  };

  // Expose MCP capabilities to window for AI agents
  window.mcpCapabilities = {
    version: '2024-11-05',
    features: ['tools', 'resources', 'prompts'],
    endpoints: {
      initialize: '/api/mcp/initialize',
      tools: {
        list: '/api/mcp/tools/list',
        call: '/api/mcp/tools/call'
      },
      resources: {
        list: '/api/mcp/resources/list',
        read: '/api/mcp/resources/read'
      },
      prompts: {
        list: '/api/mcp/prompts/list',
        get: '/api/mcp/prompts/get'
      }
    }
  };
}

// Initialize AI API endpoints
function initializeAIApiEndpoints() {
  // Mock API endpoints for development
  const mockApiHandler = async (path, options = {}) => {
    const { method = 'GET', body } = options;
    
    try {
      // Parse path and parameters
      const url = new URL(path, window.location.origin);
      const pathName = url.pathname;
      const params = Object.fromEntries(url.searchParams);
      
      // Handle API requests through aiApiService
      return await aiApiService.handleRequest(method, pathName, params, body);
    } catch (error) {
      console.error('AI API request failed:', error);
      return {
        error: {
          message: error.message,
          code: 500
        }
      };
    }
  };

  // Expose AI API capabilities
  window.aiApi = {
    version: '1.0',
    baseUrl: '/api/ai',
    endpoints: {
      siteInfo: '/api/ai/site-info',
      products: '/api/ai/products',
      categories: '/api/ai/categories',
      search: '/api/ai/search',
      structure: '/api/ai/structure',
      schema: '/api/ai/schema',
      capabilities: '/api/ai/capabilities',
      sitemap: '/api/ai/sitemap'
    },
    request: mockApiHandler
  };

  // Setup mock API routes for development
  setupMockApiRoutes();
}

// Setup mock API routes for development
function setupMockApiRoutes() {
  // Intercept fetch requests to AI API endpoints
  const originalFetch = window.fetch;
  
  window.fetch = async (url, options = {}) => {
    const urlObj = typeof url === 'string' ? new URL(url, window.location.origin) : url;
    
    // Check if this is an AI API request
    if (urlObj.pathname.startsWith('/api/ai/') || urlObj.pathname.startsWith('/api/mcp/')) {
      try {
        const method = options.method || 'GET';
        const body = options.body ? JSON.parse(options.body) : null;
        const params = Object.fromEntries(urlObj.searchParams);
        
        let result;
        if (urlObj.pathname.startsWith('/api/mcp/')) {
          // Handle MCP requests
          const action = urlObj.pathname.split('/').pop();
          result = await aiApiService.handleMCPRequest(action, body);
        } else {
          // Handle AI API requests
          result = await aiApiService.handleRequest(method, urlObj.pathname, params, body);
        }
        
        // Return a mock Response object
        return new Response(JSON.stringify(result), {
          status: result.error ? 500 : 200,
          statusText: result.error ? 'Internal Server Error' : 'OK',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: {
            message: error.message,
            code: 500
          }
        }), {
          status: 500,
          statusText: 'Internal Server Error',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
    
    // For non-AI API requests, use original fetch
    return originalFetch(url, options);
  };
}

// Setup AI-friendly meta tags
function setupAIMetaTags() {
  // Add AI discovery meta tags if not already present
  const aiMetaTags = [
    { name: 'ai-ready', content: 'true' },
    { name: 'ai-version', content: '1.0' },
    { name: 'ai-last-updated', content: new Date().toISOString() }
  ];

  aiMetaTags.forEach(tag => {
    if (!document.querySelector(`meta[name="${tag.name}"]`)) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', tag.name);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    }
  });

  // Add AI API discovery links if not already present
  const aiLinks = [
    { rel: 'ai-capabilities', href: '/api/ai/capabilities', type: 'application/json' },
    { rel: 'ai-sitemap', href: '/api/ai/sitemap', type: 'application/json' },
    { rel: 'mcp-server', href: '/api/mcp/initialize', type: 'application/json' }
  ];

  aiLinks.forEach(linkData => {
    if (!document.querySelector(`link[rel="${linkData.rel}"]`)) {
      const link = document.createElement('link');
      link.setAttribute('rel', linkData.rel);
      link.setAttribute('href', linkData.href);
      link.setAttribute('type', linkData.type);
      document.head.appendChild(link);
    }
  });
}

// Export utility functions for manual use
export const aiUtils = {
  initializeMCPEndpoints,
  initializeAIApiEndpoints,
  setupAIMetaTags,
  
  // Helper function to add structured data to any component
  addStructuredData: (data, id) => {
    const { addStructuredData } = useStructuredData();
    return addStructuredData(data, id);
  },
  
  // Helper function to set SEO data for any component
  setSEO: (seoData) => {
    const { setBasicSEO } = useSEO();
    return setBasicSEO(seoData);
  },
  
  // Helper function to make AI API requests
  makeAIApiRequest: async (endpoint, options = {}) => {
    if (typeof window !== 'undefined' && window.aiApi) {
      return await window.aiApi.request(endpoint, options);
    }
    throw new Error('AI API not available');
  },
  
  // Helper function to make MCP requests
  makeMCPRequest: async (method, path, body) => {
    if (typeof window !== 'undefined' && window.mcpHandler) {
      return await window.mcpHandler(method, path, body);
    }
    throw new Error('MCP handler not available');
  }
};