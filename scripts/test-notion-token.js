const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '../.env.local' });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function testNotion() {
  try {
    const db = await notion.databases.retrieve({ database_id: process.env.NOTION_DATABASE_ID });
    console.log('✅ Success! Database title:', db.title[0]?.plain_text || '[no title]');
  } catch (err) {
    console.error('❌ Notion API error:', err.body || err.message);
    process.exit(1);
  }
}

testNotion();
