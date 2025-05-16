"use client";

import React, { useState, useRef, useEffect } from 'react';

// Define the window interface with Turnstile
declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
    };
  }
}

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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  
  // Load Turnstile script
  useEffect(() => {
    // Only load the script once
    if (!document.querySelector('script#cf-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      return () => {
        // Cleanup script on component unmount
        document.head.removeChild(script);
      };
    }
  }, []);

  // Initialize Turnstile when the script is loaded
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: 'YOUR_SITE_KEY', // Replace with your actual site key
          theme: 'dark',
          callback: function(token: string) {
            setTurnstileToken(token);
          },
        });
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      // Reset the widget when component unmounts
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    };
  }, []);

  // Reset Turnstile on successful form submission
  useEffect(() => {
    if (submitStatus === 'success' && window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
      setTurnstileToken(null);
    }
  }, [submitStatus]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setErrorMessage("Please fill in all required fields.");
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      setErrorMessage("Please complete the security check.");
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      
      // Send data to our API endpoint with explicit www subdomain
      const response = await fetch('https://www.futurefast.ai/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken // Include the Turnstile token
        })
      });
      
      console.log('API response status:', response.status);
      
      const result = await response.json();
      console.log('API response data:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }
      
      // Reset form and show success message
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: ''
      });
      setSubmitStatus('success');
    } catch (error) {
      console.error('Form submission error details:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
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
          
          {/* Turnstile Widget Container */}
          <div className="flex justify-center my-4">
            <div ref={turnstileRef} className="cf-turnstile"></div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 
                ${isSubmitting || !turnstileToken
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
