import React from 'react';

const newsItems = [
  {
    title: 'AI Breakthroughs in 2025',
    summary: 'How FutureFast is shaping the future of artificial intelligence.',
    link: '#',
    image: '/news1.jpg',
  },
  {
    title: 'Web3 and Real Estate',
    summary: 'Blockchain disruption and FutureFast’s impact on property markets.',
    link: '#',
    image: '/news2.jpg',
  },
  {
    title: 'Robotics in Everyday Life',
    summary: 'The rise of automation and what it means for business leaders.',
    link: '#',
    image: '/news3.jpg',
  },
  // Add more items as needed
];

export default function InTheNewsSection() {
  return (
    <section className="py-16 bg-black text-white" id="in-the-news">
      <h1 className="font-orbitron text-5xl md:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">In The News</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {newsItems.map((item, idx) => (
          <a key={idx} href={item.link} className="bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col items-start group">
            <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded mb-4" />
            <h2 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition">{item.title}</h2>
            <p className="text-gray-300 mb-4">{item.summary}</p>
            <span className="mt-auto text-cyan-400 font-semibold">Read More →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
