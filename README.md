# Atlassian Community MCP Server

This is a Model Context Protocol (MCP) server that provides tools for interacting with the Atlassian Community API. It allows AI assistants to search for community posts, discover topics by tags, and find related content.

## Getting Started

### Deploy to Cloudflare Workers

[![Deploy to Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yourusername/atlassian-community-mcp-server)

This will deploy your MCP server to a URL like: `atlassian-community-mcp-server.<your-account>.workers.dev/sse`

### Local Development

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Your MCP server will be available at: `http://localhost:8787/sse`

## Available Tools

### General Search Tools

#### searchCommunity

Search for all content (both Q&A posts and articles) using query terms in both subject and body.

Parameters:
- `searchTerms` (string, required): Terms to search for
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)
- `sortOrder` (string, optional, default: "desc"): Sort order by post date ("asc" or "desc")

#### searchByTags

Search for posts using a combination of query terms and tags.

Parameters:
- `searchTerms` (string, optional): Terms to search for
- `tags` (array of strings, required): Tags to filter by
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)
- `sortOrder` (string, optional, default: "desc"): Sort order by post date ("asc" or "desc")

### Content Type Specific Search

#### searchQandAPosts

Search for only Q&A type posts (questions) using query terms.

Parameters:
- `searchTerms` (string, required): Terms to search for
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)
- `sortOrder` (string, optional, default: "desc"): Sort order by post date ("asc" or "desc")

#### searchBlogPosts

Search for only blog type content using query terms.

Parameters:
- `searchTerms` (string, required): Terms to search for
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)
- `sortOrder` (string, optional, default: "desc"): Sort order by post date ("asc" or "desc")

### Recent Content Tools

#### getMostRecentPosts

Get the most recent posts (both Q&A and articles) across all topics.

Parameters:
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)

#### getMostRecentQandAPosts

Get the most recent Q&A posts only.

Parameters:
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)

#### getMostRecentBlogPosts

Get the most recent blog content only.

Parameters:
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)

### Tag-based Content Tools

#### getMostRecentPostsByTag

Get the most recent posts (both Q&A and articles) for a specific tag.

Parameters:
- `tag` (string, required): Tag to filter by
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)

#### getMostRecentQandAPostsByTag

Get the most recent Q&A posts for a specific tag.

Parameters:
- `tag` (string, required): Tag to filter by
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)

#### getMostRecentBlogPostsByTag

Get the most recent blog posts for a specific tag.

Parameters:
- `tag` (string, required): Tag to filter by
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)

#### getTopPostsByViews

Get the most viewed posts for a specific tag.

Parameters:
- `tag` (string, required): Tag to filter by
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)

### User & Answer Tools

#### getUserContent

Get posts or answers created by a specific user.

Parameters:
- `username` (string, required): Username to filter by
- `includeAnswers` (boolean, optional, default: false): Whether to include answers (depth > 0)
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)

#### getPostAnswers

Get all answers for a specific post.

Parameters:
- `postId` (string, required): ID of the post to get answers for
- `limit` (number, optional, default: 25): Maximum number of results to return
- `offset` (number, optional, default: 0): Number of results to skip (for pagination)

### Tag Discovery

*Note: The getPopularTags tool is temporarily unavailable due to API limitations.*

<!--
#### getPopularTags

Get the most popular tags on the community.

Parameters:
- `limit` (number, optional, default: 20): Maximum number of tags to return
-->

## Response Format

All tools return responses in the following JSON format:

```json
{
  "success": true,
  "message": "Found X total results. Showing Y results starting from Z.",
  "items": [
    {
      "id": "post-123",
      "title": "Post Title",
      "author": "username",
      "postDate": "2025-04-01, 12:00:00 PM",
      "tags": "tag1, tag2, tag3",
      "viewCount": 100,
      "replyCount": 5,
      "hasAcceptedSolution": true,
      "contentType": "qanda",
      "isQandA": true,
      "isBlog": false,
      "url": "https://community.atlassian.com/t5/forum-name/post-title/td-p/post-123",
      "communityLink": "https://community.atlassian.com/t5/forum-name/post-title/td-p/post-123",
      "excerpt": "This is a snippet of the post content..."
    }
  ],
  "pagination": {
    "total": 100,
    "showing": 25,
    "startIndex": 0,
    "currentPage": 1,
    "totalPages": 4
  },
  "tip": "Each result includes a 'communityLink' field with a direct URL to the post on the Atlassian Community site."
}
```

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