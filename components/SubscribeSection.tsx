import React from 'react';

export default function SubscribeSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white text-center" id="subscribe">
      <h2 className="text-3xl font-bold mb-4">Subscribe to Exponize</h2>
      <p className="mb-6 text-lg text-purple-200">One email a week. All signal. No noise.</p>
      {/* Substack embed placeholder */}
      <div className="max-w-md mx-auto">
        <iframe
          src="https://exponize.substack.com/embed"
          className="w-full h-40 rounded-lg border-0 bg-white"
          style={{ background: 'white' }}
          title="Substack Subscribe"
        ></iframe>
      </div>
    </section>
  );
}
