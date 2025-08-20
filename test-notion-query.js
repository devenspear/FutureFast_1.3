// Test Notion Query to see what's being returned
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

async function testQuery() {
  const client = new Client({
    auth: process.env.NOTION_API_KEY || process.env.NOTION_TOKEN,
  });
  
  const databaseId = process.env.NOTION_DATABASE_ID;
  
  console.log('Testing Notion query with Status = Published filter...\n');
  
  try {
    const response = await client.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Published'
            }
          }
        ]
      },
      sorts: [
        {
          property: 'Publication Date',
          direction: 'descending'
        }
      ],
      page_size: 30 // Get more to see all published articles
    });
    
    console.log(`Found ${response.results.length} articles with Status = 'Published'\n`);
    
    response.results.forEach((page, index) => {
      const props = page.properties;
      const title = props.Title?.title?.[0]?.plain_text || 'No title';
      const processed = props.Processed?.checkbox || false;
      const source = props.Source?.rich_text?.[0]?.plain_text || 'No source';
      const date = props['Publication Date']?.date?.start || 'No date';
      
      console.log(`${index + 1}. [${processed ? '✅' : '⬜'}] ${title.substring(0, 50)}...`);
      console.log(`   Source: ${source}, Date: ${date}`);
      console.log(`   Processed: ${processed ? 'YES' : 'NO'}\n`);
    });
    
    const processedCount = response.results.filter(p => p.properties.Processed?.checkbox).length;
    const unprocessedCount = response.results.length - processedCount;
    
    console.log('Summary:');
    console.log(`- Total Published: ${response.results.length}`);
    console.log(`- Processed (✅): ${processedCount}`);
    console.log(`- Not Processed (⬜): ${unprocessedCount}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testQuery();