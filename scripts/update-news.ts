#!/usr/bin/env ts-node
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import Handlebars from 'handlebars';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Template for news markdown files
const TEMPLATE_PATH = path.join(__dirname, 'templates/news-template.md');
const NEWS_DIR = path.join(process.cwd(), 'content/news');

// Interface for news items
interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedDate: string;
  featured: boolean;
  summary: string;
  content: string;
}

// Function to generate a news article using OpenAI
async function generateNewsArticle(topic: string): Promise<NewsItem> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a tech news writer. Generate a news article based on the given topic. 
        The article should be informative and well-structured.`
      },
      {
        role: "user",
        content: `Write a news article about: ${topic}`
      }
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content || '';
  
  // Generate a summary
  const summaryResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that summarizes articles."
      },
      {
        role: "user",
        content: `Please summarize the following article in 1-2 sentences:\n\n${content}`
      }
    ],
    temperature: 0.3,
  });

  const summary = summaryResponse.choices[0]?.message?.content || '';

  return {
    title: topic,
    source: "AI-Generated Content",
    url: `#${topic.toLowerCase().replace(/\s+/g, '-')}`,
    publishedDate: new Date().toISOString(),
    featured: false,
    summary,
    content
  };
}

// Function to save a news item to a markdown file
async function saveNewsItem(item: NewsItem): Promise<string> {
  // Create a slug from the title
  const slug = item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const filePath = path.join(NEWS_DIR, `${slug}.md`);
  
  // Read the template
  const templateContent = await fs.readFile(TEMPLATE_PATH, 'utf-8');
  const template = Handlebars.compile(templateContent);
  
  // Render the template with the news item data
  const markdown = template({
    ...item,
    publishedDate: new Date(item.publishedDate).toISOString()
  });
  
  // Write the file
  await fs.writeFile(filePath, markdown, 'utf-8');
  return filePath;
}

// Function to check if a news item already exists
async function newsItemExists(title: string): Promise<boolean> {
  try {
    const files = await fs.readdir(NEWS_DIR);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    return files.some(file => file.startsWith(slug));
  } catch (error) {
    console.error('Error checking for existing news items:', error);
    return false;
  }
}

// Function to process a URL and generate a news article
async function processUrl(url: string) {
  console.log(`Processing URL: ${url}`);
  
  try {
    // Check if the article already exists
    const existingItem = await findNewsItemByUrl(url);
    if (existingItem) {
      console.log(`Article with URL "${url}" already exists: ${existingItem.title}`);
      return;
    }
    
    // Generate a news article based on the URL
    console.log(`Generating article from URL: ${url}`);
    const newsItem = await generateNewsArticleFromUrl(url);
    
    // Save the article
    const savedPath = await saveNewsItem(newsItem);
    console.log(`✅ Article saved to: ${savedPath}`);
    
  } catch (error) {
    console.error(`❌ Error processing URL ${url}:`, error);
  }
}

// Function to generate a news article from a URL
async function generateNewsArticleFromUrl(url: string): Promise<NewsItem> {
  // In a real implementation, you would fetch the URL content here
  // For now, we'll use the URL as the topic
  const topic = `Article from ${new URL(url).hostname}`;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a tech news writer. Create a summary of the content at this URL: ${url}. 
        The summary should be informative and well-structured.`
      },
      {
        role: "user",
        content: `Please summarize the content at this URL in a few paragraphs.`
      }
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content || 'No content generated.';
  
  // Generate a shorter summary
  const summaryResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that summarizes articles."
      },
      {
        role: "user",
        content: `Please summarize the following article in 1-2 sentences:\n\n${content}`
      }
    ],
    temperature: 0.3,
  });

  const summary = summaryResponse.choices[0]?.message?.content || 'No summary available.';

  return {
    title: topic,
    source: new URL(url).hostname.replace('www.', ''),
    url: url,
    publishedDate: new Date().toISOString(),
    featured: false,
    summary,
    content
  };
}

// Function to find a news item by URL
async function findNewsItemByUrl(url: string): Promise<NewsItem | null> {
  try {
    const files = await fs.readdir(NEWS_DIR);
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const filePath = path.join(NEWS_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(content);
      
      if (data.url === url) {
        return {
          title: data.title || '',
          source: data.source || '',
          url: data.url || '',
          publishedDate: data.publishedDate || new Date().toISOString(),
          featured: data.featured || false,
          summary: data.summary || '',
          content: content.replace(/^---[\s\S]*?---\s*/, '') // Remove frontmatter
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding news item by URL:', error);
    return null;
  }
}

// Main function
async function main() {
  // Get URLs from command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npx ts-node update-news.ts <url1> [url2 ...]');
    console.log('Example: npx ts-node update-news.ts https://example.com/article1 https://example.com/article2');
    return;
  }
  
  // Process each URL
  for (const url of args) {
    try {
      // Basic URL validation
      new URL(url);
      await processUrl(url);
    } catch (error) {
      console.error(`❌ Invalid URL: ${url}`);
    }
  }
}

// Run the script
main();
