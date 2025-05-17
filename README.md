# Atlassian Community MCP Server

A search service for the Atlassian Community built using the Model Context Protocol (MCP). This project enables AI assistants and other applications to search, retrieve, and analyze content from the Atlassian Community forums.

## Project Overview

The Atlassian Community MCP server provides endpoints for searching community posts, filtering by tags, retrieving trending content, and accessing user contributions. It's designed to be used by AI agents, integrations, and tools that need to access Atlassian Community content programmatically.

## Local Development

To set up and run this project locally for development:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/atlassian-community-mcp-server.git
   cd atlassian-community-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Your MCP server will be available at: `http://localhost:8787/mcp`
   (The SSE endpoint will be at: `http://localhost:8787/sse`)

5. For health check, visit: `http://localhost:8787/health`

## Adding Tests

This project uses Jest for testing. To add and run tests:

1. Create test files with the `.test.ts` extension in the same directory as the file you're testing

2. Write your tests using the Jest testing framework. Example:
   ```typescript
   // services.test.ts
   import { searchByQuery } from './services';
   
   describe('searchByQuery', () => {
     test('should return search results', async () => {
       const results = await searchByQuery('test', 5, 0, 'desc');
       expect(results).toHaveProperty('success');
       expect(results).toHaveProperty('items');
     });
   });
   ```

3. Run all tests:
   ```bash
   npm test
   ```

4. Run a specific test file:
   ```bash
   npm test -- services.test.ts
   ```

5. For faster testing during development, you can also use the test-functions script:
   ```bash
   npx tsx src/test-functions.ts
   ```

## Feature Requests and Bug Reports

We use GitHub issues to track feature requests and bug reports. To open a new issue:

1. Go to the [GitHub Issues](https://github.com/yourusername/atlassian-community-mcp-server/issues) page

2. Click on "New Issue"

3. Choose the appropriate template (Feature Request or Bug Report)

4. Fill out the required information:
   - For feature requests: describe the desired functionality, why it's needed, and any implementation ideas
   - For bug reports: provide steps to reproduce, expected behavior, actual behavior, and environment details

5. Submit the issue

## Submitting Pull Requests

We welcome contributions! To submit a pull request:

1. Fork the repository

2. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/issue-you-are-fixing
   ```

3. Make your changes and commit them with descriptive commit messages:
   ```bash
   git commit -m "Add new feature: detailed description"
   ```

4. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request:
   - Go to the original repository
   - Click "Pull Requests" and then "New Pull Request"
   - Choose "compare across forks"
   - Select your fork and branch
   - Fill out the PR template with a description of your changes
   - Reference any related issues using the "Fixes #issue-number" syntax

6. Wait for code review

7. Address any feedback and update your PR as needed

## Development Guidelines

1. Follow the TypeScript coding style used throughout the project

2. Add comments for complex logic

3. Write tests for new features

4. Update documentation when adding or changing features

## Project Structure

```
├── src/                    # Source files and Jest tests
│   ├── index.ts           # Main entry point, MCP server setup and endpoint definitions
│   ├── services.ts        # Core service functions that interact with the Atlassian Community API
│   ├── services.test.ts   # Tests for service functions
│   ├── utils.ts           # Utility functions for API requests, formatting, logging
│   └── test-functions.ts  # Script to test service functions directly
└── jest.config.js         # Jest configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

<!-- Temporarily removed as getPopularTags is unavailable
For the `getPopularTags` tool, the response format is slightly different:

```json
{
  "success": true,
  "message": "Found X total tags. Showing Y most popular tags.",
  "tags": [
    {
      "name": "jira",
      "count": 1234
    }
  ],
  "tip": "Use these tags with the searchByTags tool to find relevant posts."
}
```
-->

## Connect to AI Assistants

### Cloudflare AI Playground

1. Go to https://playground.ai.cloudflare.com/
2. Enter your deployed MCP server URL (`atlassian-community-mcp-server.<your-account>.workers.dev/sse`)
3. You can now use your MCP tools directly from the playground!

### Claude Desktop

To connect to your remote MCP server from Claude Desktop, follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user) and within Claude Desktop go to Settings > Developer > Edit Config.

Update with this configuration:

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse"  // or your deployed URL
      ]
    }
  }
}
```

## Development

### Project Structure

- `src/index.ts` - Main MCP server definition and tool configuration
- `src/services.ts` - Service functions for interacting with the Atlassian Community API
- `src/utils.ts` - Utility functions for logging, formatting, and API requests
- `src/services.test.ts` - Tests for service functions

### Developing New Tools

To add a new tool to the MCP server:

1. Add a new service function in `src/services.ts` that fetches data from the Atlassian Community API
2. Add a corresponding test in `src/services.test.ts`
3. Add a new tool definition in `src/index.ts` using `this.server.tool()`
4. Update the README.md to document the new tool

### Commands

- `npm run dev` - Start the development server
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run format` - Format code using Biome
- `npm run lint:fix` - Lint and fix code using Biome