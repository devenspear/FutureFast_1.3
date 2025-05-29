require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to handle news submission
app.post('/api/submit-news', async (req, res) => {
  const { url, notes } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Basic URL validation
    new URL(url);
    
    // Log the submission (you can replace this with your actual processing logic)
    console.log(`Processing URL: ${url}`);
    if (notes) {
      console.log(`Notes: ${notes}`);
    }
    
    // Here you would typically:
    // 1. Call your existing script with the URL
    // 2. Process the article
    // 3. Save it to your content directory
    
    // For now, we'll just simulate a successful processing
    // In a real implementation, you would call your existing script like this:
    // const { exec } = require('child_process');
    // exec(`node ${path.join(__dirname, '../update-news.js')} ${url}`, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`Error: ${error}`);
    //     return res.status(500).json({ error: 'Failed to process article' });
    //   }
    //   console.log(`stdout: ${stdout}`);
    //   console.error(`stderr: ${stderr}`);
    //   res.json({ success: true, message: 'Article processed successfully' });
    // });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would return the actual result from your script
    res.json({ 
      success: true, 
      message: 'Article submitted successfully',
      // Include any additional data from your processing
      data: {
        url,
        notes,
        processedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      error: 'Failed to process article',
      details: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Submit news articles at http://localhost:${PORT}`);
});
