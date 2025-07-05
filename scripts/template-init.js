#!/usr/bin/env node

/**
 * VercelWebFramework 1.0 - Template Initialization Script
 * 
 * This script helps you quickly set up a new project from the template.
 * It will guide you through the basic configuration and setup process.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  log('\n🚀 VercelWebFramework 1.0 - Template Initialization', 'cyan');
  log('==================================================\n', 'cyan');

  try {
    // Get project information
    log('📋 Project Information', 'yellow');
    log('----------------------\n', 'yellow');

    const projectName = await question('Project name: ');
    const projectDescription = await question('Project description: ');
    const authorName = await question('Author name: ');
    const authorEmail = await question('Author email: ');
    const websiteUrl = await question('Website URL (optional): ') || 'https://yoursite.com';

    // Get integration preferences
    log('\n🔧 Integration Setup', 'yellow');
    log('-------------------\n', 'yellow');

    const useYouTube = (await question('Enable YouTube integration? (y/n): ')).toLowerCase() === 'y';
    const useNotion = (await question('Enable Notion integration? (y/n): ')).toLowerCase() === 'y';
    const useMailerLite = (await question('Enable MailerLite integration? (y/n): ')).toLowerCase() === 'y';
    const useOpenAI = (await question('Enable OpenAI integration? (y/n): ')).toLowerCase() === 'y';
    const useVercelBlob = (await question('Enable Vercel Blob Storage? (y/n): ')).toLowerCase() === 'y';

    // Get admin credentials
    log('\n🔒 Admin Setup', 'yellow');
    log('-------------\n', 'yellow');

    const adminUsername = await question('Admin username: ');
    const adminPassword = await question('Admin password: ');

    // Update package.json
    log('\n📝 Updating package.json...', 'blue');
    updatePackageJson(projectName, projectDescription, authorName, authorEmail);

    // Update layout.tsx
    log('📝 Updating layout.tsx...', 'blue');
    updateLayout(projectName, projectDescription, websiteUrl, authorName);

    // Create environment file
    log('📝 Creating .env.local...', 'blue');
    createEnvFile({
      projectName,
      useYouTube,
      useNotion,
      useMailerLite,
      useOpenAI,
      useVercelBlob,
      adminUsername,
      adminPassword,
      websiteUrl
    });

    // Update content files
    log('📝 Updating content files...', 'blue');
    updateContentFiles(projectName, projectDescription, authorName);

    // Create setup instructions
    log('📝 Creating setup instructions...', 'blue');
    createSetupInstructions({
      projectName,
      useYouTube,
      useNotion,
      useMailerLite,
      useOpenAI,
      useVercelBlob
    });

    log('\n✅ Template initialization complete!', 'green');
    log('\n📋 Next Steps:', 'yellow');
    log('1. Install dependencies: npm install', 'cyan');
    log('2. Start development server: npm run dev', 'cyan');
    log('3. Configure your integrations (see SETUP.md)', 'cyan');
    log('4. Customize your content and styling', 'cyan');
    log('5. Deploy to Vercel', 'cyan');

    log('\n📚 Documentation:', 'yellow');
    log('- Template Setup Guide: docs/TEMPLATE_SETUP_GUIDE.md', 'cyan');
    log('- Integration Guides: docs/', 'cyan');
    log('- README.md for general information', 'cyan');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    rl.close();
  }
}

function updatePackageJson(name, description, author, email) {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  packageJson.name = name.toLowerCase().replace(/\s+/g, '-');
  packageJson.description = description;
  packageJson.author = `${author} <${email}>`;

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
}

function updateLayout(title, description, url, author) {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  let layoutContent = fs.readFileSync(layoutPath, 'utf8');

  // Update metadata
  layoutContent = layoutContent.replace(
    /title: ['"`][^'"`]*['"`]/,
    `title: '${title}'`
  );
  layoutContent = layoutContent.replace(
    /description: ['"`][^'"`]*['"`]/,
    `description: '${description}'`
  );
  layoutContent = layoutContent.replace(
    /url: ['"`][^'"`]*['"`]/,
    `url: '${url}'`
  );
  layoutContent = layoutContent.replace(
    /siteName: ['"`][^'"`]*['"`]/,
    `siteName: '${title}'`
  );

  fs.writeFileSync(layoutPath, layoutContent);
}

function createEnvFile(config) {
  const envContent = `# =============================================================================
# ${config.projectName.toUpperCase()} - ENVIRONMENT VARIABLES
# =============================================================================
# Generated by VercelWebFramework Template Initialization
# Update these values with your actual API keys and configuration

# =============================================================================
# CORE FRAMEWORK SETTINGS
# =============================================================================

# Base URL for your application
NEXT_PUBLIC_BASE_URL=${config.websiteUrl}

# =============================================================================
# ADMIN AUTHENTICATION
# =============================================================================

# Admin Dashboard Login Credentials
ADMIN_USERNAME=${config.adminUsername}
ADMIN_PASSWORD=${config.adminPassword}

# =============================================================================
# THIRD-PARTY INTEGRATIONS
# =============================================================================

${config.useYouTube ? `# YouTube Data API v3
# Get from: https://console.developers.google.com/apis/credentials
YOUTUBE_API_KEY=your_youtube_api_key_here

` : '# YouTube Integration: DISABLED
# To enable: Get API key from https://console.developers.google.com/apis/credentials
# YOUTUBE_API_KEY=your_youtube_api_key_here

'}

${config.useNotion ? `# Notion Integration
# Get from: https://www.notion.so/my-integrations
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here

` : '# Notion Integration: DISABLED
# To enable: Create integration at https://www.notion.so/my-integrations
# NOTION_TOKEN=your_notion_integration_token_here
# NOTION_DATABASE_ID=your_notion_database_id_here

'}

${config.useMailerLite ? `# MailerLite Integration
# Get from: https://app.mailerlite.com/integrations/api
MAILERLITE_API_KEY=your_mailerlite_api_key_here
MAILERLITE_ACCOUNT_ID=your_mailerlite_account_id_here
MAILERLITE_FORM_ID=your_mailerlite_form_id_here

` : '# MailerLite Integration: DISABLED
# To enable: Get API key from https://app.mailerlite.com/integrations/api
# MAILERLITE_API_KEY=your_mailerlite_api_key_here
# MAILERLITE_ACCOUNT_ID=your_mailerlite_account_id_here
# MAILERLITE_FORM_ID=your_mailerlite_form_id_here

'}

${config.useOpenAI ? `# OpenAI API
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

` : '# OpenAI Integration: DISABLED
# To enable: Get API key from https://platform.openai.com/api-keys
# OPENAI_API_KEY=your_openai_api_key_here

'}

${config.useVercelBlob ? `# Vercel Blob Storage
# Create in Vercel dashboard
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

` : '# Vercel Blob Storage: DISABLED
# To enable: Create blob store in Vercel dashboard
# BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

'}

# =============================================================================
# SECURITY & VERIFICATION
# =============================================================================

# Google Analytics (optional)
# NEXT_PUBLIC_GOOGLE_VERIFICATION=your_google_verification_code_here

# Cloudflare Turnstile (for form security)
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
# TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here

# reCAPTCHA (alternative to Turnstile)
# NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
# RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# =============================================================================
# DEVELOPMENT & TESTING
# =============================================================================

NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
`;

  fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent);
}

function updateContentFiles(projectName, description, author) {
  // Update hero section
  const heroPath = path.join(process.cwd(), 'content/sections/hero.md');
  const heroContent = `---
title: "Welcome to ${projectName}"
subtitle: "Your compelling subtitle here"
description: "${description}"
cta_text: "Get Started"
cta_link: "/contact"
background_image: "/hero-background.jpg"
---

# Welcome to ${projectName}

${description}

Start building something amazing today!
`;

  fs.writeFileSync(heroPath, heroContent);

  // Update about section
  const aboutPath = path.join(process.cwd(), 'content/sections/about.md');
  const aboutContent = `---
title: "About ${projectName}"
description: "Learn more about our mission and values"
bio: "We are dedicated to building amazing web experiences that help businesses grow and succeed in the digital age."
quote: "The best way to predict the future is to invent it."
quote_author: "Alan Kay"
social_links:
  twitter: "https://twitter.com/yourhandle"
  linkedin: "https://linkedin.com/in/yourprofile"
  github: "https://github.com/yourusername"
---

# About ${projectName}

${description}

## Our Mission

We believe in creating powerful, scalable web solutions that drive real business results.

## Meet the Team

**${author}** - Founder & Lead Developer

Passionate about technology and innovation, we're here to help you succeed.
`;

  fs.writeFileSync(aboutPath, aboutContent);
}

function createSetupInstructions(config) {
  const setupContent = `# ${config.projectName} - Setup Instructions

## 🚀 Quick Start

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment**
   - Copy \`.env.local\` and update with your API keys
   - See integration guides below for setup details

3. **Start Development**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🔧 Integration Setup

${config.useYouTube ? `### YouTube Integration
1. Get API key from [Google Console](https://console.developers.google.com/)
2. Enable YouTube Data API v3
3. Add \`YOUTUBE_API_KEY\` to \`.env.local\`
4. Access admin dashboard at \`/admin/youtube\`

` : ''}

${config.useNotion ? `### Notion Integration
1. Create integration at [Notion Integrations](https://www.notion.so/my-integrations)
2. Create database with required properties
3. Add \`NOTION_TOKEN\` and \`NOTION_DATABASE_ID\` to \`.env.local\`
4. Follow setup guide in \`docs/notion-integration-setup.md\`

` : ''}

${config.useMailerLite ? `### MailerLite Integration
1. Get API key from [MailerLite](https://app.mailerlite.com/integrations/api)
2. Create subscription form
3. Add MailerLite variables to \`.env.local\`
4. Follow setup guide in \`docs/mailerlite-integration-guide.md\`

` : ''}

${config.useOpenAI ? `### OpenAI Integration
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add \`OPENAI_API_KEY\` to \`.env.local\`
3. AI features will be automatically enabled

` : ''}

${config.useVercelBlob ? `### Vercel Blob Storage
1. Create blob store in Vercel dashboard
2. Add \`BLOB_READ_WRITE_TOKEN\` to \`.env.local\`
3. Configure for file uploads and storage

` : ''}

## 📚 Documentation

- [Template Setup Guide](docs/TEMPLATE_SETUP_GUIDE.md)
- [Integration Guides](docs/)
- [Admin Dashboard](docs/ADMIN-README.md)

## 🚀 Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

---

**Generated by VercelWebFramework 1.0 Template**
`;

  fs.writeFileSync(path.join(process.cwd(), 'SETUP.md'), setupContent);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main }; 