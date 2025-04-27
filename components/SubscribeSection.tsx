import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the type for the Why We Exist content
interface WhyWeExistContent {
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

// Function to get the content from the markdown file
function getWhyWeExistContent(): WhyWeExistContent {
  try {
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'content', 'sections', 'why_we_exist.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse the markdown file
    const { data } = matter(fileContents);
    
    return data as WhyWeExistContent;
  } catch (error) {
    console.error('Error loading Why We Exist content:', error);
    
    // Return default content if there's an error
    return {
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
          description: 'We curate all credible voices—McKinsey, CB Insights, podcasts, whitepapers—so you don't have to.'
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
  }
}

export default function SubscribeSection() {
  // Get the content from the markdown file
  const content = getWhyWeExistContent();
  
  return (
    <section className="py-16 bg-black text-white text-center px-4" id="about">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mx-auto mb-8 mt-6 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent break-words">
          {content.headline}
        </h1>
        <p className="mb-10 text-lg md:text-xl text-purple-100 font-medium">
          {content.main_text.includes('FutureFaster.ai') ? (
            <>
              {content.main_text.split('FutureFaster.ai')[0]}
              <span className="text-purple-400 font-bold">FutureFaster.ai</span>
              {content.main_text.split('FutureFaster.ai')[1]}
            </>
          ) : content.main_text}
        </p>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* What We Deliver */}
          <div className="bg-gray-900/70 rounded-xl p-6 shadow border border-purple-700/20">
            <h3 className="text-2xl font-bold mb-3 text-cyan-300">What We Deliver</h3>
            <ul className="list-disc ml-5 space-y-2 text-purple-100">
              {content.what_we_deliver.map((item, index) => (
                <li key={index}>
                  <span className="font-semibold text-white">{item.title}</span> – {item.description}
                </li>
              ))}
            </ul>
          </div>
          {/* How We're Different */}
          <div className="bg-gray-900/70 rounded-xl p-6 shadow border border-pink-700/20">
            <h3 className="text-2xl font-bold mb-3 text-pink-300">How We're Different</h3>
            <ul className="list-disc ml-5 space-y-2 text-purple-100">
              {content.how_different.map((item, index) => (
                <li key={index}>
                  <span className="font-semibold text-white">{item.title}</span> – {item.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
