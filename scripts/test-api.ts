import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testConnection() {
  try {
    console.log('Testing OpenAI API connection...');
    const models = await openai.models.list();
    console.log('✅ Successfully connected to OpenAI API!');
    console.log('Available models:', models.data.map(m => m.id).slice(0, 5).join(', ') + '...');
    return true;
  } catch (error: any) {
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
