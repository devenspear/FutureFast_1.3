'use server';

import React from 'react';
import Link from 'next/link';
import { loadSiteSettings } from '../lib/content-loader';

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default async function Footer() {
  // Load site settings from Markdown
  const { footerText } = await loadSiteSettings();
  
  return (
    <footer className="bg-black text-white pt-6 pb-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center space-x-6 mb-4">
            {legalLinks.map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                className="text-gray-500 hover:text-cyan-400 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-gray-500 text-sm">{footerText}</p>
          <p className="text-gray-600 text-xs mt-2">Designed by Deven Spear (the Human) and coded by AI</p>
        </div>
      </div>
    </footer>
  );
}
