import React from 'react';

export default function DisruptionWeeklySection() {
  return (
    <section className="py-16 bg-black text-white text-center" id="disruption-weekly">
      <h1 className="font-orbitron text-5xl md:text-6xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Disruption Weekly</h1>
      <p className="mb-8 text-lg md:text-xl text-purple-100 font-medium max-w-2xl mx-auto">
        Explore the latest insights and trends on our LinkedIn newsletter. Stay ahead of disruption every week!
      </p>
      <a
        href="https://www.linkedin.com/newsletters/disruption-weekly-7120892654304776192/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 rounded-xl bg-cyan-700 hover:bg-cyan-500 text-white font-bold text-xl shadow-lg transition-all animate-fade-in"
      >
        Visit Disruption Weekly on LinkedIn
      </a>
    </section>
  );
}
