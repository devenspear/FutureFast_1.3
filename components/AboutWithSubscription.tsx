"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { defaultAboutFutureFastContent } from '../lib/content';

// Use the default content directly
const content = defaultAboutFutureFastContent;

export default function AboutWithSubscription() {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: ''
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileRef.current) return;
    if (typeof window === 'undefined') return;
    if ((window as any).turnstile) return; // Script already loaded

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window && (window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.render(turnstileRef.current, {
          sitekey: '0x4AAAAAABerS3z0dQ0loAUa', // Updated site key
          callback: (token: string) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => {
            setTurnstileToken('');
            setSubmitResult({ success: false, message: 'Security check failed. Please try again.' });
          },
        });
      }
    };
    script.onerror = () => {
      // Handle script loading errors, e.g., network issues or ad-blockers
      setSubmitResult({ success: false, message: 'Could not load security check. Please disable ad-blockers or check your connection.'});
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup widget and script if component unmounts
      if (turnstileRef.current) {
        turnstileRef.current.innerHTML = ''; // Clear the widget
      }
      // Potentially remove the script if it was appended with a unique ID
      // For simplicity, we are not removing it here, as it loads only once.
    };
  }, []); // Empty dependency array ensures this runs once on mount
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      setSubmitResult({ success: false, message: 'Please complete the security check.' });
      setIsSubmitting(false); // Ensure button is re-enabled
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: '', // Not collected in this form
        note: formData.company || '', // Use company field for note
        subject: 'Mailing List Signup - FutureFast.ai',
        inquiryType: 'newsletter',
        sourceWebsite: 'futurefast.ai',
        sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/about', // More dynamic sourcePage
        sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        turnstileToken: turnstileToken, // Send the token
      };

      const response = await fetch('https://crm.deven.site/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'crm_d959d98a518641ecc8555ac54e371891e0b9a48fa1ab352425d69d557a6cb2f5',
        },
        body: JSON.stringify(payload),
      });
      
      // const result = await response.json(); // Only parse if not OK or expecting specific data

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: "🎉 Welcome! We'll be in touch soon."
        });
        setFormData({ firstName: '', lastName: '', email: '', company: '' });
        // Optionally reset Turnstile if needed, though usually not required on success
        // if (window && (window as any).turnstile && turnstileRef.current) {
        //   (window as any).turnstile.reset(turnstileRef.current);
        // }
        setTurnstileToken(''); // Clear token after successful submission
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Submission failed. Please try again.' }));
        setSubmitResult({
          success: false,
          message: errorData.message || "Submission failed due to an unknown error."
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitResult({
        success: false,
        message: "There was an error connecting to our server. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gold font-orbitron bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
          {content.headline}
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* About content - Left side */}
          <div className="flex-1">
            <div className="relative">
              <div className="space-y-4 text-lg text-gray-300">
                {content.bio_paragraphs.slice(0, Math.ceil(content.bio_paragraphs.length / 2)).map((paragraph, index) => (
                  <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }}></p>
                ))}
                
                <div className="relative">
                  {/* Float image to the right in the text */}
                  <div className="float-right ml-6 mb-4 w-40 h-40 rounded-2xl shadow-lg bg-gradient-to-br from-purple-700 to-indigo-900 overflow-hidden flex items-center justify-center">
                    <button
                      onClick={() => window.open('http://deven.cloud', '_blank', 'noopener,noreferrer')}
                      className="w-full h-full cursor-pointer hover:scale-105 transition-transform duration-300"
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        willChange: 'transform',
                        WebkitTransform: 'translate3d(0, 0, 0)',
                        transform: 'translate3d(0, 0, 0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                      }}
                      aria-label="Visit Deven Spear's website"
                      type="button"
                    >
                      <Image
                        src={content.image}
                        alt="Deven Spear - Click to visit deven.cloud"
                        width={160}
                        height={160}
                        className="object-cover pointer-events-none"
                      />
                    </button>
                  </div>
                  
                  {/* Remaining paragraphs wrap around the image */}
                  {content.bio_paragraphs.slice(Math.ceil(content.bio_paragraphs.length / 2)).map((paragraph, index) => (
                    <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: paragraph }}></p>
                  ))}
                  
                  {/* Subscription text integrated without background */}
                  <p className="mb-4 text-lg text-gray-300">
                    Welcome to the Future of Faster Thinking. If you&apos;re ready to ride the wave instead of being swept away by it — You&apos;re in the right place! 👉 <strong className="text-purple-100">Join our private list</strong> for early access to disruptive ideas, tools, and strategies to stay <em>future-ready</em>. Be first to receive insights that help you outthink, outbuild, and outlast the competition.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subscription form - Right side */}
          <div className="lg:w-2/5">
            <div className="w-full bg-gray-900/70 rounded-xl p-6 shadow-lg border border-purple-700/20">
              {/* Newsletter subscription form */}
              <div className="w-full rounded-xl overflow-hidden bg-gray-800 p-8">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Join Our Mailing List</h3>
                
                {submitResult ? (
                  <div className={`p-4 mb-6 rounded-lg ${submitResult.success ? 'bg-green-900/50 text-green-100' : 'bg-red-900/50 text-red-100'}`}>
                    <p>{submitResult.message}</p>
                    {submitResult.success && (
                      <button 
                        onClick={() => setSubmitResult(null)}
                        className="mt-4 text-sm underline hover:text-white"
                      >
                        Subscribe another email
                      </button>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                          placeholder="First Name*"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                          placeholder="Last Name*"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        placeholder="Email Address*"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        placeholder="Company"
                      />
                    </div>
                    
                    {/* Turnstile Widget Placeholder */}
                    <div ref={turnstileRef} className="my-4 flex justify-center"></div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !turnstileToken}
                      className="w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 bg-gradient-to-r from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
