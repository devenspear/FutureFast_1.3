import React from 'react';

const cards = [
  {
    tag: "AI",
    title: "Sample Resource Title",
    meta: "2025 • Article",
    summary: "Short summary of the resource goes here. This is a placeholder for dynamic content.",
    badge: "Original"
  },
  {
    tag: "Quantum Computing",
    title: "Qubits Unleashed: The Quantum Leap",
    meta: "2025 • Deep Dive",
    summary: "Explore how quantum supremacy is reshaping cryptography, simulation, and the fabric of the digital world.",
    badge: "Insight"
  },
  {
    tag: "Synthetic Biology",
    title: "Programmable Life: DNA as Code",
    meta: "2025 • Report",
    summary: "Discover how engineered organisms are revolutionizing medicine, food, and sustainability.",
    badge: "Trend"
  },
  {
    tag: "Spatial Computing",
    title: "The Metaverse Gets Physical",
    meta: "2025 • Feature",
    summary: "Spatial computing merges AR, VR, and IoT to create immersive, persistent digital-physical realities.",
    badge: "Hot"
  },
  {
    tag: "Neurotech",
    title: "Brain-Computer Interfaces: Mind Over Machine",
    meta: "2025 • Explainer",
    summary: "Interfaces that read and write brain signals are unlocking new frontiers in cognition and communication.",
    badge: "Breakthrough"
  },
  {
    tag: "Decentralized Energy",
    title: "Gridless: The Rise of Peer-to-Peer Power",
    meta: "2025 • Analysis",
    summary: "How blockchain and microgrids are disrupting centralized utilities and empowering energy prosumers.",
    badge: "Future"
  },
];

export default function LibraryGrid() {
  // TODO: Fetch from Contentful, add filters, animate on hover
  return (
    <section className="py-16 bg-gray-950" id="library">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Curated Library</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {cards.map((item, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-xl p-6 shadow-md hover:scale-105 hover:bg-gradient-to-br hover:from-purple-800 hover:to-indigo-900 transition-all cursor-pointer"
          >
            <div className="text-sm text-purple-300 font-semibold mb-2">{item.tag}</div>
            <div className="text-xl text-white font-bold mb-1">{item.title}</div>
            <div className="text-gray-400 text-sm mb-2">{item.meta}</div>
            <div className="text-gray-300 text-sm mb-4">{item.summary}</div>
            <div className="inline-block bg-purple-700 text-white px-3 py-1 rounded-full text-xs">{item.badge}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
