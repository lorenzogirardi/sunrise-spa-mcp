import { ref, onUnmounted } from 'vue';

export function useSEO() {
  const metaElements = ref([]);

  const setMetaTag = (name, content, property = null) => {
    if (!content) return;

    // Remove existing meta tag
    const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
    const existing = document.querySelector(selector);
    if (existing) {
      existing.remove();
    }

    // Create new meta tag
    const meta = document.createElement('meta');
    if (property) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', name);
    }
    meta.setAttribute('content', content);
    
    document.head.appendChild(meta);
    metaElements.value.push(meta);
    
    return meta;
  };

  const setTitle = (title) => {
    if (title) {
      document.title = title;
    }
  };

  const setCanonicalUrl = (url) => {
    // Remove existing canonical link
    const existing = document.querySelector('link[rel="canonical"]');
    if (existing) {
      existing.remove();
    }

    // Create new canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url || window.location.href);
    
    document.head.appendChild(link);
    metaElements.value.push(link);
    
    return link;
  };

  const setBasicSEO = ({ title, description, keywords, image, url }) => {
    if (title) {
      setTitle(title);
      setMetaTag('title', title);
    }
    
    if (description) {
      setMetaTag('description', description);
    }
    
    if (keywords) {
      setMetaTag('keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords);
    }
    
    if (url) {
      setCanonicalUrl(url);
    }
    
    if (image) {
      setMetaTag(null, image, 'og:image');
    }

    // AI-friendly meta tags
    setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('googlebot', 'index, follow');
    setMetaTag('bingbot', 'index, follow');
    setMetaTag('slurp', 'index, follow');
    setMetaTag('duckduckbot', 'index, follow');
  };

  const setOpenGraphTags = ({ title, description, image, url, type = 'website', siteName = 'Sunrise Fashion' }) => {
    setMetaTag(null, title, 'og:title');
    setMetaTag(null, description, 'og:description');
    if (image) setMetaTag(null, image, 'og:image');
    setMetaTag(null, url || window.location.href, 'og:url');
    setMetaTag(null, type, 'og:type');
    setMetaTag(null, siteName, 'og:site_name');
    setMetaTag(null, 'en_US', 'og:locale');
    
    // Additional Open Graph tags for e-commerce
    if (type === 'product') {
      setMetaTag(null, 'Sunrise Fashion', 'product:brand');
      setMetaTag(null, 'new', 'product:condition');
      setMetaTag(null, 'Fashion', 'product:category');
    }
  };

  const setTwitterCardTags = ({ title, description, image, card = 'summary_large_image' }) => {
    setMetaTag('twitter:card', card);
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);
    setMetaTag('twitter:site', '@SunriseFashion');
    setMetaTag('twitter:creator', '@SunriseFashion');
  };

  const setProductSEO = (product) => {
    if (!product) return;

    const productName = product.name || product.masterData?.current?.name?.en || 'Product';
    const productDescription = product.description || product.masterData?.current?.description?.en || '';
    const productImage = product.images?.[0] || product.masterData?.current?.masterVariant?.images?.[0]?.url;
    const productPrice = product.price?.value?.centAmount ? (product.price.value.centAmount / 100).toFixed(2) : null;
    const currency = product.price?.value?.currencyCode || 'EUR';

    const title = `${productName} - Sunrise Fashion`;
    const description = productDescription || `Shop ${productName} at Sunrise Fashion. Premium quality fashion with fast shipping.`;
    
    setBasicSEO({
      title,
      description,
      keywords: [productName, 'fashion', 'clothing', 'style', 'premium'],
      image: productImage,
      url: window.location.href
    });

    setOpenGraphTags({
      title,
      description,
      image: productImage,
      type: 'product'
    });

    setTwitterCardTags({
      title,
      description,
      image: productImage
    });

    // E-commerce specific meta tags
    if (productPrice) {
      setMetaTag('product:price:amount', productPrice);
      setMetaTag('product:price:currency', currency);
    }
    
    setMetaTag('product:availability', product.availability || 'in stock');
    setMetaTag('product:condition', 'new');
  };

  const setCategorySEO = (category, products = []) => {
    const categoryName = category.name || category.name?.en || 'Category';
    const title = `${categoryName} - Sunrise Fashion`;
    const description = `Shop ${categoryName} at Sunrise Fashion. Discover our curated collection of premium fashion items.`;
    
    setBasicSEO({
      title,
      description,
      keywords: [categoryName, 'fashion', 'clothing', 'collection', 'style'],
      url: window.location.href
    });

    setOpenGraphTags({
      title,
      description,
      type: 'website'
    });

    setTwitterCardTags({
      title,
      description
    });

    // Category-specific meta tags
    setMetaTag('category', categoryName);
    setMetaTag('product-count', products.length.toString());
  };

  const setHomeSEO = () => {
    const title = 'Sunrise Fashion - Premium Fashion E-commerce';
    const description = 'Discover premium fashion at Sunrise Fashion. Shop curated collections of clothing, accessories, and style essentials with fast worldwide shipping.';
    
    setBasicSEO({
      title,
      description,
      keywords: ['fashion', 'clothing', 'style', 'premium', 'e-commerce', 'shopping', 'accessories'],
      url: window.location.href
    });

    setOpenGraphTags({
      title,
      description,
      type: 'website'
    });

    setTwitterCardTags({
      title,
      description
    });

    // Homepage specific meta tags
    setMetaTag('page-type', 'homepage');
    setMetaTag('content-type', 'e-commerce');
  };

  const setCheckoutSEO = () => {
    const title = 'Checkout - Sunrise Fashion';
    const description = 'Complete your purchase securely at Sunrise Fashion. Fast checkout with multiple payment options.';
    
    setBasicSEO({
      title,
      description,
      url: window.location.href
    });

    // Checkout specific meta tags
    setMetaTag('robots', 'noindex, nofollow'); // Don't index checkout pages
    setMetaTag('page-type', 'checkout');
  };

  const clearAllMeta = () => {
    metaElements.value.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    metaElements.value = [];
  };

  onUnmounted(() => {
    clearAllMeta();
  });

  return {
    setMetaTag,
    setTitle,
    setCanonicalUrl,
    setBasicSEO,
    setOpenGraphTags,
    setTwitterCardTags,
    setProductSEO,
    setCategorySEO,
    setHomeSEO,
    setCheckoutSEO,
    clearAllMeta
  };
}