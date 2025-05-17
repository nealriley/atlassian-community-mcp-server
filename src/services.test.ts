import {
	searchByQuery,
	searchByQueryAndTag,
	searchQandAPosts,
	searchBlogPosts,
	getTopPostsByViewsForTag,
	getMostRecentPosts,
	getMostRecentPostsByTag,
	getMostRecentQandAPosts,
	getMostRecentBlogPosts,
	getMostRecentQandAPostsByTag,
	getMostRecentBlogPostsByTag,
	getContentByUser,
	getAnswersForPost,
	getPopularTags,
} from "./services";
import { executeApiRequest } from "./utils";

// Mock the executeApiRequest function
jest.mock("./utils", () => {
	const originalModule = jest.requireActual("./utils");

	return {
		...originalModule,
		executeApiRequest: jest.fn(),
		Logger: {
			logRequest: jest.fn(),
			logApiRequest: jest.fn(),
			logResponse: jest.fn(),
			logError: jest.fn(),
		},
	};
});

// Mock data
const mockApiResponse = {
	data: {
		items: [
			{
				id: "post-123",
				subject: "Test Post",
				author: { login: "test-user" },
				postTime: "2025-04-01T12:00:00Z",
				tags: [{ text: "test-tag" }, { text: "jira" }],
				viewCount: 100,
				replyCount: 5,
				acceptedSolutionId: "answer-456",
				body: "<p>This is a test post body</p>",
				board: { id: "jira-software" },
			},
		],
		size: 25,
		startIndex: 0,
		totalSize: 1,
	},
};

describe("AtlassianCommunityServices", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(executeApiRequest as jest.Mock).mockResolvedValue(mockApiResponse);
	});

	// Test that formatting includes the community link
	test("response formatting includes valid community links", async () => {
		const result = await searchByQuery("test");

		// Verify the URL format is correct
		expect(result.items[0].communityLink).toBeDefined();
		expect(result.items[0].communityLink).toContain("https://community.atlassian.com/t5/jira-software/test-post/td-p/post-123");

		// Verify the tip is included
		expect(result.tip).toBeDefined();
		expect(result.tip).toContain("communityLink");
	});

	test("searchByQuery should build the correct query", async () => {
		await searchByQuery("test query", 10, 5, "asc");

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth = 0 AND (subject MATCHES 'test query' OR body MATCHES 'test query') ORDER BY post_time asc LIMIT 10 OFFSET 5",
			"searchByQuery",
		);
	});

	test("searchByQueryAndTag should build the correct query with tags", async () => {
		await searchByQueryAndTag("test query", ["jira", "confluence"], 10, 5, "desc");

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth = 0 AND (subject MATCHES 'test query' OR body MATCHES 'test query') AND tags.text IN ('jira', 'confluence') ORDER BY post_time desc LIMIT 10 OFFSET 5",
			"searchByQueryAndTag",
		);
	});

        test("getTopPostsByViewsForTag should build the correct query", async () => {
                const unsortedResponse = {
                        data: {
                                items: [
                                        { id: "a", viewCount: 50, postTime: "2025-04-01T12:00:00Z" },
                                        { id: "b", viewCount: 200, postTime: "2025-04-02T12:00:00Z" },
                                        { id: "c", viewCount: 100, postTime: "2025-04-03T12:00:00Z" },
                                ],
                                size: 25,
                                startIndex: 0,
                                totalSize: 3,
                        },
                };

                (executeApiRequest as jest.Mock).mockResolvedValueOnce(unsortedResponse);

                const result = await getTopPostsByViewsForTag("jira", 15, 10);

                const fetchLimit = Math.min(15 * 3, 100);

                expect(executeApiRequest).toHaveBeenCalledWith(
                        `SELECT * FROM messages WHERE depth = 0 AND tags.text = 'jira' ORDER BY post_time DESC LIMIT ${fetchLimit} OFFSET 10`,
                        "getTopPostsByViewsForTag",
                );

                expect(result.items.map((i) => i.viewCount)).toEqual([200, 100, 50]);
        });

	test("getMostRecentPosts should build the correct query", async () => {
		await getMostRecentPosts(20, 0);

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth = 0 ORDER BY post_time DESC LIMIT 20 OFFSET 0",
			"getMostRecentPosts",
		);
	});

	test("getMostRecentPostsByTag should build the correct query", async () => {
		await getMostRecentPostsByTag("atlassian-cloud", 15, 30);

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth = 0 AND tags.text = 'atlassian-cloud' ORDER BY post_time DESC LIMIT 15 OFFSET 30",
			"getMostRecentPostsByTag",
		);
	});

	test("getContentByUser should build the correct query for posts only", async () => {
		await getContentByUser("test-user", false, 30, 0);

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth = 0 AND author.login = 'test-user' ORDER BY post_time DESC LIMIT 30 OFFSET 0",
			"getContentByUser",
		);
	});

	test("getContentByUser should build the correct query for posts and answers", async () => {
		await getContentByUser("test-user", true, 30, 0);

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE author.login = 'test-user' ORDER BY post_time DESC LIMIT 30 OFFSET 0",
			"getContentByUser",
		);
	});

	test("getAnswersForPost should build the correct query", async () => {
		await getAnswersForPost("post-123", 50, 0);

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth > 0 AND parent.id = 'post-123' ORDER BY post_time ASC LIMIT 50 OFFSET 0",
			"getAnswersForPost",
		);
	});

	test("getPopularTags should build the correct query", async () => {
		await getPopularTags(30);

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT tags.text, COUNT(*) AS tag_count FROM messages WHERE depth = 0 AND tags.text IS NOT NULL GROUP BY tags.text ORDER BY tag_count DESC LIMIT 30",
			"getPopularTags",
		);
	});

	test("searchQandAPosts should build the correct query", async () => {
		await searchQandAPosts("jira workflow", 10, 5, "desc");

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'qanda' AND (subject MATCHES 'jira workflow' OR body MATCHES 'jira workflow') ORDER BY post_time desc LIMIT 10 OFFSET 5",
			"searchQandAPosts",
		);
	});

	test("searchBlogPosts should build the correct query", async () => {
		await searchBlogPosts("atlassian cloud", 15, 0, "asc");

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'blog' AND (subject MATCHES 'atlassian cloud' OR body MATCHES 'atlassian cloud') ORDER BY post_time asc LIMIT 15 OFFSET 0",
			"searchBlogPosts",
		);
	});

	test("getMostRecentQandAPosts should build the correct query", async () => {
		await getMostRecentQandAPosts(20, 10);

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'qanda' ORDER BY post_time DESC LIMIT 20 OFFSET 10",
			"getMostRecentQandAPosts",
		);
	});

	test("getMostRecentBlogPosts should build the correct query", async () => {
		await getMostRecentBlogPosts(15, 0);

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'blog' ORDER BY post_time DESC LIMIT 15 OFFSET 0",
			"getMostRecentBlogPosts",
		);
	});

	test("getMostRecentQandAPostsByTag should build the correct query", async () => {
		await getMostRecentQandAPostsByTag("jira-cloud", 10, 5);

		expect(executeApiRequest).toHaveBeenCalledWith(
			"SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'qanda' AND tags.text = 'jira-cloud' ORDER BY post_time DESC LIMIT 10 OFFSET 5",
			"getMostRecentQandAPostsByTag",
		);
	});

        test("getMostRecentBlogPostsByTag should build the correct query", async () => {
                await getMostRecentBlogPostsByTag("confluence", 10, 0);

                expect(executeApiRequest).toHaveBeenCalledWith(
                        "SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'blog' AND tags.text = 'confluence' ORDER BY post_time DESC LIMIT 10 OFFSET 0",
                        "getMostRecentBlogPostsByTag",
                );
        });

        test("searchByQuery escapes single quotes in search terms", async () => {
                await searchByQuery("bob's bug", 10, 0, "desc");

                expect(executeApiRequest).toHaveBeenCalledWith(
                        "SELECT * FROM messages WHERE depth = 0 AND (subject MATCHES 'bob''s bug' OR body MATCHES 'bob''s bug') ORDER BY post_time desc LIMIT 10 OFFSET 0",
                        "searchByQuery",
                );
        });

        test("searchQandAPosts escapes single quotes in search terms", async () => {
                await searchQandAPosts("can't start", 5, 0, "asc");

                expect(executeApiRequest).toHaveBeenCalledWith(
                        "SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'qanda' AND (subject MATCHES 'can''t start' OR body MATCHES 'can''t start') ORDER BY post_time asc LIMIT 5 OFFSET 0",
                        "searchQandAPosts",
                );
        });

        test("searchBlogPosts escapes single quotes in search terms", async () => {
                await searchBlogPosts("atlassian's update", 7, 1, "desc");

                expect(executeApiRequest).toHaveBeenCalledWith(
                        "SELECT * FROM messages WHERE depth = 0 AND conversation.style = 'blog' AND (subject MATCHES 'atlassian''s update' OR body MATCHES 'atlassian''s update') ORDER BY post_time desc LIMIT 7 OFFSET 1",
                        "searchBlogPosts",
                );
        });

        test("searchByQueryAndTag escapes single quotes in terms and tags", async () => {
                await searchByQueryAndTag("bob's bug", ["jira", "o'neil"], 3, 2, "asc");

                expect(executeApiRequest).toHaveBeenCalledWith(
                        "SELECT * FROM messages WHERE depth = 0 AND (subject MATCHES 'bob''s bug' OR body MATCHES 'bob''s bug') AND tags.text IN ('jira', 'o''neil') ORDER BY post_time asc LIMIT 3 OFFSET 2",
                        "searchByQueryAndTag",
                );
        });
});
