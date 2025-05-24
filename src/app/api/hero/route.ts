import { NextResponse } from 'next/server';
import { loadHeroContent } from '../../../../lib/content-loader';

export async function GET() {
  try {
    // Load content from Markdown file
    const heroContent = await loadHeroContent();
    
    return NextResponse.json(heroContent);
  } catch (error) {
    console.error('Error loading hero content:', error);
    
    // Return fallback content
    return NextResponse.json({
      headline: 'Future Fast',
      subheadline: 'Accelerating Tomorrow\'s Innovations Today'
    });
  }
} 