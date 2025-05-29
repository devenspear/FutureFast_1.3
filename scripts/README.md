# News Management Scripts

This directory contains scripts for managing news content in the FutureFast.AI website.

## Setup

1. Install dependencies:
   ```bash
   cd scripts
   npm install
   ```

2. Set up environment variables:
   ```bash
   echo 'OPENAI_API_KEY=your_openai_api_key' > .env
   ```

## Scripts

### `update-news.ts`

Generates and saves AI-powered news articles.

**Usage:**
```bash
npm run update-news
```

### How It Works

1. The script connects to OpenAI's API to generate a news article based on a given topic.
2. It then generates a summary of the article.
3. The article and its metadata are saved as a markdown file in the `/content/news/` directory.
4. The script checks for duplicates before creating new articles.

### Templates

News articles are generated using the template in `templates/news-template.md`.

## GitHub Integration

To automatically update news content, you can set up a GitHub Actions workflow:

1. Create a new workflow file (e.g., `.github/workflows/update-news.yml`)
2. Add the workflow configuration (see below)
3. Add your OpenAI API key as a GitHub secret

Example workflow:
```yaml
name: Update News
on:
  schedule:
    - cron: '0 * * * *'  # Run every hour
  workflow_dispatch:  # Allow manual triggers

jobs:
  update-news:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: cd scripts && npm ci
      - run: cd scripts && npm run update-news
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      - name: Commit and push changes
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add content/news/
          git diff --quiet && git diff --staged --quiet || \
            (git commit -m "Automated news update [skip ci]" && git push)
```
