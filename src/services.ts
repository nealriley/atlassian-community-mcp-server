import { executeApiRequest, formatSearchResults, formatTagsResults, Logger } from "./utils";

/**
 * Search all community content (posts and articles) by query terms
 * @param searchTerms The terms to search for in subjects and bodies
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 * @param sortOrder Sorting order by post date (asc or desc)
 */
export async function searchByQuery(
	searchTerms: string,
	limit = 25,
	offset = 0,
	sortOrder: "asc" | "desc" = "desc",
) {
	Logger.logRequest("searchByQuery", { searchTerms, limit, offset, sortOrder });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE depth = 0";

		// Add search terms
		query += ` AND (subject MATCHES '${searchTerms}' OR body MATCHES '${searchTerms}')`;

		// Add sorting
		query += ` ORDER BY post_time ${sortOrder}`;

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "searchByQuery");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("searchByQuery", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("searchByQuery", error);
		throw error;
	}
}

/**
 * Search only Q&A posts (question and answer type content) by query terms
 * @param searchTerms The terms to search for in subjects and bodies
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 * @param sortOrder Sorting order by post date (asc or desc)
 */
export async function searchQandAPosts(
	searchTerms: string,
	limit = 25,
	offset = 0,
	sortOrder: "asc" | "desc" = "desc",
) {
	Logger.logRequest("searchQandAPosts", { searchTerms, limit, offset, sortOrder });

	try {
		// Build the query
		// Filter for Q&A posts by specifying conversation.style = 'qanda'
		let query = "SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'qanda'";

		// Add search terms
		query += ` AND (subject MATCHES '${searchTerms}' OR body MATCHES '${searchTerms}')`;

		// Add sorting
		query += ` ORDER BY post_time ${sortOrder}`;

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "searchQandAPosts");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("searchQandAPosts", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("searchQandAPosts", error);
		throw error;
	}
}

/**
 * Search only blog posts (knowledge base type content) by query terms
 * @param searchTerms The terms to search for in subjects and bodies
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 * @param sortOrder Sorting order by post date (asc or desc)
 */
export async function searchBlogPosts(
	searchTerms: string,
	limit = 25,
	offset = 0,
	sortOrder: "asc" | "desc" = "desc",
) {
	Logger.logRequest("searchBlogPosts", { searchTerms, limit, offset, sortOrder });

	try {
		// Build the query
		// Filter for blog posts by specifying conversation.style = 'blog'
		let query = "SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'blog'";

		// Add search terms
		query += ` AND (subject MATCHES '${searchTerms}' OR body MATCHES '${searchTerms}')`;

		// Add sorting
		query += ` ORDER BY post_time ${sortOrder}`;

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "searchBlogPosts");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("searchBlogPosts", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("searchBlogPosts", error);
		throw error;
	}
}

/**
 * Search community posts by query terms and tags
 * @param searchTerms The terms to search for in subjects and bodies
 * @param tags Array of tags to filter by
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 * @param sortOrder Sorting order by post date (asc or desc)
 */
export async function searchByQueryAndTag(
	searchTerms: string,
	tags: string[],
	limit = 25,
	offset = 0,
	sortOrder: "asc" | "desc" = "desc",
) {
	Logger.logRequest("searchByQueryAndTag", { searchTerms, tags, limit, offset, sortOrder });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE depth = 0";

		// Add search terms
		query += ` AND (subject MATCHES '${searchTerms}' OR body MATCHES '${searchTerms}')`;

		// Add tags filter
		if (tags && tags.length > 0) {
			const tagsList = tags.map((tag) => `'${tag}'`).join(", ");
			query += ` AND tags.text IN (${tagsList})`;
		}

		// Add sorting
		query += ` ORDER BY post_time ${sortOrder}`;

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "searchByQueryAndTag");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("searchByQueryAndTag", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("searchByQueryAndTag", error);
		throw error;
	}
}

/**
 * Get top posts by views for a specific tag
 * @param tag Tag to filter by
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 */
export async function getTopPostsByViewsForTag(
	tag: string,
	limit = 25,
	offset = 0,
) {
	Logger.logRequest("getTopPostsByViewsForTag", { tag, limit, offset });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE depth = 0";

		// Add tag filter
		query += ` AND tags.text = '${tag}'`;

		// Order by view count
		query += " ORDER BY view_count DESC";

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "getTopPostsByViewsForTag");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("getTopPostsByViewsForTag", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("getTopPostsByViewsForTag", error);
		throw error;
	}
}

/**
 * Get most recent posts (both Q&A and articles)
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 */
export async function getMostRecentPosts(limit = 25, offset = 0) {
	Logger.logRequest("getMostRecentPosts", { limit, offset });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE depth = 0";

		// Order by post time
		query += " ORDER BY post_time DESC";

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "getMostRecentPosts");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("getMostRecentPosts", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("getMostRecentPosts", error);
		throw error;
	}
}

/**
 * Get most recent Q&A posts
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 */
export async function getMostRecentQandAPosts(limit = 25, offset = 0) {
	Logger.logRequest("getMostRecentQandAPosts", { limit, offset });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'qanda'";

		// Order by post time
		query += " ORDER BY post_time DESC";

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "getMostRecentQandAPosts");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("getMostRecentQandAPosts", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("getMostRecentQandAPosts", error);
		throw error;
	}
}

/**
 * Get most recent blog posts
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 */
export async function getMostRecentBlogPosts(limit = 25, offset = 0) {
	Logger.logRequest("getMostRecentBlogPosts", { limit, offset });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'blog'";

		// Order by post time
		query += " ORDER BY post_time DESC";

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "getMostRecentBlogPosts");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("getMostRecentBlogPosts", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("getMostRecentBlogPosts", error);
		throw error;
	}
}

/**
 * Get most recent posts with a specific tag
 * @param tag Tag to filter by
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 */
export async function getMostRecentPostsByTag(tag: string, limit = 25, offset = 0) {
	Logger.logRequest("getMostRecentPostsByTag", { tag, limit, offset });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE depth = 0";

		// Add tag filter
		query += ` AND tags.text = '${tag}'`;

		// Order by post time
		query += " ORDER BY post_time DESC";

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "getMostRecentPostsByTag");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("getMostRecentPostsByTag", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("getMostRecentPostsByTag", error);
		throw error;
	}
}

/**
 * Get most recent Q&A posts with a specific tag
 * @param tag Tag to filter by
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 */
export async function getMostRecentQandAPostsByTag(tag: string, limit = 25, offset = 0) {
	Logger.logRequest("getMostRecentQandAPostsByTag", { tag, limit, offset });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'qanda'";

		// Add tag filter
		query += ` AND tags.text = '${tag}'`;

		// Order by post time
		query += " ORDER BY post_time DESC";

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "getMostRecentQandAPostsByTag");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("getMostRecentQandAPostsByTag", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("getMostRecentQandAPostsByTag", error);
		throw error;
	}
}

/**
 * Get most recent blog posts with a specific tag
 * @param tag Tag to filter by
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 */
export async function getMostRecentBlogPostsByTag(tag: string, limit = 25, offset = 0) {
	Logger.logRequest("getMostRecentBlogPostsByTag", { tag, limit, offset });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'blog'";

		// Add tag filter
		query += ` AND tags.text = '${tag}'`;

		// Order by post time
		query += " ORDER BY post_time DESC";

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "getMostRecentBlogPostsByTag");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("getMostRecentBlogPostsByTag", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("getMostRecentBlogPostsByTag", error);
		throw error;
	}
}

/**
 * Get posts or answers by a specific user
 * @param username Username to filter by
 * @param includeAnswers Whether to include answers (depth > 0)
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 */
export async function getContentByUser(
	username: string,
	includeAnswers = false,
	limit = 25,
	offset = 0,
) {
	Logger.logRequest("getContentByUser", { username, includeAnswers, limit, offset });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE";

		// Filter by depth if we don't want answers
		if (!includeAnswers) {
			query += " depth = 0 AND";
		}

		// Add user filter
		query += ` author.login = '${username}'`;

		// Order by post time
		query += " ORDER BY post_time DESC";

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "getContentByUser");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("getContentByUser", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("getContentByUser", error);
		throw error;
	}
}

/**
 * Get all answers for a specific post
 * @param postId ID of the post to get answers for
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip (for pagination)
 */
export async function getAnswersForPost(postId: string, limit = 25, offset = 0) {
	Logger.logRequest("getAnswersForPost", { postId, limit, offset });

	try {
		// Build the query
		let query = "SELECT * FROM messages WHERE depth > 0";

		// Add post ID filter
		query += ` AND parent.id = '${postId}'`;

		// Order by post time
		query += " ORDER BY post_time ASC";

		// Add limit and offset
		query += ` LIMIT ${limit} OFFSET ${offset}`;

		// Execute the query
		const data = await executeApiRequest(query, "getAnswersForPost");

		// Format the results
		const formattedData = formatSearchResults(data);

		Logger.logResponse("getAnswersForPost", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("getAnswersForPost", error);
		throw error;
	}
}

/**
 * Get the most popular tags on the community
 * @param limit Maximum number of tags to return
 */
export async function getPopularTags(limit = 20) {
	Logger.logRequest("getPopularTags", { limit });

	try {
		// Build the query to get top tags by post count
		let query = "SELECT tags.text, COUNT(*) AS tag_count FROM messages";
		query += " WHERE depth = 0 AND tags.text IS NOT NULL";
		query += " GROUP BY tags.text ORDER BY tag_count DESC";
		query += ` LIMIT ${limit}`;

		// Execute the query
		const data = await executeApiRequest(query, "getPopularTags");

		// Format the results
		const formattedData = formatTagsResults(data);

		Logger.logResponse("getPopularTags", true, formattedData);
		return formattedData;
	} catch (error) {
		Logger.logError("getPopularTags", error);
		throw error;
	}
}
