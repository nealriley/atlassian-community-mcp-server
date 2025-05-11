// Type tests to verify content type filtering
// Using CommonJS format
const utils = require('./utils');

// Sample Q&A post data
const qandaPost = {
    id: 'post-123',
    subject: 'Help with JIRA issues',
    author: { login: 'test-user' },
    postTime: '2025-04-01T12:00:00Z',
    tags: [{ text: 'jira' }, { text: 'help' }],
    viewCount: 100,
    replyCount: 5,
    acceptedSolutionId: 'answer-456',
    body: '<p>This is a question about JIRA</p>',
    board: { id: 'jira-software' },
    conversation: { style: 'qanda' }
};

// Sample article post data
const articlePost = {
    id: 'article-789',
    subject: 'How to use JIRA effectively',
    author: { login: 'expert-user' },
    postTime: '2025-03-28T10:00:00Z',
    tags: [{ text: 'jira' }, { text: 'tutorial' }],
    viewCount: 500,
    replyCount: 10,
    body: '<p>This is an article about JIRA best practices</p>',
    board: { id: 'jira-articles' },
    conversation: { style: 'article' }
};

// Test that the content types are correctly detected
const formattedQandAPost = utils.formatPost(qandaPost);
console.log('Q&A Post Type Test:');
console.log('id:', formattedQandAPost.id);
console.log('contentType:', formattedQandAPost.contentType);
console.log('isQandA:', formattedQandAPost.isQandA);
console.log('isArticle:', formattedQandAPost.isArticle);
console.log('url:', formattedQandAPost.url);
console.log('communityLink:', formattedQandAPost.communityLink);

console.log('\nArticle Type Test:');
const formattedArticlePost = utils.formatPost(articlePost);
console.log('id:', formattedArticlePost.id);
console.log('contentType:', formattedArticlePost.contentType);
console.log('isQandA:', formattedArticlePost.isQandA);
console.log('isArticle:', formattedArticlePost.isArticle);
console.log('url:', formattedArticlePost.url);
console.log('communityLink:', formattedArticlePost.communityLink);

// Test that the URL generation works correctly with different content types
console.log('\nURL Format Test:');
console.log('Q&A URL:', formattedQandAPost.url);
console.log('Article URL:', formattedArticlePost.url);