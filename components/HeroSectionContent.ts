import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface HeroContent {
  headline: string;
  subheadline: string;
}

export function getHeroContent(): HeroContent {
  const heroPath = path.join(process.cwd(), 'content/sections/hero.md');
  const { data } = matter(fs.readFileSync(heroPath, 'utf8'));
  return {
    headline: data.headline || '',
    subheadline: data.subheadline || '',
  };
}
