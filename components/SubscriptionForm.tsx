"use client";

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

  // Google Form configuration
  const googleFormId = '1FAIpQLSfvKmVdVXcZ1H7_e29KGaBYCQwsa313Ene5vmlzgGNTmV333g';
  
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

    // Create the URL with query parameters
    const formUrl = new URL(`https://docs.google.com/forms/d/e/${googleFormId}/formResponse`);
    
    // Add form data as query parameters
    formUrl.searchParams.append('entry.1470198628', formData.firstName);
    formUrl.searchParams.append('entry.326011048', formData.lastName);
    formUrl.searchParams.append('entry.378636355', formData.email);
    if (formData.company) {
      formUrl.searchParams.append('entry.1151698974', formData.company);
    }
    
    // Open the URL in a new tab
    window.open(formUrl.toString(), '_blank');
    
    // Show success message and reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      company: ''
    });
    setSubmitStatus('success');
    setIsSubmitting(false);
  };

  return (
    <div className="w-full bg-gray-900/70 rounded-xl p-6 shadow-lg border border-purple-700/20">
      <p className="text-lg text-purple-100 mb-6">
        Sign up below to be added to our mailing list. You will receive updates and be invited to more content like this.
      </p>
      
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
