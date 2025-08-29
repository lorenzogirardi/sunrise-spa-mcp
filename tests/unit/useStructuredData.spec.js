/**
 * Unit Tests for useStructuredData Composable
 *
 * This spec tests the functionality of the `useStructuredData` composable, which is
 * responsible for generating and managing JSON-LD structured data scripts in the document head.
 *
 * The tests cover the following scenarios:
 * 1. `addStructuredData`: Adding a new JSON-LD script to the document head.
 * 2. `removeStructuredData`: Removing a JSON-LD script by its ID.
 * 3. `clearAllStructuredData`: Removing all managed JSON-LD scripts.
 * 4. `addOrganizationSchema`: Correctly generating the Organization schema.
 * 5. `addWebsiteSchema`: Correctly generating the WebSite schema.
 * 6. `addProductSchema`: Correctly generating the Product schema with dynamic data.
 * 7. `addBreadcrumbSchema`: Correctly generating the BreadcrumbList schema.
 *
 * These tests ensure that the structured data is generated accurately and that the
 * DOM manipulation (adding/removing scripts) is handled correctly.
 */

import { useStructuredData } from '@/composables/useStructuredData';

describe('useStructuredData', () => {
  // Helper to get parsed JSON from a script element
  const getJsonFromScript = (script) => JSON.parse(script.textContent);

  beforeEach(() => {
    // Clear all structured data before each test
    const { clearAllStructuredData } = useStructuredData();
    clearAllStructuredData();
    document.head.innerHTML = ''; // Ensure a clean head for each test
  });

  it('should add a structured data script to the document head', () => {
    const { addStructuredData } = useStructuredData();
    const testData = { '@type': 'Test', name: 'Test Data' };
    addStructuredData(testData, 'test-id');

    const script = document.getElementById('test-id');
    expect(script).not.toBeNull();
    expect(script.type).toBe('application/ld+json');
    expect(getJsonFromScript(script)).toEqual(testData);
  });

  it('should remove a structured data script by id', () => {
    const { addStructuredData, removeStructuredData } = useStructuredData();
    addStructuredData({ name: 'test' }, 'test-remove-id');

    removeStructuredData('test-remove-id');
    const script = document.getElementById('test-remove-id');
    expect(script).toBeNull();
  });

  it('should generate a valid Organization schema', () => {
    const { addOrganizationSchema } = useStructuredData();
    const script = addOrganizationSchema();
    const jsonData = getJsonFromScript(script);

    expect(jsonData['@type']).toBe('Organization');
    expect(jsonData.name).toBe('Sunrise Fashion');
  });

  it('should generate a valid WebSite schema', () => {
    const { addWebsiteSchema } = useStructuredData();
    const script = addWebsiteSchema();
    const jsonData = getJsonFromScript(script);

    expect(jsonData['@type']).toBe('WebSite');
    expect(jsonData.url).toBe(window.location.origin);
  });

  it('should generate a valid Product schema', () => {
    const { addProductSchema } = useStructuredData();
    const product = {
      name: 'Test Product',
      description: 'A great product',
      sku: 'TEST-001',
      images: ['image1.jpg'],
      price: { value: { centAmount: 12345, currencyCode: 'USD' } },
      availability: 'InStock',
    };
    const script = addProductSchema(product);
    const jsonData = getJsonFromScript(script);

    expect(jsonData['@type']).toBe('Product');
    expect(jsonData.name).toBe('Test Product');
    expect(jsonData.sku).toBe('TEST-001');
    expect(jsonData.offers.price).toBe('123.45');
    expect(jsonData.offers.priceCurrency).toBe('USD');
  });

  it('should generate a valid Breadcrumb schema', () => {
    const { addBreadcrumbSchema } = useStructuredData();
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Category', url: '/category' },
    ];
    const script = addBreadcrumbSchema(breadcrumbs);
    const jsonData = getJsonFromScript(script);

    expect(jsonData['@type']).toBe('BreadcrumbList');
    expect(jsonData.itemListElement).toHaveLength(2);
    expect(jsonData.itemListElement[0].name).toBe('Home');
  });
});
