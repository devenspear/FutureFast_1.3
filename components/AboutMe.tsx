import React from 'react';

export default function AboutMe() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white" id="about">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4 md:px-8">
        {/* Photo block */}
        <div className="flex-shrink-0 w-40 h-40 rounded-2xl shadow-lg bg-gradient-to-br from-purple-700 to-indigo-900 overflow-hidden flex items-center justify-center">
          {/* Use DKS_Future_head as the headshot */}
          <img
            src="/DKS_Future_head.JPG"
            alt="Deven Spear"
            className="object-cover w-full h-full"
          />
        </div>
        {/* Copy block */}
        <div className="flex-1 text-left">
          <h2 className="text-3xl font-bold mb-2">Deven Spear</h2>
          <p className="mb-4 text-purple-200 text-lg">
            Deven is a six-time founder with 30+ years of experience turning disruption into scalable opportunity. With deep expertise across real estate development, emerging tech (AI, Blockchain, Web3), and wellness innovation, he builds ventures that bridge physical and digital worlds.
          </p>
          <p className="mb-4 text-gray-300">
            From smart homes to sacred geometry, from SaaS to spiritual systems, Deven sees the big picture and engineers what&apos;s next. He&apos;s the rare leader who fuses engineering precision with creative intuition—and delivers.
          </p>
          <a href="/about" className="inline-block px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-full text-white font-semibold text-sm mt-2">Full About Page</a>
        </div>
      </div>
    </section>
  );
}
