import { ProcessedContent } from './workflow-types';
import fs from 'fs/promises';
import path from 'path';

export class ContentGenerator {
  async generateMarkdownFiles(processedContent: ProcessedContent[]): Promise<string[]> {
    const createdFiles: string[] = [];

    for (const content of processedContent) {
      try {
        const filePath = await this.generateMarkdownFile(content);
        createdFiles.push(filePath);
      } catch (error) {
        console.error(`Failed to generate file for ${content.title}:`, error);
      }
    }

    return createdFiles;
  }

  private async generateMarkdownFile(content: ProcessedContent): Promise<string> {
    const { category, title, description, url, metadata } = content;
    
    switch (category) {
      case 'news':
        return await this.generateNewsFile(title, description, url, metadata);
      case 'catalog':
        return await this.generateCatalogFile(title, description, url, metadata);
      case 'youtube':
        return await this.updateYouTubeVideos(title, description, url, metadata);
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  private async generateNewsFile(
    title: string, 
    description: string, 
    url: string, 
    metadata: ProcessedContent['metadata']
  ): Promise<string> {
    const slug = this.generateSlug(title);
    const fileName = `${slug}.md`;
    const filePath = path.join(process.cwd(), 'content/news', fileName);

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
source: "${metadata.source || 'Unknown Source'}"
date: "${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}"
url: "${url}"
icon: "${this.getIconForCategory(metadata.tag || 'Tech Innovation')}"
featured: ${metadata.featured || false}
---

${description}
`;

    await fs.writeFile(filePath, frontmatter);
    return filePath;
  }

  private async generateCatalogFile(
    title: string, 
    description: string, 
    url: string, 
    metadata: ProcessedContent['metadata']
  ): Promise<string> {
    const slug = this.generateSlug(title);
    const fileName = `${slug}.md`;
    const filePath = path.join(process.cwd(), 'content/catalog', fileName);

    const currentDate = new Date();
    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
year: ${currentDate.getFullYear()}
month: "${currentDate.toLocaleDateString('en-US', { month: 'long' })}"
type: "${metadata.type || 'Report'}"
tag: "${metadata.tag || 'Tech Innovation'}"
image: /uploads/${slug}.jpg
url: "${url}"
---

This resource was automatically added from: ${metadata.source || 'Unknown Source'}

${description}
`;

    await fs.writeFile(filePath, frontmatter);
    return filePath;
  }

  private async updateYouTubeVideos(
    title: string, 
    description: string, 
    url: string, 
    metadata: ProcessedContent['metadata']
  ): Promise<string> {
    const videosFilePath = path.join(process.cwd(), 'content/youtube/videos.md');
    
    // Read existing videos file
    const existingContent = await fs.readFile(videosFilePath, 'utf-8');
    
    // Check if video already exists
    if (existingContent.includes(url)) {
      throw new Error('Video already exists in videos.md');
    }

    // Create new video entry
    const newVideoEntry = `
  - url: "${url}"
    title: "${title.replace(/"/g, '\\"')}"
    description: "${description.replace(/"/g, '\\"')}"
    category: "${metadata.tag || 'Tech Innovation'}"
    featured: ${metadata.featured || false}`;

    // Insert new video after the existing videos array (before the closing ---)
    const insertionPoint = existingContent.lastIndexOf('---');
    const updatedContent = 
      existingContent.slice(0, insertionPoint) + 
      newVideoEntry + '\n' +
      existingContent.slice(insertionPoint);

    await fs.writeFile(videosFilePath, updatedContent);
    return videosFilePath;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .slice(0, 50);
  }

  private getIconForCategory(category: string): string {
    const iconMap: Record<string, string> = {
      'AI': '🤖',
      'Web3': '🌐',
      'Robotics': '🦾',
      'Future of Work': '💼',
      'Metaverse': '🥽',
      'Tech Innovation': '💡',
      'Blockchain': '⛓️',
      'Crypto': '₿',
      'RealEstate': '🏢',
      'Culture': '🎭',
      'Workforce': '👥',
    };
    
    return iconMap[category] || '📄';
  }
} 