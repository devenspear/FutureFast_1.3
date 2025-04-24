import React from 'react';

export default function AboutMe() {
  return (
    <section className="py-16 bg-black text-white" id="about">
      <div className="flex flex-col md:flex-row items-center gap-10 px-4 md:px-8 md:flex-row-reverse">
        {/* Photo block */}
        <div className="flex-shrink-0 w-40 h-40 rounded-2xl shadow-lg bg-gradient-to-br from-purple-700 to-indigo-900 overflow-hidden flex items-center justify-center md:ml-8">
          {/* Use DKS_Future_head as the headshot */}
          <img
            src="/DKS_Future_head.JPG"
            alt="Deven Spear"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h1 className="font-orbitron text-5xl md:text-6xl font-bold text-center mb-8 mt-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent break-words w-full">About Deven</h1>
          <p className="mb-4 text-purple-200 text-lg text-center md:text-left w-full">
            Deven is a six-time founder with 30+ years of experience turning disruption into scalable opportunity. With deep expertise across real estate development, emerging tech (AI, Blockchain, Web3), and wellness innovation, he builds ventures that bridge physical and digital worlds.
          </p>
          <p className="mb-4 text-gray-300 text-center md:text-left w-full">
            From smart homes to sacred geometry, from SaaS to spiritual systems, Deven sees the big picture and engineers what&apos;s next. He&apos;s the rare leader who fuses engineering precision with creative intuition—and delivers.
          </p>
        </div>
      </div>
    </section>
  );
}
