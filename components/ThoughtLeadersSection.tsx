"use client";

import React from 'react';
import Link from 'next/link';

// Thought leaders data
const thoughtLeaders = [
  {
    name: "Brett Adcock",
    expertise: "AI, Robotics",
    socialLinks: [
      { emoji: "🐦", label: "adcock_brett", url: "https://x.com/adcock_brett" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/brettadcock/" },
      { emoji: "🎙️", label: "Moonshots Podcast", url: "https://www.brettadcock.com/podcast" }
    ]
  },
  {
    name: "Mark Andreessen",
    expertise: "Venture Capital, Web3, AI",
    socialLinks: [
      { emoji: "🐦", label: "pmarca", url: "https://x.com/pmarca" },
      { emoji: "🌐", label: "a16z.com", url: "https://a16z.com" }
    ]
  },
  {
    name: "Aaron & Austin Arnold",
    expertise: "Crypto, Blockchain",
    socialLinks: [
      { emoji: "🐦", label: "AltcoinDailyio", url: "https://x.com/AltcoinDailyio" },
      { emoji: "📺", label: "Altcoin Daily YouTube", url: "https://www.youtube.com/@AltcoinDaily" },
      { emoji: "📸", label: "altcoindaily", url: "https://www.instagram.com/altcoindaily/" },
      { emoji: "🎵", label: "altcoindaily", url: "https://www.tiktok.com/@altcoindaily" }
    ]
  },
  {
    name: "Robert Breedlove",
    expertise: "Bitcoin, Monetary Theory",
    socialLinks: [
      { emoji: "🐦", label: "Breedlove22", url: "https://x.com/Breedlove22" },
      { emoji: "📺", label: "What is Money? YouTube", url: "https://www.youtube.com/@Robert_Breedlove" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/breedlove22/" },
      { emoji: "🎙️", label: "whatismoneypodcast.com", url: "https://www.whatismoneypodcast.com" }
    ]
  },
  {
    name: "Natalie Brunell",
    expertise: "Bitcoin, Media",
    socialLinks: [
      { emoji: "🐦", label: "natbrunell", url: "https://x.com/natbrunell" },
      { emoji: "📺", label: "Coin Stories YouTube", url: "https://www.youtube.com/@NatalieBrunell" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/nataliebrunell/" },
      { emoji: "🎙️", label: "coinstoriespodcast.com", url: "https://coinstoriespodcast.com" }
    ]
  },
  {
    name: "Peter Diamandis",
    expertise: "Exponential Tech, Futurism",
    socialLinks: [
      { emoji: "🐦", label: "Peter_Diamandis", url: "https://x.com/Peter_Diamandis" },
      { emoji: "📬", label: "diamandis.substack.com", url: "https://diamandis.com/newsletter" },
      { emoji: "📺", label: "YouTube", url: "https://www.youtube.com/@Peter_Diamandis" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/peterdiamandis/" },
      { emoji: "🌐", label: "diamandis.com", url: "https://www.diamandis.com" }
    ]
  },
  {
    name: "Lex Fridman",
    expertise: "AI, Research, Podcasting",
    socialLinks: [
      { emoji: "🐦", label: "lexfridman", url: "https://x.com/lexfridman" },
      { emoji: "📺", label: "Lex Fridman YouTube", url: "https://www.youtube.com/@lexfridman" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/lexfridman/" },
      { emoji: "🎙️", label: "lexfridman.com", url: "https://lexfridman.com/podcast" }
    ]
  },
  {
    name: "Bill Gross",
    expertise: "Entrepreneurship, Innovation",
    socialLinks: [
      { emoji: "🐦", label: "Bill_Gross", url: "https://x.com/Bill_Gross" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/billgross1/" },
      { emoji: "🌐", label: "idealab.com", url: "https://www.idealab.com" }
    ]
  },
  {
    name: "Salim Ismail",
    expertise: "Exponential Organizations",
    socialLinks: [
      { emoji: "🐦", label: "salimismail", url: "https://x.com/salimismail" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/salimismail/" },
      { emoji: "🌐", label: "exponentialorgs.com", url: "https://www.exponentialorgs.com" }
    ]
  },
  {
    name: "Palmer Luckey",
    expertise: "AR/VR, Defense Tech",
    socialLinks: [
      { emoji: "🐦", label: "PalmerLuckey", url: "https://x.com/PalmerLuckey" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/palmer-luckey-44317955/" }
    ]
  },
  {
    name: "Ethan Mollick",
    expertise: "AI, Innovation, Education",
    socialLinks: [
      { emoji: "🐦", label: "emollick", url: "https://x.com/emollick" },
      { emoji: "📬", label: "oneusefulthing.substack.com", url: "https://www.oneusefulthing.org" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/emollick/" }
    ]
  },
  {
    name: "Raoul Pal",
    expertise: "Macro Investing, Crypto",
    socialLinks: [
      { emoji: "🐦", label: "RaoulGMI", url: "https://x.com/RaoulGMI" },
      { emoji: "📺", label: "Real Vision YouTube", url: "https://www.youtube.com/@RealVisionFinance" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/raoul-pal/" },
      { emoji: "🌐", label: "realvision.com", url: "https://www.realvision.com" }
    ]
  },
  {
    name: "Dhaval Patel",
    expertise: "Blockchain, Web3",
    socialLinks: [
      { emoji: "🐦", label: "DhavalPatel_", url: "https://x.com/DhavalPatel_" },
      { emoji: "📸", label: "dhaval_patel", url: "https://www.instagram.com/dhaval_patel/" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/dhaval-patel-blockchain/" }
    ]
  },
  {
    name: "Paul Roetzer",
    expertise: "Marketing, AI",
    socialLinks: [
      { emoji: "🐦", label: "paulroetzer", url: "https://x.com/paulroetzer" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/paulroetzer/" },
      { emoji: "🌐", label: "marketingaiinstitute.com", url: "https://www.marketingaiinstitute.com" }
    ]
  },
  {
    name: "Balaji S. Srinivasan",
    expertise: "Web3, Crypto, AI",
    socialLinks: [
      { emoji: "🐦", label: "balajis", url: "https://x.com/balajis" },
      { emoji: "📬", label: "thenetworkstate.substack.com", url: "https://thenetworkstate.com" },
      { emoji: "📺", label: "YouTube", url: "https://www.youtube.com/@balajisrinivasan" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/balajis/" },
      { emoji: "🌐", label: "balajis.com", url: "https://balajis.com" }
    ]
  },
  {
    name: "Cathie Wood",
    expertise: "Blockchain, AI, Investing",
    socialLinks: [
      { emoji: "🐦", label: "Cathie_D_Wood", url: "https://x.com/Cathie_D_Wood" },
      { emoji: "📺", label: "ARK Invest YouTube", url: "https://www.youtube.com/@ARKInvest" },
      { emoji: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/cathie-wood-ark/" }
    ]
  }
];

export default function ThoughtLeadersSection() {
  return (
    <section className="py-16 bg-black text-white px-4" id="thought-leaders">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mx-auto mb-8 mt-6 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent break-words">
          Thought Leaders to Follow
        </h1>
        
        <p className="mb-10 text-lg md:text-xl text-purple-100 font-medium text-center max-w-3xl mx-auto">
          Stay ahead of the curve by following these influential thinkers and innovators who are shaping the future of technology, finance, and business. Each brings unique insights into emerging trends and paradigm shifts.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-gray-900/50 rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-purple-900/40 text-left">
                <th className="py-4 px-6 font-orbitron text-cyan-300">Name</th>
                <th className="py-4 px-6 font-orbitron text-cyan-300">Area of Expertise</th>
                <th className="py-4 px-6 font-orbitron text-cyan-300">Social Media</th>
              </tr>
            </thead>
            <tbody>
              {thoughtLeaders.map((leader, index) => (
                <tr 
                  key={index} 
                  className={`border-t border-purple-800/30 hover:bg-purple-900/20 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'
                  }`}
                >
                  <td className="py-4 px-6 font-bold text-white">{leader.name}</td>
                  <td className="py-4 px-6 text-gray-300">{leader.expertise}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-3">
                      {leader.socialLinks.map((link, linkIndex) => (
                        <Link 
                          key={linkIndex} 
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-800 hover:bg-purple-800 transition-colors text-white text-sm"
                        >
                          <span className="text-xl" role="img" aria-label={link.label}>{link.emoji}</span>
                          <span className="hidden sm:inline">{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            <span className="font-bold">Emoji Key:</span> 🐦 X (Twitter) • 📬 Substack • 📺 YouTube • 💼 LinkedIn • 📸 Instagram • 🎵 TikTok • 🌐 Website • 🎙️ Podcast
          </p>
        </div>
      </div>
    </section>
  );
}
