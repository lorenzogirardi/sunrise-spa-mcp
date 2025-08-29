# AI Integration Guide for Sunrise Fashion E-commerce

This document explains the AI-friendly features implemented in the Sunrise Fashion e-commerce platform to make it compatible with AI agents like ChatGPT, Perplexity, Claude, Gemini, and other AI systems.

## 🤖 AI-Friendly Features Overview

### 1. JSON-LD Structured Data
The application includes comprehensive Schema.org structured data in JSON-LD format:

- **Organization Schema**: Company information and contact details
- **WebSite Schema**: Site-wide information with search functionality
- **OnlineStore Schema**: E-commerce specific data
- **Product Schema**: Detailed product information with pricing, availability, and ratings
- **BreadcrumbList Schema**: Navigation structure for better understanding
- **FAQ Schema**: Common questions and answers

### 2. Model Context Protocol (MCP) Support
Full MCP implementation for AI agent integration:

#### Available Tools:
- `search_products`: Search the product catalog
- `get_product`: Get detailed product information
- `get_categories`: Retrieve product categories
- `get_cart`: Access shopping cart contents
- `add_to_cart`: Add products to cart
- `get_user_info`: Get user information and preferences
- `get_navigation`: Get site navigation structure

#### Available Resources:
- `site_config`: Site configuration and settings
- `product_catalog`: Complete product catalog
- `user_session`: Current user session data
- `shopping_cart`: Shopping cart contents
- `site_analytics`: Site performance metrics

#### Available Prompts:
- `recommend_products`: Generate product recommendations
- `style_advice`: Provide fashion and styling advice
- `size_guide`: Offer sizing guidance
- `shopping_assistance`: General shopping help

### 3. Enhanced Meta Tags
Comprehensive meta tag implementation for AI crawlers:

- **Standard SEO**: Title, description, keywords, robots
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific metadata
- **AI-specific tags**: Custom tags for AI agent discovery
- **Canonical URLs**: Proper URL canonicalization
- **Language alternatives**: Multi-language support

### 4. AI-Friendly API Endpoints

Base URL: `https://ecom-001-jsonldmcp.k8s.it/api/ai/`

#### Available Endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/site-info` | GET | Comprehensive site information |
| `/api/ai/products` | GET | Product catalog with filtering |
| `/api/ai/products/:id` | GET | Detailed product information |
| `/api/ai/categories` | GET | Product categories hierarchy |
| `/api/ai/search` | GET | AI-optimized search results |
| `/api/ai/structure` | GET | Site navigation and structure |
| `/api/ai/schema` | GET | Structured data schemas |
| `/api/ai/capabilities` | GET | AI integration capabilities |
| `/api/ai/sitemap` | GET | AI-optimized sitemap |

#### MCP Endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/mcp/initialize` | POST | Initialize MCP connection |
| `/api/mcp/tools/list` | POST | List available tools |
| `/api/mcp/tools/call` | POST | Execute a tool |
| `/api/mcp/resources/list` | POST | List available resources |
| `/api/mcp/resources/read` | POST | Read a resource |
| `/api/mcp/prompts/list` | POST | List available prompts |
| `/api/mcp/prompts/get` | POST | Get a prompt |

## 🔧 Implementation Details

### Vue.js Integration

The AI features are integrated through:

1. **Composables**:
   - `useStructuredData()`: Manage JSON-LD structured data
   - `useSEO()`: Handle meta tags and SEO optimization

2. **Services**:
   - `aiApiService`: Handle AI-friendly API requests
   - `mcpServer`: Implement MCP protocol

3. **Plugin**:
   - `aiIntegrationPlugin`: Global AI features integration

### Usage Examples

#### Adding Structured Data to a Component:

```javascript
import { useStructuredData } from '@/composables/useStructuredData';

export default {
  setup() {
    const { addProductSchema } = useStructuredData();
    
    const product = {
      name: 'Elegant Summer Dress',
      description: 'Beautiful flowing summer dress',
      price: { current: { amount: 89.99, currency: 'EUR' } }
    };
    
    addProductSchema(product);
  }
}
```

#### Setting SEO Data:

```javascript
import { useSEO } from '@/composables/useSEO';

export default {
  setup() {
    const { setProductSEO } = useSEO();
    
    setProductSEO({
      title: 'Elegant Summer Dress - Sunrise Fashion',
      description: 'Shop the elegant summer dress...',
      keywords: ['summer dress', 'fashion', 'elegant']
    });
  }
}
```

#### Making AI API Requests:

```javascript
// Get site information
const siteInfo = await fetch('/api/ai/site-info').then(r => r.json());

// Search products
const products = await fetch('/api/ai/search?q=summer+dress').then(r => r.json());

// Get product details
const product = await fetch('/api/ai/products/prod-1').then(r => r.json());
```

#### Using MCP Tools:

```javascript
// Initialize MCP connection
const mcpInit = await fetch('/api/mcp/initialize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ protocolVersion: '2024-11-05' })
});

// Call a tool
const searchResult = await fetch('/api/mcp/tools/call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'search_products',
    arguments: { query: 'summer dress', limit: 5 }
  })
});
```

## 🌐 AI Agent Discovery

AI agents can discover the platform's capabilities through:

1. **Meta Tags**: AI-specific meta tags in the HTML head
2. **Link Relations**: Discovery links for AI APIs and MCP endpoints
3. **robots.txt**: AI-friendly robots.txt with specific directives
4. **Sitemap**: Both XML and JSON sitemaps for comprehensive crawling

### Discovery Meta Tags:

```html
<meta name="ai-content-type" content="e-commerce" />
<meta name="ai-industry" content="fashion" />
<meta name="ai-capabilities" content="mcp-protocol, structured-data, json-ld" />
<link rel="ai-api" href="/api/ai/capabilities" type="application/json" />
<link rel="mcp-server" href="/api/mcp/initialize" type="application/json" />
```

## 📊 Structured Data Examples

### Product Schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Elegant Summer Dress",
  "description": "Beautiful flowing summer dress perfect for any occasion",
  "sku": "SF-DRESS-001",
  "brand": {
    "@type": "Brand",
    "name": "Sunrise Fashion"
  },
  "offers": {
    "@type": "Offer",
    "price": "89.99",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
```

### Organization Schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sunrise Fashion",
  "description": "Premium fashion e-commerce platform",
  "url": "https://ecom-001-jsonldmcp.k8s.it",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English", "Deutsch"]
  }
}
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   yarn install --frozen-lockfile
   ```

2. **Start Development Server**:
   ```bash
   yarn start
   ```

3. **Test AI Features**:
   - Visit `/api/ai/capabilities` to see available AI features
   - Check `/api/mcp/initialize` for MCP protocol support
   - Inspect page source for JSON-LD structured data

## 🔍 Testing and Validation

### JSON-LD Validation:
- Use Google's Structured Data Testing Tool
- Validate with Schema.org validator
- Test with Rich Results Test

### MCP Testing:
- Use MCP client tools to test protocol implementation
- Verify tool execution and resource access
- Test prompt generation

### SEO Testing:
- Check meta tags with browser developer tools
- Validate Open Graph with Facebook Debugger
- Test Twitter Cards with Twitter Card Validator

## 🤝 AI Agent Integration Examples

### For ChatGPT/GPT-based agents:
```javascript
// Discover capabilities
const capabilities = await fetch('https://ecom-001-jsonldmcp.k8s.it/api/ai/capabilities');

// Search products
const products = await fetch('https://ecom-001-jsonldmcp.k8s.it/api/ai/search?q=dress');

// Get structured data
const schemas = await fetch('https://ecom-001-jsonldmcp.k8s.it/api/ai/schema');
```

### For MCP-compatible agents:
```javascript
// Initialize MCP connection
const mcp = new MCPClient('https://ecom-001-jsonldmcp.k8s.it/api/mcp/');
await mcp.initialize();

// Use tools
const searchResults = await mcp.callTool('search_products', { query: 'summer dress' });
const product = await mcp.callTool('get_product', { productId: 'prod-1' });
```

## 📈 Benefits for AI Agents

1. **Rich Context**: Comprehensive structured data provides deep understanding
2. **Interactive Capabilities**: MCP tools allow direct interaction with the platform
3. **Semantic Understanding**: Schema.org markup enables better content interpretation
4. **Efficient Discovery**: Well-structured APIs and discovery mechanisms
5. **Multi-modal Support**: Text, images, and structured data integration

## 🛠️ Customization

To customize AI features for your specific needs:

1. **Extend MCP Tools**: Add new tools in `src/services/mcpServer.js`
2. **Add Structured Data**: Create new schemas in `src/composables/useStructuredData.js`
3. **Enhance APIs**: Extend endpoints in `src/services/aiApiService.js`
4. **Custom Meta Tags**: Add specific tags in `src/composables/useSEO.js`

## 📚 Resources

- [Schema.org Documentation](https://schema.org/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Google Structured Data Guidelines](https://developers.google.com/search/docs/guides/intro-structured-data)

---

## 🏛️ Architecture and Testing

For a visual overview of the AI integration architecture, including diagrams for the JSON-LD generation flow and the MCP implementation, please see the [AI Integration Architectural Diagrams](./Docs/ai_integration_diagrams.md).

### Testing AI Functionality

The project includes a suite of tests to ensure the AI features are working correctly:

- **Unit Tests**: Located in `tests/unit/`, these tests verify the functionality of individual composables like `useStructuredData` and `usePageSchemas`. They ensure that the JSON-LD schemas are generated correctly based on the input data.
- **End-to-End (E2E) Tests**: The `tests/e2e/specs/ai_agent_spec.js` file contains tests that simulate an AI agent interacting with the application using the MCP protocol. These tests cover the full lifecycle of an AI agent interaction, from initialization to tool execution.

To run the tests, use the following commands:

```bash
# Run unit tests
yarn test:unit

# Run E2E tests
yarn test:e2e
```

---

This implementation makes the Sunrise Fashion e-commerce platform fully compatible with modern AI agents, providing rich context, interactive capabilities, and comprehensive structured data for optimal AI understanding and interaction.