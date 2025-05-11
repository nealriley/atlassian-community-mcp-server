# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Atlassian Community MCP Server

This project is an MCP (Model Context Protocol) server built on Cloudflare Workers, designed to provide tools for interacting with the Atlassian Community API. It allows AI assistants to search for community posts, discover topics by tags, and find related content.

## Commands

- **Start Development Server**: `npm run dev` or `npm run start`
- **Deploy to Cloudflare**: `npm run deploy`
- **Format Code**: `npm run format`
- **Lint Code**: `npm run lint:fix`
- **Generate Cloudflare Types**: `npm run cf-typegen`

## Architecture

### Core Components

1. **MCP Agent & Server**
   - The project is built around the `MyMCP` class which extends `McpAgent`
   - Each MCP server exposes tools via SSE (Server-Sent Events) endpoints
   - The server runs on Cloudflare Workers

2. **API Integration**
   - The server connects to the Atlassian Community API
   - Uses LQL (Lithium Query Language) to perform searches against community content
   - Handles formatting and parsing of API responses

3. **Tools**
   - `searchCommunity`: Search posts by terms, IDs, or tags
   - `discoverPostsByTags`: Find posts with specific tags
   - `findRelatedPosts`: Discover content related to a specific post

4. **Logger**
   - Comprehensive logging system for requests and responses
   - Formats results for better readability

## Development Workflow

1. Edit tools in the `MyMCP` class within `src/index.ts`
2. Run the local development server with `npm run dev`
3. Test tools via the Cloudflare AI Playground or Claude Desktop client
4. Deploy to production with `npm run deploy`

## Code Style

The project uses Biome for formatting and linting with the following rules:
- 4-space indentation
- 100 character line width
- Organized imports
- TypeScript strict mode

## Connection Methods

- **Cloudflare AI Playground**: Connect using `your-domain.workers.dev/sse`
- **Claude Desktop**: Configure using `mcp-remote` proxy (see README)