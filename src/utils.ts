import { z } from "zod";

// Constants
export const ATLASSIAN_API_BASE_URL = "https://community.atlassian.com/forums/s/api/2.0/search";

// Common Zod schemas
export const PaginationSchema = {
	limit: z.number().min(1).max(100).optional().default(25),
	offset: z.number().min(0).optional().default(0),
};

export const SortingSchema = {
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
};

// Logger functions for monitoring requests and responses
export const Logger = {
	logRequest(toolName: string, params: any) {
		console.log("\n==== REQUEST ====");
		console.log(`Tool: ${toolName}`);
		console.log(`Params: ${JSON.stringify(params, null, 2)}`);
		console.log(`Timestamp: ${new Date().toISOString()}`);
	},

	logApiRequest(url: string, query: string) {
		console.log("\n==== API REQUEST ====");
		console.log(`URL: ${url}`);
		console.log(`Query: ${query}`);
		console.log(`Timestamp: ${new Date().toISOString()}`);
	},

	logResponse(toolName: string, success: boolean, data: any) {
		console.log("\n==== RESPONSE ====");
		console.log(`Tool: ${toolName}`);
		console.log(`Success: ${success}`);
		console.log(`Timestamp: ${new Date().toISOString()}`);
		if (success) {
			if (typeof data === "string") {
				console.log(`Data (first 200 chars): ${data.substring(0, 200)}...`);
			} else {
				console.log(`Data: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
			}
		} else {
			console.error(`Error: ${data}`);
		}
	},

	logError(toolName: string, error: any) {
		console.error("\n==== ERROR ====");
		console.error(`Tool: ${toolName}`);
		console.error(`Message: ${error instanceof Error ? error.message : String(error)}`);
		console.error(`Timestamp: ${new Date().toISOString()}`);
		console.error(error instanceof Error ? error.stack : "No stack trace available");
	}
}

// Helper function to execute API requests
export async function executeApiRequest(query: string, toolName: string) {
	try {
		const encodedQuery = encodeURIComponent(query);
		const apiUrl = `${ATLASSIAN_API_BASE_URL}?q=${encodedQuery}`;

		Logger.logApiRequest(apiUrl, query);

		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(`API responded with status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		Logger.logError(toolName, error);
		throw error;
	}
}

// Format post data for consistent response structure
export function formatPost(post: any) {
	const postId = post.id || "Unknown ID";
	const title = post.subject || "No title";
	const author = post.author?.login || "Unknown author";
	const postDate = new Date(post.postTime).toLocaleString() || "Unknown date";

	let tags = "No tags";
	if (post.tags && Array.isArray(post.tags)) {
		tags = post.tags.map((tag: any) => tag.text).join(", ");
	}

	const viewCount = post.viewCount || 0;
	const replyCount = post.replyCount || 0;
	const hasAcceptedSolution = post.acceptedSolutionId ? true : false;

	// Determine content type (blog or q&a)
	const contentType = post.conversation?.style || "unknown";
	const isBlog = contentType === "blog";
	const isQandA = contentType === "qanda";

	// Construct a more user-friendly URL
	// Format: https://community.atlassian.com/t5/[board-id]/[post-title]/td-p/[post-id]
	const boardId = post.board?.id || "forums";
	const slugTitle = post.subject ? post.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "post";
	const url = `https://community.atlassian.com/t5/${boardId}/${slugTitle}/td-p/${postId}`;

	// Create excerpt from body if available
	let excerpt = "";
	if (post.body) {
		const bodyText = post.body.replace(/<[^>]*>/g, ""); // Remove HTML tags
		excerpt = bodyText.length > 200 ? `${bodyText.substring(0, 200)}...` : bodyText;
	}

	return {
		id: postId,
		title,
		author,
		postDate,
		tags,
		viewCount,
		replyCount,
		hasAcceptedSolution,
		contentType,
		isBlog,
		isQandA,
		url,
		communityLink: url, // Add a more explicit property for the link
		excerpt,
		raw: post,
	};
}

// Format search results for consistent response structure
export function formatSearchResults(data: any) {
	try {
		if (!data || !data.data || !Array.isArray(data.data.items)) {
			return {
				success: false,
				message: "No results found or invalid response format.",
				items: [],
				pagination: {
					total: 0,
					showing: 0,
					startIndex: 0,
					currentPage: 0,
					totalPages: 0,
				},
				tip: "When results are found, each item includes a 'communityLink' field with a direct URL to the post.",
			};
		}

		const { items } = data.data;
		const size = data.data.size || items.length;
		const startIndex = data.data.startIndex || 0;
		const totalSize = data.data.totalSize || items.length;

		if (items.length === 0) {
			return {
				success: true,
				message: "No matching results found.",
				items: [],
				pagination: {
					total: totalSize,
					showing: 0,
					startIndex,
					currentPage: size > 0 ? Math.floor(startIndex / size) + 1 : 1,
					totalPages: size > 0 ? Math.ceil(totalSize / size) : 1,
				},
				tip: "When results are found, each item includes a 'communityLink' field with a direct URL to the post.",
			};
		}

		// Format each post
		const formattedItems = items.map((item: any) => formatPost(item));

		return {
			success: true,
			message: `Found ${totalSize} total results. Showing ${items.length} results starting from ${startIndex}.`,
			items: formattedItems,
			pagination: {
				total: totalSize,
				showing: items.length,
				startIndex,
				currentPage: size > 0 ? Math.floor(startIndex / size) + 1 : 1,
				totalPages: size > 0 ? Math.ceil(totalSize / size) : 1,
			},
			// Add a tip to highlight the communityLink field
			tip: "Each result includes a 'communityLink' field with a direct URL to the post on the Atlassian Community site.",
			raw: data,
		};
	} catch (error) {
		return {
			success: false,
			message: `Error formatting results: ${
				error instanceof Error ? error.message : String(error)
			}`,
			items: [],
			pagination: {
				total: 0,
				showing: 0,
				startIndex: 0,
				currentPage: 0,
				totalPages: 0,
			},
			tip: "When results are found, each item includes a 'communityLink' field with a direct URL to the post.",
		};
	}
}

// Format tag results
export function formatTagsResults(data: any) {
	try {
		if (!data || !data.data || !Array.isArray(data.data.items)) {
			return {
				success: false,
				message: "No tag results found or invalid response format.",
				tags: [],
				tip: "Use the searchByTags tool with valid tags to find relevant posts.",
				raw: data,
			};
		}

		const { items } = data.data;
		const totalSize = data.data.totalSize || items.length;

		if (items.length === 0) {
			return {
				success: true,
				message: "No matching tags found.",
				tags: [],
				tip: "Try a broader search to find available tags.",
				raw: data,
			};
		}

		// Format tags
		const formattedTags = items.map((item: any) => ({
			name: item["tags.text"] || "Unknown",
			count: item.tag_count || 0,
		}));

		return {
			success: true,
			message: `Found ${totalSize} total tags. Showing ${items.length} most popular tags.`,
			tags: formattedTags,
			tip: "Use these tags with the searchByTags tool to find relevant posts.",
			raw: data,
		};
	} catch (error) {
		return {
			success: false,
			message: `Error formatting tag results: ${
				error instanceof Error ? error.message : String(error)
			}`,
			tags: [],
			tip: "Try again with a different query or contact support if the issue persists.",
			raw: data,
		};
	}
}