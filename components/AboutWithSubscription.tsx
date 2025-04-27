"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { defaultAboutFutureFastContent, AboutFutureFastContent } from '../lib/content';

// Use the default content directly in the client component
// This will be replaced with server-side data fetching in a future update
const content: AboutFutureFastContent = defaultAboutFutureFastContent;

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
      // Submit to our API endpoint
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      // Parse the response
      const result = await response.json();
      
      // Update submission state
      setSubmitResult(result);
      
      // Clear form if successful
      if (result.success) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: ''
        });
      }
    } catch {
      // Handle errors
      setSubmitResult({
        success: false,
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="py-16 bg-black text-white" id="about">
      <div className="container mx-auto px-4">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mx-auto mb-10 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
          {content.headline}
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* About content - Left side */}
          <div className="flex-1">
            <div className="relative">
              <div className="space-y-4 text-lg text-gray-300">
                {content.bio_paragraphs.slice(0, Math.ceil(content.bio_paragraphs.length / 2)).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
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
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Subscription form - Right side */}
          <div className="lg:w-2/5">
            <div className="w-full bg-gray-900/70 rounded-xl p-6 shadow-lg border border-purple-700/20">
              <p className="text-lg text-purple-100 mb-6">
                Sign up below to be added to our mailing list. You will receive updates and be invited to more content like this.
              </p>
              
              {/* Newsletter subscription form */}
              <div className="w-full rounded-xl overflow-hidden bg-gray-800 p-8">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Join Our Mailing List</h3>
                <p className="text-gray-300 mb-6 text-center">
                  Get exclusive updates, early access to resources, and invitations to special events.
                </p>
                
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
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                          First Name*
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        placeholder="Acme Inc."
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
