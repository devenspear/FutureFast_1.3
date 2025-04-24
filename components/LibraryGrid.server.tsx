import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import LibraryGridClient from './LibraryGrid.client';

export interface Card {
  title: string;
  description: string;
  year: string;
  month?: string;
  type: string;
  tag: string;
  image?: string;
  body?: string;
  url?: string;
  summary?: string;
}

export default function LibraryGrid() {
  const cardsDir = path.join(process.cwd(), 'content/catalog');
  let cards: Card[] = [];
  if (fs.existsSync(cardsDir)) {
    cards = fs.readdirSync(cardsDir)
      .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
      .map((file) => {
        const filePath = path.join(cardsDir, file);
        const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
        return {
          ...data,
          body: content,
        } as Card;
      });
  }
  return <LibraryGridClient cards={cards} />;
}
