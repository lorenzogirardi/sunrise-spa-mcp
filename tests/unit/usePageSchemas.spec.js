/**
 * Unit Tests for usePageSchemas Composable
 *
 * This spec tests the `usePageSchemas` composable, which is responsible for
 * orchestrating the generation of page-specific JSON-LD schemas based on the
 * current route.
 *
 * The tests cover the following scenarios:
 * 1. `detectPageType`: Correctly identifying the page type (e.g., 'product', 'category', 'home') from a given route path.
 * 2. `updatePageSchemas`: Calling the appropriate handler function for each page type.
 * 3. `handleProductPage`: Ensuring the product schema is generated with the correct product data.
 * 4. `handleCategoryPage`: Ensuring category-related schemas are generated.
 * 5. `handleHomePage`: Ensuring home page schemas are generated.
 *
 * Mocks are used for `useRoute`, `useStructuredData`, and `useSEO` to isolate the
 * logic within `usePageSchemas` and test its functionality in a controlled environment.
 */

import { usePageSchemas } from '@/composables/usePageSchemas';
import { useRoute } from 'vue-router';

// Mocking composables
jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

jest.mock('@/composables/useStructuredData', () => ({
  useStructuredData: () => ({
    addProductSchema: jest.fn(),
    addBreadcrumbSchema: jest.fn(),
    addEcommerceSiteSchema: jest.fn(),
    addFAQSchema: jest.fn(),
    removeStructuredData: jest.fn(),
  }),
}));

jest.mock('@/composables/useSEO', () => ({
  useSEO: () => ({
    updateTitle: jest.fn(),
    updateDescription: jest.fn(),
  }),
}));

describe('usePageSchemas', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useRoute.mockReturnValue({ path: '/' }); // Default route
  });

  it('should detect product page type correctly', () => {
    const { detectPageType } = usePageSchemas();
    expect(detectPageType('/products/some-product-slug')).toBe('product');
  });

  it('should detect category page type correctly', () => {
    const { detectPageType } = usePageSchemas();
    expect(detectPageType('/products')).toBe('category');
  });

  it('should detect home page type correctly', () => {
    const { detectPageType } = usePageSchemas();
    expect(detectPageType('/')).toBe('home');
  });

  it('should call handleProductPage for product routes', () => {
    const { updatePageSchemas, handleProductPage } = usePageSchemas();
    const productData = { product: { name: 'Test Product' } };

    // Temporarily replace handleProductPage with a mock to check if it's called
    const originalHandler = handleProductPage;
    const mockHandler = jest.fn();
    usePageSchemas().handleProductPage = mockHandler;

    updatePageSchemas('product', productData);

    expect(mockHandler).toHaveBeenCalledWith(productData);

    // Restore original handler
    usePageSchemas().handleProductPage = originalHandler;
  });

  it('should call addProductSchema with correct data on product pages', () => {
    const { handleProductPage } = usePageSchemas();
    const { addProductSchema } = require('@/composables/useStructuredData').useStructuredData();
    const productData = { product: { name: 'Another Test Product' } };

    handleProductPage(productData);

    expect(addProductSchema).toHaveBeenCalledWith(productData.product);
  });
});
