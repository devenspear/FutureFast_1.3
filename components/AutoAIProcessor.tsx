"use client";

import { useEffect } from 'react';

export default function AutoAIProcessor() {
  useEffect(() => {
    // Auto-process incomplete Notion records on page load
    const processIncompleteRecords = async () => {
      try {
        console.log('🤖 Starting automatic AI content processing...');
        
        const response = await fetch('/api/ai-content-extraction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'process-all' })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Auto-processed news records:', result.message);
          
          // Optional: Show subtle notification to user
          if (result.data?.successful > 0) {
            console.log(`🎉 ${result.data.successful} new articles automatically processed!`);
          }
        } else {
          console.log('ℹ️ AI processing skipped - no incomplete records or error occurred');
        }
      } catch (error) {
        console.log('ℹ️ AI processing skipped:', error);
      }
    };

    // Run AI processing in background (non-blocking)
    // Small delay to ensure page loads smoothly first
    const timeoutId = setTimeout(processIncompleteRecords, 2000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // This component renders nothing - it just runs background processing
  return null;
} 