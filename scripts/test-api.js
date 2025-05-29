// @ts-check
require('dotenv').config();
const { OpenAI } = require('openai');

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY is not set in .env file');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('Testing OpenAI API connection...');
    const models = await openai.models.list();
    console.log('✅ Successfully connected to OpenAI API!');
    console.log('Available models:', models.data.map(m => m.id).slice(0, 5).join(', ') + '...');
    return true;
  } catch (error) {
    console.error('❌ Error connecting to OpenAI API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    return false;
  }
}

testConnection().then(success => {
  if (!success) process.exit(1);
});
