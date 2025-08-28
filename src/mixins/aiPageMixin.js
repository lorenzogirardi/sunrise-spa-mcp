/**
 * AI Page Mixin
 * Automatically handles page-specific JSON-LD schemas and SEO
 */

import { usePageSchemas } from '../composables/usePageSchemas.js';

export const aiPageMixin = {
  setup() {
    const pageSchemas = usePageSchemas();
    return { pageSchemas };
  },
  
  methods: {
    // Update page schemas with current data
    updateAISchemas(pageType, data = {}) {
      this.pageSchemas.updatePageSchemas(pageType, data);
    },
    
    // Set product page schemas
    setProductSchemas(product, breadcrumbs = null) {
      const data = {
        product: this.normalizeProductData(product),
        breadcrumbs: breadcrumbs || this.generateProductBreadcrumbs(product)
      };
      
      this.updateAISchemas('product', data);
    },
    
    // Set category page schemas
    setCategorySchemas(category, products = [], breadcrumbs = null) {
      const data = {
        category: this.normalizeCategoryData(category),
        products: products.map(p => this.normalizeProductData(p)),
        breadcrumbs: breadcrumbs || this.generateCategoryBreadcrumbs(category)
      };
      
      this.updateAISchemas('category', data);
    },
    
    // Set search page schemas
    setSearchSchemas(query, results = []) {
      const data = {
        query,
        searchResults: results.map(r => this.normalizeProductData(r))
      };
      
      this.updateAISchemas('search', data);
    },
    
    // Normalize product data for consistent schema generation
    normalizeProductData(product) {
      if (!product) return null;
      
      // Handle both CommerceTools format and simplified format
      const current = product.masterData?.current || product;
      const variant = current.masterVariant || current;
      
      return {
        id: product.id,
        name: current.name?.en || current.name || product.name,
        description: current.description?.en || current.description || product.description,
        sku: variant.sku || product.sku,
        slug: current.slug?.en || current.slug || product.slug,
        images: variant.images?.map(img => img.url) || product.images || [],
        price: {
          value: {
            centAmount: variant.prices?.[0]?.value?.centAmount || product.price?.centAmount || 0,
            currencyCode: variant.prices?.[0]?.value?.currencyCode || product.price?.currencyCode || 'EUR'
          }
        },
        categories: product.categories || [],
        availability: variant.availability?.isOnStock ? 'InStock' : 'OutOfStock',
        brand: product.brand || 'Sunrise Fashion',
        rating: product.rating || { average: 4.5, count: 1 }
      };
    },
    
    // Normalize category data
    normalizeCategoryData(category) {
      if (!category) return null;
      
      return {
        id: category.id,
        name: category.name?.en || category.name,
        description: category.description?.en || category.description,
        slug: category.slug?.en || category.slug,
        url: `/products/${category.slug?.en || category.slug || category.id}`,
        productCount: category.productCount || 0
      };
    },
    
    // Generate breadcrumbs for product pages
    generateProductBreadcrumbs(product) {
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' }
      ];
      
      // Add category if available
      if (product.categories && product.categories.length > 0) {
        const category = product.categories[0];
        breadcrumbs.push({
          name: category.name?.en || category.name,
          url: `/products/${category.slug?.en || category.slug || category.id}`
        });
      }
      
      // Add product
      const current = product.masterData?.current || product;
      breadcrumbs.push({
        name: current.name?.en || current.name || product.name,
        url: `/products/${current.slug?.en || current.slug || product.id}`
      });
      
      return breadcrumbs;
    },
    
    // Generate breadcrumbs for category pages
    generateCategoryBreadcrumbs(category) {
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' }
      ];
      
      // Add current category
      breadcrumbs.push({
        name: category.name?.en || category.name,
        url: `/products/${category.slug?.en || category.slug || category.id}`
      });
      
      return breadcrumbs;
    }
  },
  
  // Auto-initialize schemas when component is created
  created() {
    // Initialize with basic page detection
    if (this.pageSchemas) {
      this.pageSchemas.initializePageSchemas();
    }
  }
};