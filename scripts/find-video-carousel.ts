/**
 * Find and verify the video carousel on the page
 */

import { chromium } from 'playwright';

const SITE_URL = 'https://future-fast-1-3.vercel.app';
const TARGET_VIDEO_ID = '_ltuZlGdMsg';
const TARGET_VIDEO_TITLE = 'Elon Musk and Jensen Huang';

async function findVideoCarousel() {
  console.log('🎭 Starting Playwright browser...\n');

  const browser = await chromium.launch({ headless: false }); // Set to false to see it in action
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`📍 Navigating to ${SITE_URL}...`);
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    console.log('✅ Page loaded\n');

    // Wait for content
    await page.waitForTimeout(3000);

    // Look for elements containing our video ID
    console.log(`🔍 Searching for video ID: ${TARGET_VIDEO_ID}\n`);

    // Try different selectors
    const selectors = [
      `[data-video-id="${TARGET_VIDEO_ID}"]`,
      `[href*="${TARGET_VIDEO_ID}"]`,
      `*:has-text("${TARGET_VIDEO_TITLE}")`,
      `img[src*="${TARGET_VIDEO_ID}"]`,
    ];

    for (const selector of selectors) {
      try {
        const count = await page.locator(selector).count();
        console.log(`   Selector "${selector}": found ${count} elements`);

        if (count > 0) {
          const elements = await page.locator(selector).all();
          for (let i = 0; i < Math.min(elements.length, 3); i++) {
            const element = elements[i];
            const text = await element.textContent().catch(() => '');
            const html = await element.innerHTML().catch(() => '');
            console.log(`      Element ${i + 1}:`);
            console.log(`         Text: ${text?.trim().substring(0, 100)}`);
            console.log(`         HTML preview: ${html.substring(0, 150)}...`);
          }
        }
      } catch (e) {
        console.log(`   Selector "${selector}": error - ${e}`);
      }
    }

    // Scroll down to find video section
    console.log('\n📜 Scrolling page to find videos section...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);

    // Look for video section specifically
    console.log('\n🎥 Looking for video carousel/grid section...');

    // Find all sections and check their content
    const sections = await page.locator('section').all();
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const html = await section.innerHTML();

      if (html.includes(TARGET_VIDEO_ID) || html.includes('Elon Musk')) {
        console.log(`\n✅ Found video section (section ${i + 1}):`);

        // Get heading in this section
        const heading = await section.locator('h2, h3').first().textContent().catch(() => 'No heading');
        console.log(`   Section heading: ${heading}`);

        // Count videos in this section
        const videoElements = await section.locator('[data-video-id], img[src*="youtube"], img[src*="ytimg"]').all();
        console.log(`   Number of video elements: ${videoElements.length}`);

        // Check if our target video is visible
        const targetVisible = await section.locator(`*:has-text("${TARGET_VIDEO_TITLE}")`).first().isVisible().catch(() => false);
        console.log(`   Target video visible: ${targetVisible ? '✅ YES' : '❌ NO'}`);

        // Take a screenshot of this section
        await section.screenshot({ path: `/tmp/video-section-${i}.png` });
        console.log(`   Screenshot saved to /tmp/video-section-${i}.png`);
      }
    }

    // Final check: scroll through the entire page and look for the video
    console.log('\n🎯 Final verification - searching entire page...');
    const elonMuskElements = await page.locator('text=Elon Musk').all();
    console.log(`   Found ${elonMuskElements.length} "Elon Musk" text elements`);

    for (let i = 0; i < elonMuskElements.length; i++) {
      const element = elonMuskElements[i];
      const isVisible = await element.isVisible();
      const boundingBox = await element.boundingBox().catch(() => null);
      console.log(`      Element ${i + 1}: ${isVisible ? 'VISIBLE' : 'HIDDEN'} at position ${boundingBox ? `x:${boundingBox.x}, y:${boundingBox.y}` : 'N/A'}`);
    }

    // Take final screenshot
    await page.screenshot({ path: '/tmp/final-verification.png', fullPage: true });
    console.log('\n📸 Final screenshot saved to /tmp/final-verification.png');

    // Keep browser open for manual inspection
    console.log('\n⏸️  Keeping browser open for 10 seconds for inspection...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✨ Browser closed');
  }
}

findVideoCarousel()
  .then(() => {
    console.log('\n✅ Check complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed:', error);
    process.exit(1);
  });
