// Test script to verify all service functions work
const services = require('./services');

// Test parameters
const testParams = {
  searchTerms: 'test',
  tags: ['jira', 'confluence'],
  tag: 'jira',
  limit: 5,
  offset: 0,
  sortOrder: 'desc',
  username: 'test_user',
  includeAnswers: true,
  postId: '123456'
};

// Array of function tests
const tests = [
  {
    name: '1. searchByQuery',
    fn: async () => services.searchByQuery(
      testParams.searchTerms, 
      testParams.limit, 
      testParams.offset, 
      testParams.sortOrder
    ),
    description: 'Search community posts by query (all tags)'
  },
  {
    name: '2. searchByQueryAndTag',
    fn: async () => services.searchByQueryAndTag(
      testParams.searchTerms, 
      testParams.tags, 
      testParams.limit, 
      testParams.offset, 
      testParams.sortOrder
    ),
    description: 'Search community posts by query and tags'
  },
  {
    name: '3. getTopPostsByViewsForTag',
    fn: async () => services.getTopPostsByViewsForTag(
      testParams.tag, 
      testParams.limit, 
      testParams.offset
    ),
    description: 'Get top posts by views for a tag'
  },
  {
    name: '4. getMostRecentPosts',
    fn: async () => services.getMostRecentPosts(
      testParams.limit, 
      testParams.offset
    ),
    description: 'Get most recent posts (all tags)'
  },
  {
    name: '5. getMostRecentPostsByTag',
    fn: async () => services.getMostRecentPostsByTag(
      testParams.tag, 
      testParams.limit, 
      testParams.offset
    ),
    description: 'Get most recent posts for a tag'
  },
  {
    name: '6. getContentByUser',
    fn: async () => services.getContentByUser(
      testParams.username, 
      testParams.includeAnswers, 
      testParams.limit, 
      testParams.offset
    ),
    description: 'Get content by user'
  },
  {
    name: '7. getAnswersForPost',
    fn: async () => services.getAnswersForPost(
      testParams.postId, 
      testParams.limit, 
      testParams.offset
    ),
    description: 'Get answers for a post'
  }
];

// Function to analyze the response type structure
function analyzeResponseType(response) {
  if (response === null) return 'null';
  if (response === undefined) return 'undefined';
  
  if (Array.isArray(response)) {
    if (response.length === 0) return 'Empty Array []';
    let sampleItem = response[0];
    let itemType = typeof sampleItem;
    
    if (itemType === 'object' && sampleItem !== null) {
      const keys = Object.keys(sampleItem);
      return `Array<{ ${keys.join(', ')} }>`;
    }
    
    return `Array<${itemType}>`;
  }
  
  if (typeof response === 'object' && response !== null) {
    const keys = Object.keys(response);
    return `{ ${keys.join(', ')} }`;
  }
  
  return typeof response;
}

async function runTests() {
  console.log('\n🔍 Testing service functions...\n');
  
  for (const test of tests) {
    try {
      console.log(`\nTesting: ${test.name} - ${test.description}`);
      console.log('Running function...');
      
      const result = await test.fn();
      
      console.log('✅ PASS - Function executed successfully');
      console.log('Response Type:', analyzeResponseType(result));
      
      // Log a sample of the data if available
      if (result && typeof result === 'object') {
        console.log('Sample Data:', JSON.stringify(result).substring(0, 200) + '...');
      }
    } catch (error) {
      console.log(`❌ FAIL - Error: ${error.message}`);
      console.log('Stack:', error.stack);
    }
    
    // Add a small pause between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Function tests completed');
}

runTests();
