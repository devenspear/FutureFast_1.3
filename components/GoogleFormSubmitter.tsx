"use client";

import React, { useRef, useState } from 'react';

interface GoogleFormSubmitterProps {
  formId: string;
  fieldMappings: {
    [key: string]: string; // Maps our form field names to Google Form entry IDs
  };
  formData: {
    [key: string]: string;
  };
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function GoogleFormSubmitter({
  formId,
  fieldMappings,
  formData,
  onSuccess,
  onError
}: GoogleFormSubmitterProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitForm = () => {
    setIsSubmitting(true);
    
    try {
      // Create a hidden form and submit it via an iframe to bypass CORS restrictions
      const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
      
      // Create a hidden form element
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = formUrl;
      form.target = 'hidden-iframe'; // Target the iframe
      form.style.display = 'none';
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (fieldMappings[key] && value) {
          const input = document.createElement('input');
          input.type = 'text';
          input.name = fieldMappings[key];
          input.value = value;
          form.appendChild(input);
        }
      });
      
      // Append form to body
      document.body.appendChild(form);
      
      // Submit the form
      form.submit();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(form);
        onSuccess();
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
      onError('Something went wrong. Please try again later.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <iframe 
        ref={iframeRef}
        name="hidden-iframe"
        style={{ display: 'none' }}
        title="Google Form Submission"
      />
      <button
        type="button"
        onClick={submitForm}
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 
          ${isSubmitting 
            ? 'bg-gray-700 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 shadow-lg'}`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : (
          'Subscribe'
        )}
      </button>
    </>
  );
}
