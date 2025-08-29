/**
 * AI Agent Integration Spec
 *
 * This spec tests the integration of AI agents with the Sunrise Fashion application
 * using the Model Context Protocol (MCP). It simulates an AI agent performing
 * common e-commerce tasks like searching for products, getting product details,
 * and managing the shopping cart.
 *
 * The tests cover the following scenarios:
 * 1. Initializing the MCP connection.
 * 2. Searching for products using the `search_products` tool.
 * 3. Retrieving detailed information for a specific product using the `get_product` tool.
 * 4. Adding a product to the shopping cart using the `add_to_cart` tool.
 * 5. Verifying the contents of the shopping cart using the `get_cart` tool.
 *
 * These tests ensure that the MCP implementation is working correctly and that
 * AI agents can effectively interact with the application's core functionalities.
 */

describe('AI Agent using MCP', () => {
  const MCP_API_URL = 'http://localhost:3001/api/mcp';

  // Helper function to call an MCP tool
  const callMcpTool = (toolName, args) => {
    return cy.request({
      method: 'POST',
      url: `${MCP_API_URL}/tools/call`,
      body: {
        name: toolName,
        arguments: args,
      },
    }).then(response => {
      expect(response.status).to.eq(200);
      return JSON.parse(response.body.content[0].text);
    });
  };

  before(() => {
    // Initialize MCP connection before running tests
    cy.request({
      method: 'POST',
      url: `${MCP_API_URL}/initialize`,
      body: {
        protocolVersion: '2024-11-05',
      },
    }).its('status').should('eq', 200);
  });

  it('should allow an AI agent to search for products', () => {
    callMcpTool('search_products', { query: 'dress' }).then(result => {
      expect(result.results).to.be.an('array').and.not.be.empty;
      expect(result.results[0]).to.have.property('name').that.includes('Dress');
    });
  });

  it('should allow an AI agent to get product details', () => {
    callMcpTool('get_product', { productId: 'prod-1' }).then(product => {
      expect(product).to.have.property('id', 'prod-1');
      expect(product).to.have.property('name', 'Elegant Summer Dress');
    });
  });

  it('should allow an AI agent to add a product to the cart', () => {
    callMcpTool('add_to_cart', { productId: 'prod-1', quantity: 1 }).then(result => {
      expect(result.success).to.be.true;
      expect(result.message).to.include('Added 1 item(s) to cart');
    });
  });

  it('should allow an AI agent to get cart information', () => {
    // First, add a product to the cart
    callMcpTool('add_to_cart', { productId: 'prod-2', quantity: 2 });

    // Then, get the cart information
    callMcpTool('get_cart', {}).then(cart => {
      expect(cart).to.have.property('itemCount').that.is.greaterThan(0);
      expect(cart.items).to.be.an('array').and.not.be.empty;

      // Check if the added product is in the cart
      const productInCart = cart.items.find(item => item.productId === 'prod-2');
      expect(productInCart).to.exist;
      expect(productInCart.quantity).to.eq(2);
    });
  });
});
