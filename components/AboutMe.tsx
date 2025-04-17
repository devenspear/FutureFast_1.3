import React from 'react';

export default function AboutMe() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white" id="about">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4 md:px-8">
        {/* Photo block */}
        <div className="flex-shrink-0 w-40 h-40 rounded-2xl shadow-lg bg-gradient-to-br from-purple-700 to-indigo-900 overflow-hidden flex items-center justify-center">
          {/* Use DKS_Future_head as the headshot */}
          <img
            src="/DKS_Future_head.png"
            alt="Deven Spear"
            className="object-cover w-full h-full hidden md:block"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-6xl md:text-7xl lg:text-8xl text-white md:hidden">🧑‍💻</span>
        </div>
        {/* Copy block */}
        <div className="flex-1 text-left">
          <h2 className="text-3xl font-bold mb-2">Deven Spear</h2>
          <p className="mb-4 text-purple-200 text-lg">Technologist, polymath, founder. Exploring the edges of exponential change.</p>
          <p className="mb-4 text-gray-300">I'm passionate about mapping the future, building at the intersection of technology and possibility, and helping others navigate exponential disruption. Connect with me for collaborations, insights, or just to talk about what's next.</p>
          <a href="/about" className="inline-block px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-full text-white font-semibold text-sm mt-2">Full About Page</a>
        </div>
      </div>
    </section>
  );
}
