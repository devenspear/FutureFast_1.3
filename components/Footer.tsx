import React from 'react';

const links = [
  {
    href: "https://www.linkedin.com/in/devenspear/",
    label: "LinkedIn",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="inline align-middle"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2 4.01 0 4.75 2.64 4.75 6.08V24h-4v-7.09c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.85-2.72 3.76V24h-4V8z" fill="currentColor"/></svg>
    ),
  },
  {
    href: "https://x.com/DevenSpear",
    label: "X",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="inline align-middle"><path d="M17.53 2H21.5l-7.39 8.43L22.5 22h-6.79l-5.32-6.61L4 22H0l7.93-9.04L1 2h6.89l4.89 6.07L17.53 2zm-2.06 16.75h1.88l-6.06-7.53-1.89 2.18L15.47 18.75zm-7.4-13.5l5.6 6.97 1.6-1.87-5.36-6.6H8.07zm13.37 0h-1.85l-5.6 6.97 1.6 1.87 5.85-7.84zm-8.44 9.83l-6.06 7.53h1.88l6.07-7.53-1.89-2.18z" fill="currentColor"/></svg>
    ),
  },
  {
    href: "https://substack.com/@devenkspear",
    label: "Substack",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="inline align-middle"><rect width="24" height="24" rx="4" fill="currentColor"/><rect x="4" y="7" width="16" height="2" fill="#fff"/><rect x="4" y="11" width="16" height="2" fill="#fff"/><rect x="4" y="15" width="16" height="2" fill="#fff"/></svg>
    ),
  },
  {
    href: "https://www.linkedin.com/newsletters/disruption-weekly-7120892654304776192/",
    label: "Newsletter",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="inline align-middle"><rect width="24" height="24" rx="4" fill="currentColor"/><path d="M6 8h12v2H6V8zm0 4h12v2H6v-2zm0 4h8v2H6v-2z" fill="#fff"/></svg>
    ),
  },
  {
    href: "https://www.youtube.com/@deven_spear/videos",
    label: "YouTube",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="inline align-middle"><rect width="24" height="24" rx="4" fill="currentColor"/><path d="M10 16.5l6-4.5-6-4.5v9z" fill="#fff"/></svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-black py-8 text-gray-400 text-center border-t border-gray-800">
      <div className="flex justify-center space-x-6 mb-4">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>
      <div className="mb-2 text-xs text-gray-400">2025 &copy; FutureFast.AI. All Rights Reserved.</div>
      <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mb-2">
        <a href="/terms" className="hover:text-white underline">Terms & Conditions</a>
        <a href="/privacy" className="hover:text-white underline">Privacy Policy</a>
      </div>
      <div className="text-xs text-gray-400">Made by Deven Spear with AI Coding Team</div>
    </footer>
  );
}
