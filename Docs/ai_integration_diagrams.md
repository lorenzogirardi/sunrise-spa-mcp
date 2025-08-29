# AI Integration Architectural Diagrams

This document provides a visual overview of the AI integration architecture for the Sunrise Fashion e-commerce platform. The diagrams below illustrate the key components and data flows for JSON-LD structured data generation and the Model Context Protocol (MCP) implementation.

---

## 1. JSON-LD Structured Data Generation Flow

This diagram illustrates how page-specific JSON-LD structured data is generated and injected into the application's HTML head.

```
+---------------------------+      +-------------------------+      +--------------------------+
|   Vue Component           |----->|     aiPageMixin         |----->|   usePageSchemas         |
| (e.g., PageProductDetail) |      |                         |      |                          |
+---------------------------+      +-------------------------+      +--------------------------+
           |                                |                                |
           | 1. Data changes (e.g., product loaded) |                                |
           |                                | 2. Watcher triggers `setProductSchemas(product)` |
           |                                |                                | 3. Calls `updatePageSchemas('product', data)`
           |                                |                                |
           |                                |                                |
           v                                v                                v
+---------------------------+      +-------------------------+      +--------------------------+
|   Data Fetching           |<-----|   (Vue Router)          |      |   useStructuredData      |
| (useProductTools)         |      |   Route Change Detection|      |                          |
+---------------------------+      +-------------------------+      +--------------------------+
           ^                                                                 |
           |                                                                 | 4. `addProductSchema(product)` is called
           |                                                                 |
           +-----------------------------------------------------------------+ 5. Script tag is created and injected into document.head
```

**Description of the Flow:**

1.  **Component Data Loading**: A Vue component, such as `PageProductDetail`, loads its data (e.g., product details) using composables like `useProductTools`.
2.  **Mixin Watcher**: The `aiPageMixin`, which is mixed into the component, watches for changes in the component's data. When the data is loaded or updated, the watcher triggers a method like `setProductSchemas`.
3.  **Page Schema Orchestration**: The `setProductSchemas` method in the mixin calls the `updatePageSchemas` function from the `usePageSchemas` composable. This function determines the page type and calls the appropriate handler (e.g., `handleProductPage`).
4.  **Structured Data Generation**: The page-specific handler in `usePageSchemas` then calls a function from the `useStructuredData` composable, such as `addProductSchema`, passing the relevant data.
5.  **DOM Injection**: The `useStructuredData` composable creates a `<script type="application/ld+json">` element containing the generated JSON-LD data and injects it into the `<head>` of the HTML document.

---

## 2. Model Context Protocol (MCP) Architecture

This diagram illustrates the architecture of the MCP implementation, showing how an AI agent can interact with the application.

```
+----------------------+      +--------------------------------+      +----------------------------+
|   AI Agent           |      |   AI API Server                |      |   Sunrise Fashion Backend  |
| (e.g., ChatGPT, Claude)|<---->|   (MCP Implementation)         |<---->|   (GraphQL API, etc.)      |
+----------------------+      +--------------------------------+      +----------------------------+
           |                                |                                |
           | 1. AI sends request to         |                                |
           |    MCP endpoint                |                                |
           |    (e.g., /api/mcp/tools/call) |                                |
           |                                |                                |
           |                                | 2. MCP server receives request |
           |                                |    and identifies the tool     |
           |                                |    to be executed (e.g.,       |
           |                                |    `search_products`)          |
           |                                |                                |
           |                                | 3. MCP server calls the        |
           |                                |    corresponding function      |
           |                                |    which in a real scenario    |
           |                                |    would query the backend.    |
           |                                |                                |
           |                                |                                | 4. Backend returns data
           |                                |                                |
           |                                | 5. MCP server formats the      |
           |                                |    response and sends it back  |
           |                                |    to the AI agent.            |
           |                                |                                |
           | 6. AI agent receives the       |                                |
           |    response and uses the       |                                |
           |    data.                       |                                |
           v                                v                                v
+----------------------+      +--------------------------------+      +----------------------------+
|   (Receives data)    |      |   (Sends response)             |      |   (Provides data)          |
+----------------------+      +--------------------------------+      +----------------------------+
```

**Description of the Architecture:**

1.  **AI Agent Request**: An external AI agent (like ChatGPT or a custom script) sends an HTTP POST request to one of the MCP endpoints exposed by the AI API Server (e.g., `/api/mcp/tools/call`). The request body contains the name of the tool to be executed and its arguments.
2.  **MCP Server Processing**: The AI API Server, which implements the MCP protocol, receives the request. It identifies the requested tool and calls the corresponding function within the `mcpServer` implementation.
3.  **Backend Interaction**: The tool's implementation logic then interacts with the application's backend services (e.g., a GraphQL API) to fetch the required data or perform the requested action.
4.  **Data Return**: The backend service returns the data to the MCP server.
5.  **Response Formatting**: The MCP server formats the data into the structure defined by the MCP specification (e.g., a JSON object with a `content` array).
6.  **AI Agent Receives Response**: The AI agent receives the formatted response and can then use the data for its own purposes, such as answering a user's question or performing another action.
