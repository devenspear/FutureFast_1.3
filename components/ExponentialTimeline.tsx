import React from 'react';

const decades = [2025, 2030, 2040];

export default function ExponentialTimeline() {
  return (
    <section className="py-16 bg-gray-950 animate-fade-in" id="timeline">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Exponential Timeline</h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-12 min-w-[700px] px-8">
          {decades.map((decade, idx) => (
            <div
              key={decade}
              className="flex flex-col items-center animate-slide-up"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-indigo-800 rounded-full flex items-center justify-center mb-3 shadow-lg">
                {/* TODO: Add icon/illustration */}
                <span className="text-2xl font-bold text-white">🚀</span>
              </div>
              <div className="text-lg text-white font-semibold">{decade}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
