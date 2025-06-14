"use client";

// NOTE: Previous attempts to implement Cloudflare Turnstile for form security were made but
// encountered integration issues. This is a simplified version without Turnstile for now.
// Future implementation may revisit this with a different approach or third-party service.

// DevCo CRM Integration: This form now submits directly to the centralized DevCo CRM system
// for unified lead management across all Deven Spear projects.

import React, { useState } from 'react';

export default function SubscriptionForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      console.log('Form validation failed: Missing required fields');
      setErrorMessage("Please fill in all required fields.");
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log('Form validation failed: Invalid email format');
      setErrorMessage("Please enter a valid email address.");
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    try {
      console.log('Form validation passed, submitting to internal API with data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company || '(not provided)'
      });
      
      // Submit to our internal subscription API route
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          company: formData.company
        })
      });
      
      console.log('Internal API response received, status:', response.status);
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('Form submission successful, resetting form');
        // Reset form and show success message
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: ''
        });
        setSubmitStatus('success');
      } else {
        console.error('Subscription API returned error:', result);
        throw new Error(result.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error details:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
      console.log('Form submission process completed');
    }
  };

  return (
    <div className="w-full bg-gray-900/70 rounded-xl p-6 shadow-lg border border-purple-700/20">
      <div className="text-lg text-purple-100 mb-6">
        <strong>Welcome to the Future of Faster Thinking.</strong> If you&apos;re ready to ride the wave instead of being swept away by it — You&apos;re in the right place! 👉 <strong>Join our private list</strong> for early access to disruptive ideas, tools, and strategies to stay <em>future-ready</em>. Be first to receive insights that help you outthink, outbuild, and outlast the competition.
      </div>
      
      {submitStatus === 'success' ? (
        <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 text-center text-green-300 mb-4">
          Thank you for subscribing! We&apos;ll be in touch soon.
        </div>
      ) : (
        <form 
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {submitStatus === 'error' && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-center text-red-300 mb-4">
              {errorMessage || `An error occurred. Please try again.`}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-purple-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                placeholder="First Name *"
                autoComplete="given-name"
                aria-label="First Name"
                inputMode="text"
              />
            </div>
            
            <div>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-purple-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                placeholder="Last Name *"
                autoComplete="family-name"
                aria-label="Last Name"
                inputMode="text"
              />
            </div>
          </div>
          
          <div>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-purple-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="Email Address *"
              autoComplete="email"
              aria-label="Email Address"
              inputMode="email"
            />
          </div>
          
          <div>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-purple-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="Company Name (Optional)"
              autoComplete="organization"
              aria-label="Company Name"
              inputMode="text"
            />
          </div>
          

          
          <div className="pt-2">
            <button
              type="submit"
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
                `Subscribe`
              )}
            </button>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            By subscribing, you agree to receive emails from FutureFast. We respect your privacy and will never share your information.
          </p>
        </form>
      )}
    </div>
  );
}
