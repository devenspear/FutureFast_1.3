import React from 'react';
import Image from 'next/image';

export default function DisruptionWeeklySection() {
  return (
    <section className="py-16 bg-black text-white text-center flex flex-col md:flex-row items-center justify-center gap-10" id="disruption-weekly">
      <div className="flex-1 flex flex-col items-center md:items-start md:pl-12">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center md:text-left mb-8 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">Disruption Weekly</h1>
        <p className="mb-8 text-lg md:text-xl text-purple-100 font-medium max-w-2xl mx-auto md:mx-0">
          Explore the latest insights and trends on our LinkedIn newsletter. Stay ahead of disruption every week!
        </p>
        <a
          href="https://www.linkedin.com/newsletters/disruption-weekly-7120892654304776192/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 rounded-xl bg-cyan-700 hover:bg-cyan-500 text-white font-bold text-xl shadow-lg transition-all animate-fade-in md:self-start"
        >
          Visit Disruption Weekly on LinkedIn
        </a>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Image
          src="/images/DisWeekly_Banner.jpg"
          alt="Disruption Weekly Banner"
          width={420}
          height={240}
          className="rounded-xl shadow-lg object-cover max-w-full h-auto border-2 border-cyan-400"
          priority
        />
      </div>
    </section>
  );
}
