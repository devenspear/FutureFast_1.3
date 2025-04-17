import React from 'react';

export default function AboutMe() {
  return (
    <section className="py-16 bg-gray-950 text-white" id="about">
      <div className="max-w-2xl mx-auto text-center">
        {/* Profile image placeholder */}
        <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center text-3xl">
          {/* Optionally replace with <img src="/profile.jpg" ... /> */}
          <span>🧑‍💻</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Deven Spear</h2>
        <p className="mb-2 text-purple-200">Technologist, polymath, founder. Exploring the edges of exponential change.</p>
        <blockquote className="italic text-gray-400 mb-4">“Live at the edge of the possible.”</blockquote>
        <a href="/about" className="inline-block px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-full text-white font-semibold text-sm">Full About Page</a>
      </div>
    </section>
  );
}
