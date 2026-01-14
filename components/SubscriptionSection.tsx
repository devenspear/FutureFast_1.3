"use client";

import React from 'react';
import DualSubscriptionForm from './DualSubscriptionForm';

/**
 * SubscriptionSection - Uses DualSubscriptionForm for dual submission
 *
 * Submits to both Deven CRM and MailerLite via /api/subscribe-v2.
 */
export default function SubscriptionSection() {
  return (
    <section className="py-16 bg-black text-white" id="subscribe">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mx-auto mb-8 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
            Stay Connected
          </h1>

          <p className="text-center text-lg md:text-xl text-purple-100 font-medium mb-10 max-w-2xl mx-auto">
            Join the FutureFast community to receive exclusive insights, early access to resources, and invitations to special events.
          </p>

          <DualSubscriptionForm />
        </div>
      </div>
    </section>
  );
}
