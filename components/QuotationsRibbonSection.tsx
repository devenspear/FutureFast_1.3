'use client';
import React from 'react';

const quotations = [
  '“Disruption is the new normal—adapt or fall behind.”',
  '“The best way to predict the future is to invent it.”',
  '“Exponential change rewards the bold, not the hesitant.”',
];

export default function QuotationsRibbonSection() {
  return (
    <section className="w-full bg-black py-8 overflow-hidden">
      <div className="whitespace-nowrap animate-marquee text-xl md:text-2xl font-semibold text-cyan-300 flex items-center">
        {quotations.map((quote, idx) => (
          <span key={idx} className="mx-12 inline-block">{quote}</span>
        ))}
        {/* Repeat for infinite effect */}
        {quotations.map((quote, idx) => (
          <span key={idx + quotations.length} className="mx-12 inline-block">{quote}</span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
