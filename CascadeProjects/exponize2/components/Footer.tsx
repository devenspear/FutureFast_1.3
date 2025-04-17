import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black py-8 text-gray-400 text-center border-t border-gray-800">
      <div className="flex justify-center space-x-6 mb-4">
        <a href="https://x.com/DevenSpear" target="_blank" rel="noopener noreferrer" className="hover:text-white">X</a>
        <a href="https://linkedin.com/in/devenspear" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a>
        <a href="https://youtube.com/@DevenSpear" target="_blank" rel="noopener noreferrer" className="hover:text-white">YouTube</a>
        <a href="https://deven.blog" target="_blank" rel="noopener noreferrer" className="hover:text-white">deven.blog</a>
      </div>
      <div className="mb-2">© 2025 Deven Spear | All Rights Reserved</div>
      <div className="text-xs text-purple-600">Made with AI &amp; Code</div>
    </footer>
  );
}
