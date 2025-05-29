# FutureFast.AI News Submission Portal

A simple web interface for submitting news articles to be processed and displayed on the FutureFast.AI website.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd scripts/web
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the `scripts/web` directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

3. **Start the Server**:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Access the Web Interface**:
   Open your browser and go to: http://localhost:3000

## How to Use

1. Enter the URL of the news article you want to add
2. (Optional) Add any notes or specific instructions
3. Click "Submit Article"
4. The system will process the article and add it to your news feed

## Deployment

For production deployment, you can:

1. **Deploy to Vercel/Netlify**:
   - Push the code to your repository
   - Connect to Vercel/Netlify
   - Set up environment variables in the deployment settings

2. **Deploy to a VPS**:
   - Clone the repository to your server
   - Set up a process manager like PM2
   - Configure a reverse proxy with Nginx/Apache
   - Set up SSL with Let's Encrypt

## Integration with Existing Script

This web interface is designed to work with the existing `update-news.ts` script. The server will call this script with the provided URL to process and add the news article.
