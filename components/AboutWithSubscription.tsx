"use client";

import React, { useState } from 'react';
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
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset submission state
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      // Submit data to the API
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      setIsSubmitting(false);
      setSubmitResult({
        success: result.success,
        message: result.message || (result.success 
          ? "Thank you for subscribing! We'll be in touch soon."
          : "There was an error processing your subscription. Please try again.")
      });
      
      // Clear form if successful
      if (result.success) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: ''
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      setSubmitResult({
        success: false,
        message: "There was an error connecting to our server. Please try again later."
      });
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
                    <Image
                      src={content.image}
                      alt="FutureFast"
                      width={160}
                      height={160}
                      className="object-cover"
                    />
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
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
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
