import React from 'react';

export default function SubscribeSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white text-center" id="subscribe">
      <h2 className="text-3xl font-bold mb-4">Subscribe to Exponize</h2>
      <p className="mb-6 text-lg text-purple-200">One email a week. All signal. No noise.</p>
      {/* Transparent subscribe box with submit button */}
      <form className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg flex flex-col gap-4 border border-purple-400/20">
        <input
          type="email"
          required
          placeholder="Your email address"
          className="px-4 py-3 rounded-lg bg-white/40 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold shadow-md hover:from-purple-800 hover:to-indigo-800 transition-all"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
