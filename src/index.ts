import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
	searchByQuery,
	searchByQueryAndTag,
	searchQandAPosts,
	searchBlogPosts,
	getTopPostsByViewsForTag,
	getMostRecentPosts,
	getMostRecentQandAPosts,
	getMostRecentBlogPosts,
	getMostRecentPostsByTag,
	getMostRecentQandAPostsByTag,
	getMostRecentBlogPostsByTag,
	getContentByUser,
	getAnswersForPost,
	getPopularTags,
} from "./services";
import { PaginationSchema, SortingSchema } from "./utils";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Atlassian Community MCP Server",
		version: "1.0.0",
	});

	async init() {
		// Search community posts by query
		this.server.tool(
			"searchCommunity",
			{
				searchTerms: z.string().min(1),
				...PaginationSchema,
				...SortingSchema,
			},
			async ({ searchTerms, limit, offset, sortOrder }) => {
				try {
					const results = await searchByQuery(searchTerms, limit, offset, sortOrder);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Search community posts by query and tags
		this.server.tool(
			"searchByTags",
			{
				searchTerms: z.string().optional(),
				tags: z.array(z.string()).min(1),
				...PaginationSchema,
				...SortingSchema,
			},
			async ({ searchTerms, tags, limit, offset, sortOrder }) => {
				try {
					const results = await searchByQueryAndTag(
						searchTerms || "",
						tags,
						limit,
						offset,
						sortOrder,
					);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Get top posts by views for a tag
		this.server.tool(
			"getTopPostsByViews",
			{
				tag: z.string().min(1),
				...PaginationSchema,
			},
			async ({ tag, limit, offset }) => {
				try {
					const results = await getTopPostsByViewsForTag(tag, limit, offset);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Get most recent posts
		this.server.tool(
			"getMostRecentPosts",
			{
				...PaginationSchema,
			},
			async ({ limit, offset }) => {
				try {
					const results = await getMostRecentPosts(limit, offset);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Get most recent posts for a tag
		this.server.tool(
			"getMostRecentPostsByTag",
			{
				tag: z.string().min(1),
				...PaginationSchema,
			},
			async ({ tag, limit, offset }) => {
				try {
					const results = await getMostRecentPostsByTag(tag, limit, offset);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Get content by user
		this.server.tool(
			"getUserContent",
			{
				username: z.string().min(1),
				includeAnswers: z.boolean().optional().default(false),
				...PaginationSchema,
			},
			async ({ username, includeAnswers, limit, offset }) => {
				try {
					const results = await getContentByUser(username, includeAnswers, limit, offset);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Get answers for a post
		this.server.tool(
			"getPostAnswers",
			{
				postId: z.string().min(1),
				...PaginationSchema,
			},
			async ({ postId, limit, offset }) => {
				try {
					const results = await getAnswersForPost(postId, limit, offset);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Get popular tags - temporarily removed due to 400 errors
		// this.server.tool(
		// 	"getPopularTags",
		// 	{
		// 		limit: z.number().min(1).max(100).optional().default(20),
		// 	},
		// 	async ({ limit }) => {
		// 		try {
		// 			const results = await getPopularTags(limit);
		// 			return {
		// 				content: [{ type: "text", text: JSON.stringify(results) }],
		// 			};
		// 		} catch (error) {
		// 			return {
		// 				content: [
		// 					{
		// 						type: "text",
		// 						text: JSON.stringify({
		// 							error: error instanceof Error ? error.message : String(error),
		// 						}),
		// 					},
		// 				],
		// 			};
		// 		}
		// 	},
		// );

		// Search Q&A posts only
		this.server.tool(
			"searchQandAPosts",
			{
				searchTerms: z.string().min(1),
				...PaginationSchema,
				...SortingSchema,
			},
			async ({ searchTerms, limit, offset, sortOrder }) => {
				try {
					const results = await searchQandAPosts(searchTerms, limit, offset, sortOrder);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Search blog posts only
		this.server.tool(
			"searchBlogPosts",
			{
				searchTerms: z.string().min(1),
				...PaginationSchema,
				...SortingSchema,
			},
			async ({ searchTerms, limit, offset, sortOrder }) => {
				try {
					const results = await searchBlogPosts(searchTerms, limit, offset, sortOrder);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Get most recent Q&A posts
		this.server.tool(
			"getMostRecentQandAPosts",
			{
				...PaginationSchema,
			},
			async ({ limit, offset }) => {
				try {
					const results = await getMostRecentQandAPosts(limit, offset);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Get most recent blog posts
		this.server.tool(
			"getMostRecentBlogPosts",
			{
				...PaginationSchema,
			},
			async ({ limit, offset }) => {
				try {
					const results = await getMostRecentBlogPosts(limit, offset);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Get most recent Q&A posts with a specific tag
		this.server.tool(
			"getMostRecentQandAPostsByTag",
			{
				tag: z.string().min(1),
				...PaginationSchema,
			},
			async ({ tag, limit, offset }) => {
				try {
					const results = await getMostRecentQandAPostsByTag(tag, limit, offset);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);

		// Get most recent blog posts with a specific tag
		this.server.tool(
			"getMostRecentBlogPostsByTag",
			{
				tag: z.string().min(1),
				...PaginationSchema,
			},
			async ({ tag, limit, offset }) => {
				try {
					const results = await getMostRecentBlogPostsByTag(tag, limit, offset);
					return {
						content: [{ type: "text", text: JSON.stringify(results) }],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify({
									error: error instanceof Error ? error.message : String(error),
								}),
							},
						],
					};
				}
			},
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		// Log all incoming requests
		console.log("\n==== INCOMING REQUEST ====");
		console.log(`Path: ${url.pathname}`);
		console.log(`Method: ${request.method}`);
		console.log(`Timestamp: ${new Date().toISOString()}`);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			console.log(`Handling SSE request to ${url.pathname}`);
			// @ts-ignore
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			console.log("Handling MCP request");
			// @ts-ignore
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		// Add a health check endpoint
		if (url.pathname === "/health" || url.pathname === "/") {
			console.log("Health check request");
			return new Response(
				JSON.stringify({
					status: "ok",
					message: "Atlassian Community MCP Server is running",
					timestamp: new Date().toISOString(),
					endpoints: ["/mcp", "/sse", "/health"],
					version: "1.0.0",
				}),
				{
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		return new Response("Not found", { status: 404 });
	},
};