"use client";

import React from "react";
import Image from "next/image";
import MailerLiteEmbed from "./MailerLiteEmbed";
import { defaultAboutFutureFastContent as content } from "../lib/content";

export default function AboutWithSubscription() {
  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 font-orbitron bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
          {content.headline}
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* About content - Left */}
          <div className="flex-1 text-lg text-gray-300 space-y-4">
            {content.bio_paragraphs.map((paragraph, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}

            {/* Floating image */}
            <div className="float-right ml-6 mb-4 w-40 h-40 rounded-2xl shadow-lg bg-gradient-to-br from-purple-700 to-indigo-900 overflow-hidden flex items-center justify-center">
              <button
                onClick={() => window.open("http://deven.cloud", "_blank", "noopener,noreferrer")}
                className="w-full h-full cursor-pointer hover:scale-105 transition-transform duration-300"
                aria-label="Visit Deven Spear's website"
                type="button"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <Image src={content.image} alt="Deven Spear" width={160} height={160} className="object-cover pointer-events-none" />
              </button>
            </div>

            {/* Subscription pitch text */}
            <p>
              Welcome to the Future of Faster Thinking. If you're ready to ride the wave instead of being swept away by it — you're in the right place! 👉 <strong className="text-purple-100">Join our private list</strong> for early access to disruptive ideas, tools, and strategies to stay <em>future-ready</em>.
            </p>
          </div>

          {/* MailerLite embed - Right */}
          <div className="lg:w-2/5">
            <MailerLiteEmbed />
          </div>
        </div>
      </div>
    </section>
  );
}
