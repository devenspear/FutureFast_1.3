// Simple script to test OpenAI API key
require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

async function testOpenAIAPI() {
  console.log('Testing OpenAI API connection...');
  
  // Get API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ERROR: OPENAI_API_KEY environment variable is not set');
    console.log('Please ensure your .env.local file contains a valid OPENAI_API_KEY');
    return;
  }
  
  console.log(`✅ API key found: ${apiKey.substring(0, 10)}...`);
  
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });
    
    // Test a simple completion
    console.log('Sending test request to OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello world!" }
      ],
    });
    
    // Output the result
    console.log('\n✅ SUCCESS! OpenAI API is working correctly\n');
    console.log('Response:');
    console.log(completion.choices[0].message.content);
    console.log('\nFull API response:');
    console.log(JSON.stringify(completion, null, 2));
    
  } catch (error) {
    console.error('❌ ERROR connecting to OpenAI API:');
    console.error(error.name + ':', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\nTroubleshooting tips:');
    console.log('1. Check if your API key is valid and has not expired');
    console.log('2. Verify you have sufficient quota/credits in your OpenAI account');
    console.log('3. Check if the model "gpt-4o" is available for your account');
    console.log('4. Ensure your network can connect to the OpenAI API');
    
    // Try with a fallback model if gpt-4o fails
    console.log('\nAttempting with fallback model gpt-3.5-turbo...');
    try {
      const fallbackCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say hello world!" }
        ],
      });
      
      console.log('\n✅ SUCCESS with fallback model gpt-3.5-turbo!\n');
      console.log('Response:');
      console.log(fallbackCompletion.choices[0].message.content);
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError.message);
    }
  }
}

// Run the test
testOpenAIAPI();
