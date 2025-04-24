import React from 'react';

export default function SubscribeSection() {
  return (
    <section className="py-16 bg-black text-white text-center px-4" id="about">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-orbitron text-5xl md:text-6xl font-bold text-center mx-auto mb-8 mt-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent break-words">
          Why We Exist
        </h1>
        <p className="mb-10 text-lg md:text-xl text-purple-100 font-medium">
          We’re living in super‑exponential times, yet our brains—and calendars—aren’t wired for that velocity. <span className="text-purple-400 font-bold">FutureFaster.ai</span> exists to bridge that gap for real‑estate owners, entrepreneurs, and small‑business executives who need to make smart bets on AI, Web3, AR/VR, robotics, and other disruptive forces without a PhD in computer science or 20 spare hours a week.
        </p>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* What We Deliver */}
          <div className="bg-gray-900/70 rounded-xl p-6 shadow border border-purple-700/20">
            <h3 className="text-2xl font-bold mb-3 text-cyan-300">What We Deliver</h3>
            <ul className="list-disc ml-5 space-y-2 text-purple-100">
              <li><span className="font-semibold text-white">Layered Learning</span> – 60‑second headlines, 3‑minute briefs, and 5‑minute deep dives so you choose the depth you need.</li>
              <li><span className="font-semibold text-white">Actionable Takeaways</span> – Every piece ends with “What this means for your business” in plain English.</li>
              <li><span className="font-semibold text-white">Interactive Tools</span> – Self‑scoring “Readiness” dashboards turn curiosity into next‑step checklists.</li>
              <li><span className="font-semibold text-white">Community & Consulting</span> – When you’re ready for tactical help, our partner network stands by.</li>
            </ul>
          </div>
          {/* How We’re Different */}
          <div className="bg-gray-900/70 rounded-xl p-6 shadow border border-pink-700/20">
            <h3 className="text-2xl font-bold mb-3 text-pink-300">How We’re Different</h3>
            <ul className="list-disc ml-5 space-y-2 text-purple-100">
              <li><span className="font-semibold text-white">Executive First</span> – Written for decision‑makers, not developers.</li>
              <li><span className="font-semibold text-white">Neutral Librarian</span> – We curate all credible voices—McKinsey, CB Insights, podcasts, whitepapers—so you don’t have to.</li>
              <li><span className="font-semibold text-white">Radically Clear</span> – If a ninth‑grader can’t understand it, we rewrite it.</li>
              <li><span className="font-semibold text-white">Built for Speed</span> – Mobile‑first pages load in under 1 s; summaries read in under 3 min.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
