import { ref, onUnmounted } from 'vue';

export function useStructuredData() {
  const structuredDataElements = ref([]);

  const addStructuredData = (data, id = null) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    
    if (id) {
      script.id = id;
      // Remove existing script with same ID
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
    }
    
    document.head.appendChild(script);
    structuredDataElements.value.push(script);
    
    return script;
  };

  const removeStructuredData = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
      structuredDataElements.value = structuredDataElements.value.filter(el => el !== element);
    }
  };

  const clearAllStructuredData = () => {
    structuredDataElements.value.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    structuredDataElements.value = [];
  };

  // Organization schema
  const addOrganizationSchema = () => {
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Sunrise Fashion",
      "description": "Premium fashion e-commerce platform powered by CommerceTools",
      "url": window.location.origin,
      "logo": `${window.location.origin}/favicon.ico`,
      "sameAs": [
        "https://demo.commercetools.com/",
        "https://docs.commercetools.com/sdk/sunrise"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English", "Deutsch"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": ["DE", "US"]
      }
    };
    
    return addStructuredData(organizationSchema, 'organization-schema');
  };

  // Website schema
  const addWebsiteSchema = () => {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Sunrise Fashion",
      "description": "Premium fashion e-commerce platform",
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${window.location.origin}/products/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": ["en", "de"],
      "audience": {
        "@type": "Audience",
        "audienceType": "Fashion enthusiasts"
      }
    };
    
    return addStructuredData(websiteSchema, 'website-schema');
  };

  // Product schema
  const addProductSchema = (product) => {
    if (!product) return;

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name || product.masterData?.current?.name?.en || 'Product',
      "description": product.description || product.masterData?.current?.description?.en || '',
      "sku": product.sku || product.masterData?.current?.masterVariant?.sku,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Sunrise Fashion"
      },
      "category": product.categories?.[0]?.name?.en || 'Fashion',
      "image": product.images || product.masterData?.current?.masterVariant?.images?.map(img => img.url) || [],
      "offers": {
        "@type": "Offer",
        "price": product.price?.value?.centAmount ? (product.price.value.centAmount / 100).toFixed(2) : '0.00',
        "priceCurrency": product.price?.value?.currencyCode || 'EUR',
        "availability": product.availability === 'InStock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        "seller": {
          "@type": "Organization",
          "name": "Sunrise Fashion"
        }
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating.average || 4.5,
        "reviewCount": product.rating.count || 1
      } : undefined
    };

    // Clean up undefined values
    Object.keys(productSchema).forEach(key => {
      if (productSchema[key] === undefined) {
        delete productSchema[key];
      }
    });

    return addStructuredData(productSchema, 'product-schema');
  };

  // Breadcrumb schema
  const addBreadcrumbSchema = (breadcrumbs) => {
    if (!breadcrumbs || breadcrumbs.length === 0) return;

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url ? `${window.location.origin}${crumb.url}` : undefined
      }))
    };

    return addStructuredData(breadcrumbSchema, 'breadcrumb-schema');
  };

  // E-commerce site schema
  const addEcommerceSiteSchema = () => {
    const ecommerceSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${window.location.origin}#website`,
      "name": "Sunrise Fashion",
      "description": "Premium fashion e-commerce platform with curated collections",
      "url": window.location.origin,
      "publisher": {
        "@type": "Organization",
        "@id": `${window.location.origin}#organization`,
        "name": "Sunrise Fashion"
      },
      "mainEntity": {
        "@type": "ItemList",
        "name": "Product Categories",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Women's Fashion",
            "url": `${window.location.origin}/products/women`
          },
          {
            "@type": "ListItem", 
            "position": 2,
            "name": "Men's Fashion",
            "url": `${window.location.origin}/products/men`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Accessories",
            "url": `${window.location.origin}/products/accessories`
          }
        ]
      }
    };

    return addStructuredData(ecommerceSchema, 'ecommerce-site-schema');
  };

  // FAQ schema for common e-commerce questions
  const addFAQSchema = () => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What payment methods do you accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept all major credit cards, PayPal, and bank transfers."
          }
        },
        {
          "@type": "Question",
          "name": "What is your return policy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer a 30-day return policy for all items in original condition."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer international shipping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we ship to Germany and the United States with more countries coming soon."
          }
        }
      ]
    };

    return addStructuredData(faqSchema, 'faq-schema');
  };

  onUnmounted(() => {
    clearAllStructuredData();
  });

  return {
    addStructuredData,
    removeStructuredData,
    clearAllStructuredData,
    addOrganizationSchema,
    addWebsiteSchema,
    addProductSchema,
    addBreadcrumbSchema,
    addEcommerceSiteSchema,
    addFAQSchema
  };
}