/**
 * Debug script to see what's actually on the page
 */

import { chromium } from 'playwright';

const SITE_URL = 'https://future-fast-1-3.vercel.app';

async function debugPageContent() {
  console.log('🎭 Starting Playwright browser...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`📍 Navigating to ${SITE_URL}...`);
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    console.log('✅ Page loaded\n');

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Get all links on the page
    console.log('🔗 All links on the page:');
    const links = await page.locator('a').all();
    for (const link of links.slice(0, 20)) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`   ${href} - "${text?.trim().substring(0, 50)}"`);
    }

    console.log(`\n   ... and ${links.length - 20} more links\n`);

    // Check for video-related text
    console.log('🎥 Searching for video-related content...');
    const videoTexts = ['Elon Musk', 'Jensen Huang', 'Trump', 'Technology'];
    for (const text of videoTexts) {
      const found = await page.locator(`text=${text}`).count();
      console.log(`   "${text}": found ${found} times`);
    }

    // Check if there's a videos section
    console.log('\n📺 Looking for video sections...');
    const sections = await page.locator('section').all();
    console.log(`   Found ${sections.length} sections`);

    // Get page HTML
    console.log('\n📄 Checking page structure...');
    const bodyHTML = await page.locator('body').innerHTML();

    // Check if it contains video IDs
    const videoIds = ['_ltuZlGdMsg', 'Inj0uHtzYsQ', 'shyRdBz2coI'];
    for (const id of videoIds) {
      const found = bodyHTML.includes(id);
      console.log(`   Video ID ${id}: ${found ? '✅ FOUND in HTML' : '❌ NOT in HTML'}`);
    }

    // Check for specific sections
    console.log('\n🔍 Checking for specific sections...');
    const headings = await page.locator('h1, h2, h3').all();
    console.log(`   Found ${headings.length} headings:`);
    for (const heading of headings.slice(0, 10)) {
      const text = await heading.textContent();
      console.log(`   - ${text?.trim()}`);
    }

    // Take a full page screenshot
    await page.screenshot({ path: '/tmp/full-page-debug.png', fullPage: true });
    console.log('\n📸 Full page screenshot saved to /tmp/full-page-debug.png');

  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    await browser.close();
    console.log('\n✨ Browser closed');
  }
}

debugPageContent()
  .then(() => {
    console.log('\n✅ Debug complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Debug failed:', error);
    process.exit(1);
  });
