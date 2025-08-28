# 🔄 Dynamic JSON-LD Schemas Guide

## Problem Solved

Previously, all pages showed the same static JSON-LD schemas, which was not optimal for SEO and AI agents. Now each page type gets **dynamic, context-specific schemas** based on the actual content.

## 🚀 How It Works

### 1. Automatic Page Detection
The system automatically detects page types based on the current route:
- `/` or `/home` → Home page schemas
- `/products/[category]` → Category page schemas  
- `/products/[category]/[product]` → Product page schemas
- `/search` → Search results schemas
- `/cart` → Shopping cart schemas

### 2. Dynamic Schema Generation
Each page type gets relevant schemas:
- **Product pages**: Product schema with real product data
- **Category pages**: CollectionPage + ItemList schemas
- **Home page**: E-commerce site + FAQ schemas
- **Search pages**: SearchResultsPage schemas

## 🛠️ Implementation

### Using the AI Page Mixin (Recommended)

```javascript
// In your Vue component
import { aiPageMixin } from '../../../mixins/aiPageMixin.js';

export default {
  name: 'ProductDetailPage',
  mixins: [aiPageMixin],
  
  watch: {
    product: {
      handler(newProduct) {
        if (newProduct) {
          // Automatically generates product-specific schemas
          this.setProductSchemas(newProduct);
        }
      },
      immediate: true
    }
  }
};
```

### Using the Composable Directly

```javascript
// In your Vue component setup
import { usePageSchemas } from '../composables/usePageSchemas.js';

export default {
  setup() {
    const pageSchemas = usePageSchemas();
    
    // Update schemas when data changes
    const updateSchemas = (product) => {
      pageSchemas.updatePageSchemas('product', {
        product: product,
        breadcrumbs: generateBreadcrumbs(product)
      });
    };
    
    return { updateSchemas };
  }
};
```

## 📋 Available Methods

### AI Page Mixin Methods

```javascript
// Set product page schemas
this.setProductSchemas(product, breadcrumbs);

// Set category page schemas  
this.setCategorySchemas(category, products, breadcrumbs);

// Set search page schemas
this.setSearchSchemas(query, searchResults);

// Update any page type
this.updateAISchemas('product', { product, breadcrumbs });
```

### Page Schema Composable Methods

```javascript
const { 
  updatePageSchemas,
  handleProductPage,
  handleCategoryPage,
  handleHomePage,
  handleSearchPage,
  addProductListSchema,
  addCategorySchema
} = usePageSchemas();
```

## 🎯 Page-Specific Schemas

### Product Pages
```json
{
  "@type": "Product",
  "name": "Actual Product Name",
  "description": "Real product description",
  "sku": "PROD-123",
  "price": "29.99",
  "availability": "InStock",
  "image": ["actual-product-image.jpg"]
}
```

### Category Pages
```json
{
  "@type": "CollectionPage",
  "name": "Women's Clothing",
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": 45,
    "itemListElement": [/* actual products */]
  }
}
```

### Search Pages
```json
{
  "@type": "SearchResultsPage",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Search results for 'dresses'",
    "numberOfItems": 12
  }
}
```

## 🔧 Data Normalization

The system automatically handles different data formats:

```javascript
// CommerceTools format
const product = {
  masterData: {
    current: {
      name: { en: "Product Name" },
      masterVariant: {
        sku: "PROD-123",
        prices: [{ value: { centAmount: 2999, currencyCode: "EUR" } }]
      }
    }
  }
};

// Simplified format  
const product = {
  name: "Product Name",
  sku: "PROD-123",
  price: { centAmount: 2999, currencyCode: "EUR" }
};

// Both work automatically!
this.setProductSchemas(product);
```

## 🧪 Testing Dynamic Schemas

```javascript
// Test in browser console
// Navigate to a product page, then:
console.log(document.querySelectorAll('script[type="application/ld+json"]'));

// Should show product-specific schema with real data
```

## 📊 Benefits

### Before (Static Schemas)
- ❌ Same schemas on all pages
- ❌ Generic product data
- ❌ No page context
- ❌ Poor AI understanding

### After (Dynamic Schemas)  
- ✅ Page-specific schemas
- ✅ Real product/category data
- ✅ Contextual information
- ✅ Better AI agent integration
- ✅ Improved SEO

## 🚀 Migration Guide

### Existing Components

1. **Add the mixin**:
```javascript
import { aiPageMixin } from '../../../mixins/aiPageMixin.js';

export default {
  mixins: [aiPageMixin],
  // ... rest of component
};
```

2. **Update schemas when data changes**:
```javascript
watch: {
  product(newProduct) {
    if (newProduct) {
      this.setProductSchemas(newProduct);
    }
  }
}
```

3. **Remove static schema calls** (if any):
```javascript
// Remove these old calls
// addProductSchema(staticData);
// addEcommerceSiteSchema();
```

## 🎯 Best Practices

1. **Always use real data**: Pass actual product/category data, not mock data
2. **Update on data changes**: Use watchers to update schemas when data loads
3. **Include breadcrumbs**: Helps AI agents understand site structure
4. **Normalize data**: Use the mixin's normalization methods for consistency
5. **Test thoroughly**: Check schemas in browser dev tools

## 🔍 Debugging

```javascript
// Check current page schemas
console.log('Current schemas:', 
  Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map(s => JSON.parse(s.textContent))
);

// Check page type detection
import { usePageSchemas } from '../composables/usePageSchemas.js';
const { detectPageType } = usePageSchemas();
console.log('Detected page type:', detectPageType(window.location.pathname));
```

## 📈 Results

With dynamic schemas, AI agents now get:
- **Accurate product information** for each product page
- **Real category data** with actual product counts
- **Contextual breadcrumbs** for better navigation understanding
- **Page-specific SEO data** for improved search rankings

This makes the Sunrise Fashion application truly AI-friendly with schemas that reflect the actual page content!