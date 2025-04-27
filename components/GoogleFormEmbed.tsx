"use client";

import React from 'react';

export default function GoogleFormEmbed() {
  // The form ID from your Google Form
  const formId = '1FAIpQLSfvKmVdVXcZ1H7_e29KGaBYCQwsa313Ene5vmlzgGNTmV333g';
  
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-purple-700/20">
      <iframe 
        src={`https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`}
        width="100%" 
        height="600" 
        frameBorder="0" 
        marginHeight={0} 
        marginWidth={0}
        className="bg-gray-900"
      >
        Loading…
      </iframe>
    </div>
  );
}
