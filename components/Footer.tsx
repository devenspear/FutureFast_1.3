'use server';

import React from 'react';
import Link from 'next/link';
import { loadSiteSettings } from '../lib/content-loader';

const links = [
  { href: "https://www.linkedin.com/in/devenspear/", label: "LinkedIn" },
  { href: "https://twitter.com/DevenSpear", label: "Twitter" },
  { href: "https://www.instagram.com/devenspear/", label: "Instagram" },
  { href: "/admin", label: "Admin" },
];

export default async function Footer() {
  // Load site settings from Markdown
  const { siteTitle, footerText } = await loadSiteSettings();
  
  return (
    <footer className="bg-black text-white pt-12 pb-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-cyan-400 font-orbitron">{siteTitle}</h2>
            <p className="text-gray-400 mt-2">Clarity in exponential disruption</p>
          </div>
          
          <div className="flex space-x-4">
            {links.map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {footerText}</p>
        </div>
      </div>
    </footer>
  );
}
