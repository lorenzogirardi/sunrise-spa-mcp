/**
 * AI-Friendly API Service
 * Provides structured data endpoints for AI agents and crawlers
 */

import { mcpHttpHandler } from './mcpServer.js';

export class AIApiService {
  constructor() {
    this.endpoints = new Map();
    this.registerEndpoints();
  }

  registerEndpoints() {
    // Site information endpoint
    this.endpoints.set('/api/ai/site-info', {
      method: 'GET',
      description: 'Get comprehensive site information for AI agents',
      handler: this.getSiteInfo.bind(this)
    });

    // Product catalog endpoint
    this.endpoints.set('/api/ai/products', {
      method: 'GET',
      description: 'Get product catalog with AI-friendly structure',
      handler: this.getProducts.bind(this)
    });

    // Product details endpoint
    this.endpoints.set('/api/ai/products/:id', {
      method: 'GET',
      description: 'Get detailed product information',
      handler: this.getProductDetails.bind(this)
    });

    // Categories endpoint
    this.endpoints.set('/api/ai/categories', {
      method: 'GET',
      description: 'Get product categories hierarchy',
      handler: this.getCategories.bind(this)
    });

    // Search endpoint
    this.endpoints.set('/api/ai/search', {
      method: 'GET',
      description: 'Search products with AI-optimized results',
      handler: this.searchProducts.bind(this)
    });

    // Site structure endpoint
    this.endpoints.set('/api/ai/structure', {
      method: 'GET',
      description: 'Get site navigation and page structure',
      handler: this.getSiteStructure.bind(this)
    });

    // Schema.org data endpoint
    this.endpoints.set('/api/ai/schema', {
      method: 'GET',
      description: 'Get structured data schemas for the site',
      handler: this.getSchemaData.bind(this)
    });

    // MCP endpoints
    this.endpoints.set('/api/mcp/:action', {
      method: 'POST',
      description: 'Model Context Protocol endpoints',
      handler: this.handleMCPRequest.bind(this)
    });

    // AI capabilities endpoint
    this.endpoints.set('/api/ai/capabilities', {
      method: 'GET',
      description: 'Get AI integration capabilities and features',
      handler: this.getAICapabilities.bind(this)
    });

    // Sitemap endpoint for AI crawlers
    this.endpoints.set('/api/ai/sitemap', {
      method: 'GET',
      description: 'Get AI-optimized sitemap',
      handler: this.getAISitemap.bind(this)
    });
  }

  async getSiteInfo() {
    return {
      name: 'Sunrise Fashion',
      description: 'Premium fashion e-commerce platform powered by CommerceTools',
      type: 'e-commerce',
      industry: 'fashion',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://ecom-001-jsonldmcp.k8s.it',
      languages: ['en', 'de'],
      countries: ['US', 'DE'],
      currencies: ['USD', 'EUR'],
      features: {
        productCatalog: true,
        userAccounts: true,
        shoppingCart: true,
        checkout: true,
        search: true,
        multiLanguage: true,
        multiCurrency: true,
        mobileOptimized: true,
        aiIntegration: true,
        mcpSupport: true
      },
      contact: {
        supportEmail: 'support@sunrise-fashion.com',
        businessHours: '9 AM - 6 PM CET',
        timezone: 'Europe/Berlin'
      },
      policies: {
        shipping: 'Free shipping on orders over €50',
        returns: '30-day return policy',
        privacy: 'GDPR compliant',
        cookies: 'Essential and analytics cookies only'
      },
      integrations: {
        commercetools: true,
        googleMaps: true,
        analytics: true,
        paymentGateways: ['stripe', 'paypal', 'bank-transfer']
      },
      aiCapabilities: {
        structuredData: true,
        jsonLD: true,
        openGraph: true,
        twitterCards: true,
        mcpProtocol: true,
        searchOptimized: true,
        semanticMarkup: true
      }
    };
  }

  async getProducts(params = {}) {
    const { 
      limit = 20, 
      offset = 0, 
      category, 
      search, 
      sortBy = 'name',
      sortOrder = 'asc',
      includeVariants = false,
      includeImages = true
    } = params;

    // Mock product data - in real implementation, this would query CommerceTools
    const mockProducts = [
      {
        id: 'prod-1',
        sku: 'SF-DRESS-001',
        name: 'Elegant Summer Dress',
        description: 'Beautiful flowing summer dress perfect for any occasion',
        category: {
          id: 'cat-women',
          name: 'Women',
          slug: 'women'
        },
        brand: 'Sunrise Fashion',
        price: {
          current: { amount: 89.99, currency: 'EUR' },
          original: { amount: 119.99, currency: 'EUR' },
          discount: 25
        },
        availability: 'InStock',
        images: includeImages ? [
          { url: '/images/dress-1-main.jpg', alt: 'Elegant Summer Dress - Main View' },
          { url: '/images/dress-1-side.jpg', alt: 'Elegant Summer Dress - Side View' }
        ] : [],
        attributes: {
          color: 'Blue',
          size: ['S', 'M', 'L', 'XL'],
          material: '100% Cotton',
          care: 'Machine wash cold',
          style: 'Casual'
        },
        variants: includeVariants ? [
          { id: 'var-1', sku: 'SF-DRESS-001-S-BLUE', size: 'S', color: 'Blue' },
          { id: 'var-2', sku: 'SF-DRESS-001-M-BLUE', size: 'M', color: 'Blue' }
        ] : [],
        seo: {
          title: 'Elegant Summer Dress - Sunrise Fashion',
          description: 'Shop the elegant summer dress at Sunrise Fashion. Perfect for casual and formal occasions.',
          keywords: ['summer dress', 'elegant dress', 'women fashion', 'casual wear']
        },
        ratings: {
          average: 4.5,
          count: 23,
          distribution: { 5: 15, 4: 6, 3: 2, 2: 0, 1: 0 }
        },
        tags: ['new-arrival', 'bestseller', 'sustainable'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-08-20T14:30:00Z'
      },
      {
        id: 'prod-2',
        sku: 'SF-SHIRT-002',
        name: 'Classic White Shirt',
        description: 'Timeless white shirt suitable for business and casual wear',
        category: {
          id: 'cat-men',
          name: 'Men',
          slug: 'men'
        },
        brand: 'Sunrise Fashion',
        price: {
          current: { amount: 59.99, currency: 'EUR' }
        },
        availability: 'InStock',
        images: includeImages ? [
          { url: '/images/shirt-1-main.jpg', alt: 'Classic White Shirt - Main View' }
        ] : [],
        attributes: {
          color: 'White',
          size: ['S', 'M', 'L', 'XL', 'XXL'],
          material: '100% Cotton',
          fit: 'Regular',
          collar: 'Button-down'
        },
        seo: {
          title: 'Classic White Shirt - Sunrise Fashion',
          description: 'Essential white shirt for men. Perfect for business and casual occasions.',
          keywords: ['white shirt', 'men fashion', 'business wear', 'classic shirt']
        },
        ratings: {
          average: 4.7,
          count: 45
        },
        tags: ['essential', 'versatile'],
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-08-15T11:20:00Z'
      }
    ];

    // Apply filters
    let filteredProducts = mockProducts;
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.slug === category || p.category.name.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.seo.keywords.some(k => k.includes(searchLower))
      );
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'price':
          aVal = a.price.current.amount;
          bVal = b.price.current.amount;
          break;
        case 'rating':
          aVal = a.ratings?.average || 0;
          bVal = b.ratings?.average || 0;
          break;
        case 'name':
        default:
          aVal = a.name;
          bVal = b.name;
      }
      
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return {
      products: paginatedProducts,
      pagination: {
        total: filteredProducts.length,
        limit,
        offset,
        hasMore: offset + limit < filteredProducts.length
      },
      filters: {
        category,
        search,
        sortBy,
        sortOrder
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        aiOptimized: true
      }
    };
  }

  async getProductDetails(productId) {
    // Mock detailed product data
    const product = {
      id: productId,
      sku: 'SF-DRESS-001',
      name: 'Elegant Summer Dress',
      description: 'Beautiful flowing summer dress perfect for any occasion. Made from premium cotton with attention to detail and comfort.',
      longDescription: `This elegant summer dress combines style and comfort in one beautiful piece. 
        Crafted from 100% premium cotton, it features a flowing silhouette that flatters all body types. 
        The dress is perfect for both casual outings and more formal occasions, making it a versatile 
        addition to any wardrobe.`,
      category: {
        id: 'cat-women',
        name: 'Women',
        slug: 'women',
        breadcrumb: ['Home', 'Women', 'Dresses']
      },
      brand: {
        name: 'Sunrise Fashion',
        description: 'Premium fashion brand focused on quality and sustainability'
      },
      price: {
        current: { amount: 89.99, currency: 'EUR', formatted: '€89.99' },
        original: { amount: 119.99, currency: 'EUR', formatted: '€119.99' },
        discount: { percentage: 25, amount: 30.00, formatted: '€30.00' }
      },
      availability: {
        status: 'InStock',
        quantity: 15,
        restockDate: null,
        shippingTime: '2-3 business days'
      },
      images: [
        { 
          url: '/images/dress-1-main.jpg', 
          alt: 'Elegant Summer Dress - Main View',
          type: 'main',
          width: 800,
          height: 1200
        },
        { 
          url: '/images/dress-1-side.jpg', 
          alt: 'Elegant Summer Dress - Side View',
          type: 'detail',
          width: 800,
          height: 1200
        }
      ],
      variants: [
        {
          id: 'var-1',
          sku: 'SF-DRESS-001-S-BLUE',
          attributes: { size: 'S', color: 'Blue' },
          availability: 'InStock',
          price: { amount: 89.99, currency: 'EUR' }
        },
        {
          id: 'var-2',
          sku: 'SF-DRESS-001-M-BLUE',
          attributes: { size: 'M', color: 'Blue' },
          availability: 'InStock',
          price: { amount: 89.99, currency: 'EUR' }
        }
      ],
      attributes: {
        color: { value: 'Blue', hex: '#4A90E2' },
        sizes: ['S', 'M', 'L', 'XL'],
        material: '100% Cotton',
        care: ['Machine wash cold', 'Tumble dry low', 'Iron on low heat'],
        style: 'Casual',
        season: 'Summer',
        fit: 'Regular',
        length: 'Midi',
        neckline: 'Round',
        sleeves: 'Short'
      },
      specifications: {
        weight: '0.3 kg',
        dimensions: 'One size fits most',
        countryOfOrigin: 'Portugal',
        sustainabilityCertification: 'GOTS Certified'
      },
      seo: {
        title: 'Elegant Summer Dress - Premium Cotton Dress | Sunrise Fashion',
        description: 'Shop the elegant summer dress at Sunrise Fashion. Made from 100% premium cotton, perfect for casual and formal occasions. Free shipping over €50.',
        keywords: ['summer dress', 'elegant dress', 'women fashion', 'cotton dress', 'casual wear', 'formal dress'],
        canonicalUrl: `/product/elegant-summer-dress/${productId}`
      },
      ratings: {
        average: 4.5,
        count: 23,
        distribution: { 5: 15, 4: 6, 3: 2, 2: 0, 1: 0 },
        reviews: [
          {
            id: 'rev-1',
            rating: 5,
            title: 'Perfect summer dress!',
            comment: 'Love the quality and fit. Very comfortable and stylish.',
            author: 'Sarah M.',
            date: '2024-08-15',
            verified: true
          }
        ]
      },
      relatedProducts: ['prod-3', 'prod-4', 'prod-5'],
      crossSells: ['acc-1', 'acc-2'],
      tags: ['new-arrival', 'bestseller', 'sustainable', 'cotton', 'summer'],
      collections: ['Summer 2024', 'Sustainable Fashion'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-08-20T14:30:00Z',
      aiMetadata: {
        searchTerms: ['elegant dress', 'summer fashion', 'cotton dress', 'blue dress'],
        styleAdvice: 'Perfect for brunch dates, garden parties, or casual office wear',
        sizingAdvice: 'Runs true to size. For a looser fit, consider sizing up',
        careInstructions: 'Gentle machine wash to maintain fabric quality and color'
      }
    };

    return {
      product,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        aiOptimized: true
      }
    };
  }

  async getCategories() {
    return {
      categories: [
        {
          id: 'cat-women',
          name: 'Women',
          slug: 'women',
          description: 'Fashion for women including dresses, tops, bottoms, and accessories',
          level: 1,
          parentId: null,
          productCount: 85,
          image: '/images/categories/women.jpg',
          subcategories: [
            {
              id: 'cat-women-dresses',
              name: 'Dresses',
              slug: 'dresses',
              level: 2,
              parentId: 'cat-women',
              productCount: 25
            },
            {
              id: 'cat-women-tops',
              name: 'Tops',
              slug: 'tops',
              level: 2,
              parentId: 'cat-women',
              productCount: 35
            }
          ]
        },
        {
          id: 'cat-men',
          name: 'Men',
          slug: 'men',
          description: 'Fashion for men including shirts, pants, jackets, and accessories',
          level: 1,
          parentId: null,
          productCount: 65,
          image: '/images/categories/men.jpg',
          subcategories: [
            {
              id: 'cat-men-shirts',
              name: 'Shirts',
              slug: 'shirts',
              level: 2,
              parentId: 'cat-men',
              productCount: 20
            }
          ]
        }
      ],
      meta: {
        timestamp: new Date().toISOString(),
        totalCategories: 2,
        totalSubcategories: 3,
        aiOptimized: true
      }
    };
  }

  async searchProducts(params = {}) {
    const { q: query, ...otherParams } = params;
    
    if (!query) {
      return {
        error: 'Search query is required',
        suggestions: ['dresses', 'shirts', 'accessories', 'summer fashion']
      };
    }

    // Use the existing getProducts method with search parameter
    const results = await this.getProducts({ search: query, ...otherParams });
    
    return {
      ...results,
      query,
      searchMeta: {
        processingTime: '0.05s',
        suggestions: query.length > 2 ? ['summer dresses', 'elegant wear', 'cotton clothing'] : [],
        filters: {
          categories: ['Women', 'Men', 'Accessories'],
          priceRanges: ['€0-50', '€50-100', '€100-200', '€200+'],
          brands: ['Sunrise Fashion'],
          colors: ['Blue', 'White', 'Black', 'Red'],
          sizes: ['S', 'M', 'L', 'XL']
        }
      }
    };
  }

  async getSiteStructure() {
    return {
      navigation: {
        main: [
          { name: 'Home', path: '/', type: 'page', priority: 1 },
          { name: 'Women', path: '/products/women', type: 'category', priority: 0.9 },
          { name: 'Men', path: '/products/men', type: 'category', priority: 0.9 },
          { name: 'Accessories', path: '/products/accessories', type: 'category', priority: 0.8 },
          { name: 'Stores', path: '/stores', type: 'page', priority: 0.7 }
        ],
        footer: [
          { name: 'About Us', path: '/about', type: 'page' },
          { name: 'Contact', path: '/contact', type: 'page' },
          { name: 'Shipping Info', path: '/shipping', type: 'info' },
          { name: 'Returns', path: '/returns', type: 'info' },
          { name: 'Size Guide', path: '/size-guide', type: 'info' },
          { name: 'Privacy Policy', path: '/privacy', type: 'legal' },
          { name: 'Terms of Service', path: '/terms', type: 'legal' }
        ],
        user: [
          { name: 'Login', path: '/login', type: 'auth' },
          { name: 'Register', path: '/register', type: 'auth' },
          { name: 'My Account', path: '/user', type: 'account' },
          { name: 'Order History', path: '/user/orders', type: 'account' },
          { name: 'Wishlist', path: '/user/wishlist', type: 'account' }
        ],
        shopping: [
          { name: 'Cart', path: '/cart', type: 'cart' },
          { name: 'Checkout', path: '/checkout', type: 'checkout' }
        ]
      },
      pages: {
        total: 25,
        types: {
          product: 150,
          category: 8,
          static: 12,
          user: 5
        }
      },
      seo: {
        robotsTxt: '/robots.txt',
        sitemap: '/sitemap.xml',
        aiSitemap: '/api/ai/sitemap'
      },
      meta: {
        timestamp: new Date().toISOString(),
        aiOptimized: true
      }
    };
  }

  async getSchemaData() {
    return {
      schemas: {
        organization: {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Sunrise Fashion",
          "description": "Premium fashion e-commerce platform",
          "url": typeof window !== 'undefined' ? window.location.origin : 'https://sunrise-fashion.com',
          "logo": "/favicon.ico",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["English", "Deutsch"]
          }
        },
        website: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Sunrise Fashion",
          "url": typeof window !== 'undefined' ? window.location.origin : 'https://sunrise-fashion.com',
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        },
        ecommerce: {
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          "name": "Sunrise Fashion",
          "description": "Premium fashion e-commerce platform",
          "paymentAccepted": ["Credit Card", "PayPal", "Bank Transfer"],
          "priceRange": "€29.99-€299.99",
          "currenciesAccepted": ["EUR", "USD"]
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        schemaVersion: "https://schema.org/version/latest/",
        aiOptimized: true
      }
    };
  }

  async handleMCPRequest(action, body) {
    const mcpPath = `/mcp/${action}`;
    return await mcpHttpHandler.handleRequest('POST', mcpPath, body);
  }

  async getAICapabilities() {
    return {
      capabilities: {
        structuredData: {
          jsonLD: true,
          microdata: false,
          rdfa: false,
          openGraph: true,
          twitterCards: true,
          schemaOrg: true
        },
        apis: {
          rest: true,
          graphql: false,
          mcp: true,
          webhooks: false
        },
        search: {
          fullText: true,
          faceted: true,
          autocomplete: true,
          semantic: false,
          aiPowered: true
        },
        content: {
          multiLanguage: true,
          localization: true,
          personalization: false,
          recommendations: true
        },
        integration: {
          chatbots: true,
          voiceAssistants: false,
          aiAgents: true,
          automation: true
        }
      },
      endpoints: Array.from(this.endpoints.keys()),
      protocols: {
        mcp: {
          version: '2024-11-05',
          features: ['tools', 'resources', 'prompts']
        },
        rest: {
          version: '1.0',
          authentication: 'optional'
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  async getAISitemap() {
    return {
      sitemap: {
        pages: [
          {
            url: '/',
            type: 'homepage',
            priority: 1.0,
            changeFreq: 'daily',
            lastMod: '2024-08-28',
            aiMetadata: {
              contentType: 'homepage',
              primaryPurpose: 'product discovery',
              keyFeatures: ['hero banner', 'featured products', 'categories']
            }
          },
          {
            url: '/products/women',
            type: 'category',
            priority: 0.9,
            changeFreq: 'daily',
            lastMod: '2024-08-28',
            aiMetadata: {
              contentType: 'product-listing',
              category: 'women',
              productCount: 85
            }
          },
          {
            url: '/product/elegant-summer-dress/prod-1',
            type: 'product',
            priority: 0.8,
            changeFreq: 'weekly',
            lastMod: '2024-08-20',
            aiMetadata: {
              contentType: 'product-detail',
              productId: 'prod-1',
              category: 'women-dresses',
              price: 89.99,
              availability: 'in-stock'
            }
          }
        ],
        statistics: {
          totalPages: 175,
          lastGenerated: new Date().toISOString(),
          categories: 8,
          products: 150,
          staticPages: 17
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        aiOptimized: true,
        format: 'json'
      }
    };
  }

  // Handle API requests
  async handleRequest(method, path, params = {}, body = null) {
    // Match dynamic routes
    let matchedEndpoint = null;
    let pathParams = {};

    for (const [route, config] of this.endpoints) {
      if (route.includes(':')) {
        const routePattern = route.replace(/:[^/]+/g, '([^/]+)');
        const regex = new RegExp(`^${routePattern}$`);
        const match = path.match(regex);
        
        if (match && config.method === method) {
          matchedEndpoint = config;
          const paramNames = route.match(/:[^/]+/g) || [];
          paramNames.forEach((param, index) => {
            pathParams[param.substring(1)] = match[index + 1];
          });
          break;
        }
      } else if (route === path && config.method === method) {
        matchedEndpoint = config;
        break;
      }
    }

    if (!matchedEndpoint) {
      throw new Error(`Endpoint not found: ${method} ${path}`);
    }

    try {
      if (pathParams.id) {
        return await matchedEndpoint.handler(pathParams.id, params, body);
      } else if (path.includes('/mcp/')) {
        const action = pathParams.action || path.split('/').pop();
        return await matchedEndpoint.handler(action, body);
      } else {
        return await matchedEndpoint.handler(params, body);
      }
    } catch (error) {
      return {
        error: {
          message: error.message,
          code: 500,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}

export const aiApiService = new AIApiService();