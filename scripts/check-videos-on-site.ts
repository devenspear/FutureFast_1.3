/**
 * Playwright script to verify videos are visible on the website
 */

import { chromium } from 'playwright';

const SITE_URL = 'https://future-fast-1-3.vercel.app';
const MISSING_VIDEO_IDS = ['_ltuZlGdMsg', 'Inj0uHtzYsQ', 'shyRdBz2coI'];

async function checkVideosOnSite() {
  console.log('🎭 Starting Playwright browser...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`📍 Navigating to ${SITE_URL}...`);
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    console.log('✅ Page loaded\n');

    // Wait a bit for any client-side rendering
    await page.waitForTimeout(2000);

    // Take a screenshot for reference
    await page.screenshot({ path: '/tmp/homepage-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved to /tmp/homepage-screenshot.png\n');

    // Check if there's a videos section
    console.log('🔍 Looking for video elements...\n');

    // Try to find video links or elements containing YouTube video IDs
    const videoElements = await page.locator('a[href*="youtube.com"], a[href*="youtu.be"]').all();
    console.log(`Found ${videoElements.length} YouTube links on the page\n`);

    // Extract all video IDs from the page
    const foundVideoIds = new Set<string>();

    for (const element of videoElements) {
      const href = await element.getAttribute('href');
      if (href) {
        const match = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (match) {
          foundVideoIds.add(match[1]);
        }
      }
    }

    console.log(`📊 Total unique video IDs found: ${foundVideoIds.size}\n`);

    // Check if our missing videos are present
    console.log('🎯 Checking for the 3 previously missing videos:\n');

    for (const videoId of MISSING_VIDEO_IDS) {
      const found = foundVideoIds.has(videoId);
      const status = found ? '✅' : '❌';
      console.log(`${status} Video ${videoId}: ${found ? 'FOUND' : 'NOT FOUND'}`);

      if (found) {
        // Try to find the title for this video
        const linkElement = await page.locator(`a[href*="${videoId}"]`).first();
        const title = await linkElement.textContent().catch(() => 'Unable to extract title');
        console.log(`   Title: ${title?.trim() || 'N/A'}`);
      }
    }

    console.log('\n📋 Summary:');
    console.log(`   Total videos on page: ${foundVideoIds.size}`);
    console.log(`   Missing videos found: ${MISSING_VIDEO_IDS.filter(id => foundVideoIds.has(id)).length}/${MISSING_VIDEO_IDS.length}`);

    // List all video IDs found
    console.log('\n📝 All video IDs found on page:');
    const sortedIds = Array.from(foundVideoIds).sort();
    sortedIds.forEach(id => console.log(`   - ${id}`));

    // Check specific sections
    console.log('\n🔍 Checking page structure...');

    // Check for video carousel or grid
    const videoSections = await page.locator('section, div').filter({
      has: page.locator('a[href*="youtube"]')
    }).all();

    console.log(`   Found ${videoSections.length} sections containing YouTube links`);

    // Get page title
    const pageTitle = await page.title();
    console.log(`   Page title: ${pageTitle}`);

  } catch (error) {
    console.error('❌ Error during check:', error);
  } finally {
    await browser.close();
    console.log('\n✨ Browser closed');
  }
}

checkVideosOnSite()
  .then(() => {
    console.log('\n✅ Check complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Check failed:', error);
    process.exit(1);
  });
