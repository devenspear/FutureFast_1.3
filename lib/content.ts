// Define types for the content
export interface ThoughtLeadersContent {
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

export interface AboutFutureFastContent {
  title: string;
  headline: string;
  image: string;
  bio_paragraphs: string[];
}

// Default content for Thought Leaders to Follow
export const defaultThoughtLeadersContent: ThoughtLeadersContent = {
  title: 'Thought Leaders to Follow',
  headline: 'Thought Leaders to Follow',
  description: '',
  main_text: "We're living in super‑exponential times, yet our brains—and calendars—aren't wired for that velocity. FutureFast.ai exists to bridge that gap for real‑estate owners, entrepreneurs, and small‑business executives who need to make smart bets on AI, Web3, AR/VR, robotics, and other disruptive forces without a PhD in computer science or 20 spare hours a week.",
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

// Default content for About FutureFast
export const defaultAboutFutureFastContent: AboutFutureFastContent = {
  title: 'About FutureFast',
  headline: 'About FutureFast',
  image: '/DevenHeadshot.JPG',
  bio_paragraphs: [
    "For thirty years, Deven Spear has seen the future differently, building ventures at the intersection of fast-moving technology and deep human need. He bridges worlds—blending systems engineering with design thinking, and strategic analysis with artistry—to spot patterns of opportunity where others see chaos. This unique perspective was shaped in the mid-1990s while experimenting with the foundations of Web 1.0 and informs his current work deciphering the third wave of disruption from AI and decentralized networks. Ultimately, his entire career, spanning six ventures from software to Web3, has been defined by a single question: How can technology serve our deepest human needs?",
    "FutureFast is the next evolution of that personal journey: A platform designed to empower leaders, creators, and changemakers to navigate—and master—the exponential speed of innovation ahead. <a href='http://deven.cloud' target='_blank' rel='noopener noreferrer' class='pulsing-text text-gold hover:underline'>To learn more about Deven Spear, click here</a>."
  ]
};
