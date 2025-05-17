import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
	searchByQuery,
	searchByQueryAndTag,
	getTopPostsByViewsForTag,
	getMostRecentPosts,
	getMostRecentPostsByTag,
	getContentByUser,
	getAnswersForPost,
} from "./services";
import { PaginationSchema, SortingSchema } from "./utils";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Atlassian Community MCP Server",
		version: "1.0.0",
	});

	async init() {
		// 1. Search community posts by query (look for content in all tags)
		this.server.tool(
                        "searchCommunity",
                        {
                                searchTerms: z.string().min(1),
                                answered: z.enum(["answered", "unanswered"]).optional(),
                                acceptedOnly: z.boolean().optional().default(false),
                                ...PaginationSchema,
                                ...SortingSchema,
                        },
                        async ({ searchTerms, answered, acceptedOnly, limit, offset, sortOrder }) => {
                                try {
                                        const results = await searchByQuery(
                                                searchTerms,
                                                limit,
                                                offset,
                                                sortOrder,
                                                answered,
                                                acceptedOnly,
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

		// 2. Search community posts by query and tags (look for content in specific tags)
		this.server.tool(
                        "searchByTags",
                        {
                                searchTerms: z.string().optional(),
                                tags: z.array(z.string()).min(1),
                                answered: z.enum(["answered", "unanswered"]).optional(),
                                acceptedOnly: z.boolean().optional().default(false),
                                ...PaginationSchema,
                                ...SortingSchema,
                        },
                        async ({ searchTerms, tags, answered, acceptedOnly, limit, offset, sortOrder }) => {
                                try {
                                        const results = await searchByQueryAndTag(
                                                searchTerms || "",
                                                tags,
                                                limit,
                                                offset,
                                                sortOrder,
                                                answered,
                                                acceptedOnly,
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

		// 3. Get top posts by views for a tag (top posts by page views for a given tag)
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

		// 4. Get most recent posts (look for new posts across all tags)
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

		// 5. Get most recent posts for a tag (look for new post in one or more tags)
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

		// 6. Get content by user (get details on users who post, including other posts they've made)
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

		// 7. Get answers for a post (get all comments with a parent post being a specific id)
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