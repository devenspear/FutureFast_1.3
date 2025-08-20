// Test Notion API Configuration
require('dotenv').config({ path: '.env.local' });

console.log('=== Notion Integration Test ===\n');

// Check environment variables
const notionToken = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

console.log('1. Checking environment variables:');
console.log('   NOTION_TOKEN:', notionToken ? `Configured (${notionToken.substring(0, 10)}...)` : 'NOT CONFIGURED ❌');
console.log('   NOTION_DATABASE_ID:', notionDatabaseId || 'NOT CONFIGURED ❌');

if (!notionToken || notionToken === 'your_notion_integration_token_here') {
  console.log('\n❌ ERROR: Notion token is not properly configured!');
  console.log('\nTo fix this:');
  console.log('1. Go to https://www.notion.so/my-integrations');
  console.log('2. Create a new integration or use an existing one');
  console.log('3. Copy the "Internal Integration Token"');
  console.log('4. Update NOTION_TOKEN in .env.local file');
}

if (!notionDatabaseId || notionDatabaseId === 'your_notion_database_id_here') {
  console.log('\n❌ ERROR: Notion database ID is not properly configured!');
  console.log('\nTo fix this:');
  console.log('1. Open your Notion database');
  console.log('2. Copy the URL from your browser');
  console.log('3. Extract the 32-character ID between the last / and the ?');
  console.log('   Example: https://notion.so/workspace/Database-abc123def456?v=xyz');
  console.log('   Database ID: abc123def456');
  console.log('4. Update NOTION_DATABASE_ID in .env.local file');
}

// Test API connection if credentials are configured
if (notionToken && notionToken !== 'your_notion_integration_token_here' && 
    notionDatabaseId && notionDatabaseId !== 'your_notion_database_id_here') {
  
  console.log('\n2. Testing Notion API connection...');
  
  const { Client } = require('@notionhq/client');
  
  const notion = new Client({
    auth: notionToken,
  });
  
  // Test the connection
  notion.databases.query({
    database_id: notionDatabaseId,
    page_size: 1
  })
  .then(response => {
    console.log('✅ Successfully connected to Notion!');
    console.log(`   Found ${response.results.length} items in database`);
    console.log('   Database is properly configured and accessible');
  })
  .catch(error => {
    console.log('❌ Failed to connect to Notion:');
    console.log(`   Error: ${error.message}`);
    
    if (error.code === 'object_not_found') {
      console.log('\nPossible issues:');
      console.log('1. Database ID is incorrect');
      console.log('2. Database is not shared with the integration');
      console.log('   - Open your database in Notion');
      console.log('   - Click Share → Invite');
      console.log('   - Search for your integration name');
      console.log('   - Give it "Can edit" permissions');
    } else if (error.code === 'unauthorized') {
      console.log('\nPossible issues:');
      console.log('1. Integration token is invalid or expired');
      console.log('2. Create a new token at https://www.notion.so/my-integrations');
    }
  });
} else {
  console.log('\n⚠️  Cannot test API connection - credentials not configured');
  console.log('Please configure the environment variables first.');
}