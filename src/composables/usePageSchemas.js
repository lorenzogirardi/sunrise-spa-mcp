/**
 * Dynamic Page-Specific Schema Management
 * Handles JSON-LD schemas based on current page context
 */

import { ref, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStructuredData } from './useStructuredData.js';
import { useSEO } from './useSEO.js';

export function usePageSchemas() {
  const route = useRoute();
  const currentPageType = ref('home');
  const currentPageData = ref({});
  
  const { 
    addProductSchema, 
    addBreadcrumbSchema, 
    addEcommerceSiteSchema, 
    addFAQSchema,
    removeStructuredData,
    clearAllStructuredData
  } = useStructuredData();
  
  const { updateTitle, updateDescription } = useSEO();

  // Page type detection based on route
  const detectPageType = (routePath) => {
    if (routePath.includes('/products/') && routePath.split('/').length > 2) {
      return 'product';
    } else if (routePath.includes('/products')) {
      return 'category';
    } else if (routePath === '/' || routePath.includes('/home')) {
      return 'home';
    } else if (routePath.includes('/search')) {
      return 'search';
    } else if (routePath.includes('/cart')) {
      return 'cart';
    } else if (routePath.includes('/checkout')) {
      return 'checkout';
    }
    return 'page';
  };

  // Update schemas based on page type and data
  const updatePageSchemas = (pageType, data = {}) => {
    // Clear existing page-specific schemas
    removeStructuredData('product-schema');
    removeStructuredData('breadcrumb-schema');
    removeStructuredData('ecommerce-schema');
    removeStructuredData('faq-schema');
    removeStructuredData('category-schema');
    removeStructuredData('search-schema');

    currentPageType.value = pageType;
    currentPageData.value = data;

    // Add schemas based on page type
    switch (pageType) {
      case 'product':
        handleProductPage(data);
        break;
        
      case 'category':
        handleCategoryPage(data);
        break;
        
      case 'home':
        handleHomePage(data);
        break;
        
      case 'search':
        handleSearchPage(data);
        break;
        
      case 'cart':
        handleCartPage(data);
        break;
        
      default:
        handleGenericPage(data);
        break;
    }
  };

  // Handle product page schemas
  const handleProductPage = (data) => {
    if (data.product) {
      // Add specific product schema
      addProductSchema(data.product);
      
      // Update SEO for product
      updateTitle(`${data.product.name || 'Product'} - Sunrise Fashion`);
      updateDescription(data.product.description || `Shop ${data.product.name} at Sunrise Fashion. Premium quality fashion with fast shipping.`);
    }
    
    if (data.breadcrumbs) {
      addBreadcrumbSchema(data.breadcrumbs);
    }
    
    // Add product-specific FAQ if available
    if (data.productFAQ) {
      addProductFAQSchema(data.productFAQ);
    }
  };

  // Handle category page schemas
  const handleCategoryPage = (data) => {
    addEcommerceSiteSchema();
    
    if (data.category) {
      addCategorySchema(data.category);
      updateTitle(`${data.category.name || 'Category'} - Sunrise Fashion`);
      updateDescription(`Shop ${data.category.name} at Sunrise Fashion. Discover our premium collection with fast shipping and easy returns.`);
    }
    
    if (data.breadcrumbs) {
      addBreadcrumbSchema(data.breadcrumbs);
    }
    
    if (data.products && data.products.length > 0) {
      addProductListSchema(data.products, data.category);
    }
  };

  // Handle home page schemas
  const handleHomePage = (data) => {
    addEcommerceSiteSchema();
    addFAQSchema();
    
    // Add featured products if available
    if (data.featuredProducts) {
      addFeaturedProductsSchema(data.featuredProducts);
    }
    
    // Add special offers if available
    if (data.offers) {
      addSpecialOffersSchema(data.offers);
    }
  };

  // Handle search page schemas
  const handleSearchPage = (data) => {
    if (data.searchResults && data.query) {
      addSearchResultsSchema(data.searchResults, data.query);
      updateTitle(`Search: ${data.query} - Sunrise Fashion`);
      updateDescription(`Search results for "${data.query}" at Sunrise Fashion. Find the perfect fashion items.`);
    }
  };

  // Handle cart page schemas
  const handleCartPage = (data) => {
    if (data.cartItems) {
      addShoppingCartSchema(data.cartItems);
      updateTitle('Shopping Cart - Sunrise Fashion');
      updateDescription('Review your selected items and proceed to checkout at Sunrise Fashion.');
    }
  };

  // Handle generic pages
  const handleGenericPage = (data) => {
    addEcommerceSiteSchema();
    
    if (data.title) {
      updateTitle(`${data.title} - Sunrise Fashion`);
    }
    
    if (data.description) {
      updateDescription(data.description);
    }
  };

  // Add category-specific schema
  const addCategorySchema = (category) => {
    const categorySchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": category.name || 'Category',
      "description": category.description || `Shop ${category.name} at Sunrise Fashion`,
      "url": `https://ecom-001-jsonldmcp.k8s.it${category.url || ''}`,
      "mainEntity": {
        "@type": "ItemList",
        "name": category.name,
        "numberOfItems": category.productCount || 0
      }
    };

    const { addStructuredData } = useStructuredData();
    addStructuredData(categorySchema, 'category-schema');
  };

  // Add product list schema for category pages
  const addProductListSchema = (products, category) => {
    const productListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${category?.name || 'Products'} Collection`,
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name || product.masterData?.current?.name?.en,
          "url": `https://ecom-001-jsonldmcp.k8s.it/products/${product.slug || product.id}`,
          "image": product.images?.[0] || product.masterData?.current?.masterVariant?.images?.[0]?.url,
          "offers": {
            "@type": "Offer",
            "price": product.price?.value?.centAmount ? (product.price.value.centAmount / 100).toFixed(2) : '0.00',
            "priceCurrency": product.price?.value?.currencyCode || 'EUR'
          }
        }
      }))
    };

    const { addStructuredData } = useStructuredData();
    addStructuredData(productListSchema, 'product-list-schema');
  };

  // Add search results schema
  const addSearchResultsSchema = (results, query) => {
    const searchSchema = {
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      "mainEntity": {
        "@type": "ItemList",
        "name": `Search results for "${query}"`,
        "numberOfItems": results.length,
        "itemListElement": results.slice(0, 10).map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": item.name,
            "url": `https://ecom-001-jsonldmcp.k8s.it/products/${item.slug || item.id}`
          }
        }))
      }
    };

    const { addStructuredData } = useStructuredData();
    addStructuredData(searchSchema, 'search-schema');
  };

  // Add shopping cart schema
  const addShoppingCartSchema = (cartItems) => {
    const cartSchema = {
      "@context": "https://schema.org",
      "@type": "ShoppingCart",
      "name": "Shopping Cart",
      "numberOfItems": cartItems.length,
      "itemListElement": cartItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": item.name,
          "quantity": item.quantity,
          "price": item.price
        }
      }))
    };

    const { addStructuredData } = useStructuredData();
    addStructuredData(cartSchema, 'cart-schema');
  };

  // Add special offers schema
  const addSpecialOffersSchema = (offers) => {
    const offersSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Special Offers",
      "numberOfItems": offers.length,
      "itemListElement": offers.map((offer, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Offer",
          "name": offer.name,
          "description": offer.description,
          "discount": offer.discount,
          "validThrough": offer.validThrough
        }
      }))
    };

    const { addStructuredData } = useStructuredData();
    addStructuredData(offersSchema, 'offers-schema');
  };

  // Add featured products schema
  const addFeaturedProductsSchema = (products) => {
    const featuredSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Featured Products",
      "numberOfItems": products.length,
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "url": `https://ecom-001-jsonldmcp.k8s.it/products/${product.slug || product.id}`,
          "image": product.images?.[0],
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "EUR"
          }
        }
      }))
    };

    const { addStructuredData } = useStructuredData();
    addStructuredData(featuredSchema, 'featured-products-schema');
  };

  // Add product-specific FAQ schema
  const addProductFAQSchema = (faqs) => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const { addStructuredData } = useStructuredData();
    addStructuredData(faqSchema, 'product-faq-schema');
  };

  // Watch route changes and update schemas automatically
  watch(() => route.path, (newPath) => {
    const pageType = detectPageType(newPath);
    updatePageSchemas(pageType, {});
  }, { immediate: true });

  // Auto-detect and set initial page type
  const initializePageSchemas = () => {
    const pageType = detectPageType(route.path);
    updatePageSchemas(pageType, {});
  };

  // Clean up on unmount
  onUnmounted(() => {
    clearAllStructuredData();
  });

  return {
    currentPageType,
    currentPageData,
    updatePageSchemas,
    initializePageSchemas,
    detectPageType,
    
    // Specific page handlers
    handleProductPage,
    handleCategoryPage,
    handleHomePage,
    handleSearchPage,
    handleCartPage,
    
    // Schema helpers
    addCategorySchema,
    addProductListSchema,
    addSearchResultsSchema,
    addShoppingCartSchema,
    addFeaturedProductsSchema,
    addProductFAQSchema
  };
}