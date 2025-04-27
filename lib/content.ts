import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define types for the content
export interface WhyWeExistContent {
  title: string;
  headline: string;
  description: string;
  main_text: string;
  what_we_deliver: Array<{
    title: string;
    description: string;
  }>;
  how_different: Array<{
    title: string;
    description: string;
  }>;
}

export interface AboutMeContent {
  title: string;
  headline: string;
  image: string;
  bio_paragraphs: string[];
}

// Default content for Why We Exist
export const defaultWhyWeExistContent: WhyWeExistContent = {
  title: 'Why We Exist',
  headline: 'Why We Exist',
  description: '',
  main_text: "We're living in super‑exponential times, yet our brains—and calendars—aren't wired for that velocity. FutureFaster.ai exists to bridge that gap for real‑estate owners, entrepreneurs, and small‑business executives who need to make smart bets on AI, Web3, AR/VR, robotics, and other disruptive forces without a PhD in computer science or 20 spare hours a week.",
  what_we_deliver: [
    {
      title: 'Layered Learning',
      description: '60‑second headlines, 3‑minute briefs, and 5‑minute deep dives so you choose the depth you need.'
    },
    {
      title: 'Actionable Takeaways',
      description: 'Every piece ends with "What this means for your business" in plain English.'
    },
    {
      title: 'Interactive Tools',
      description: 'Self‑scoring "Readiness" dashboards turn curiosity into next‑step checklists.'
    },
    {
      title: 'Community & Consulting',
      description: "When you're ready for tactical help, our partner network stands by."
    }
  ],
  how_different: [
    {
      title: 'Executive First',
      description: 'Written for decision‑makers, not developers.'
    },
    {
      title: 'Neutral Librarian',
      description: 'We curate all credible voices—McKinsey, CB Insights, podcasts, whitepapers—so you don\'t have to.'
    },
    {
      title: 'Radically Clear',
      description: "If a ninth‑grader can't understand it, we rewrite it."
    },
    {
      title: 'Built for Speed',
      description: 'Mobile‑first pages load in under 1 s; summaries read in under 3 min.'
    }
  ]
};

// Default content for About Me
export const defaultAboutMeContent: AboutMeContent = {
  title: 'About Deven',
  headline: 'About Deven',
  image: '/DKS_Future_head.JPG',
  bio_paragraphs: [
    "Deven is a six-time founder with 30+ years of experience turning disruption into scalable opportunity. With deep expertise across real estate development, emerging tech (AI, Blockchain, Web3), and wellness innovation, he builds ventures that bridge physical and digital worlds.",
    "From smart homes to sacred geometry, from SaaS to spiritual systems, Deven sees the big picture and engineers what's next. He's the rare leader who fuses engineering precision with creative intuition—and delivers."
  ]
};

// Function to get the Why We Exist content
export function getWhyWeExistContent(): WhyWeExistContent {
  try {
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'content', 'sections', 'why_we_exist.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse the markdown file
    const { data } = matter(fileContents);
    
    return data as WhyWeExistContent;
  } catch (error) {
    console.error('Error loading Why We Exist content:', error);
    return defaultWhyWeExistContent;
  }
}

// Function to get the About Me content
export function getAboutMeContent(): AboutMeContent {
  try {
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'content', 'sections', 'about_me.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse the markdown file
    const { data } = matter(fileContents);
    
    return data as AboutMeContent;
  } catch (error) {
    console.error('Error loading About Me content:', error);
    return defaultAboutMeContent;
  }
}
