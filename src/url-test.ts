// Quick test to verify URL generation in formatPost function
const utils = require('./utils');

// Sample post data
const samplePost = {
  id: 'post-123',
  subject: 'Test Post Title',
  author: { login: 'test-user' },
  postTime: '2025-04-01T12:00:00Z',
  board: { id: 'jira-software' },
  tags: [{ text: 'test-tag' }, { text: 'jira' }],
  viewCount: 100,
  replyCount: 5,
  acceptedSolutionId: 'answer-456',
  body: '<p>This is a test post body</p>'
};

// Format the post and log the result
const formattedPost = utils.formatPost(samplePost);
console.log('URL Test Results:');
console.log('id:', formattedPost.id);
console.log('url:', formattedPost.url);
console.log('communityLink:', formattedPost.communityLink);

// Test that the URL generation works correctly with different title formats
const specialCharPost = {
  ...samplePost,
  id: 'post-456',
  subject: 'Special Ch@r$ & Symbols: In This? Title!'
};

const formattedSpecialCharPost = utils.formatPost(specialCharPost);
console.log('\nSpecial Character URL Test:');
console.log('id:', formattedSpecialCharPost.id);
console.log('url:', formattedSpecialCharPost.url);
console.log('communityLink:', formattedSpecialCharPost.communityLink);

// Test that the URL generation works correctly with missing board ID
const noBoardPost = {
  ...samplePost,
  id: 'post-789',
  board: undefined
};

const formattedNoBoardPost = utils.formatPost(noBoardPost);
console.log('\nNo Board URL Test:');
console.log('id:', formattedNoBoardPost.id);
console.log('url:', formattedNoBoardPost.url);
console.log('communityLink:', formattedNoBoardPost.communityLink);