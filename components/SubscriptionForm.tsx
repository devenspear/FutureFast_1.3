"use client";

import React, { useState } from 'react';
import GoogleFormSubmitter from './GoogleFormSubmitter';

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
  
  // These entry IDs need to be updated with the actual field IDs from your Google Form
  // You'll need to inspect the Google Form HTML to get these values
  const fieldMappings = {
    firstName: 'entry.123456789', // Replace with actual entry ID
    lastName: 'entry.234567890',  // Replace with actual entry ID
    email: 'entry.345678901',     // Replace with actual entry ID
    company: 'entry.456789012'    // Replace with actual entry ID
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Form is valid, ready for submission
    setIsSubmitting(true);
  };

  const handleFormSuccess = () => {
    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      company: ''
    });
  };

  const handleFormError = (message: string) => {
    setSubmitStatus('error');
    setErrorMessage(message);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full bg-gray-900/70 rounded-xl p-6 shadow-lg border border-purple-700/20">
      <p className="text-lg text-purple-100 mb-6">
        Sign up below to be added to our mailing list. You will receive updates and be invited to more content like this.
      </p>
      
      {submitStatus === 'success' ? (
        <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 text-center text-green-300 mb-4">
          Thank you for subscribing! We'll be in touch soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitStatus === 'error' && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-center text-red-300 mb-4">
              {errorMessage || 'An error occurred. Please try again.'}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-purple-300 mb-1">
                First Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-purple-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                placeholder="Your first name"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-purple-300 mb-1">
                Last Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-purple-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                placeholder="Your last name"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-purple-300 mb-1">
              Email <span className="text-pink-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-purple-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-purple-300 mb-1">
              Company Name <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-purple-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="Your company"
            />
          </div>
          
          <div className="pt-2">
            {!isSubmitting ? (
              <GoogleFormSubmitter
                formId={googleFormId}
                fieldMappings={fieldMappings}
                formData={formData}
                onSuccess={handleFormSuccess}
                onError={handleFormError}
              />
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3 px-6 rounded-lg font-medium text-white bg-gray-700 cursor-not-allowed"
              >
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              </button>
            )}
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            By subscribing, you agree to receive emails from FutureFast. We respect your privacy and will never share your information.
          </p>
        </form>
      )}
    </div>
  );
}
