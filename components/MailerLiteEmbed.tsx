"use client";

import React, { useEffect } from "react";

/**
 * MailerLite embedded signup form wrapper.
 *
 * We keep the original MailerLite HTML snippet intact via `dangerouslySetInnerHTML` so that
 * their own scripts/style run as-is. In addition we dynamically load the MailerLite universal
 * script to initialise the account.  Styling wrappers match the previous FutureFast form
 * container so the look & feel is preserved.
 */

export default function MailerLiteEmbed() {
  // Load the MailerLite universal script once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Add the MailerLite Universal script snippet as shown in the MailerLite dashboard
    const addUniversalScript = () => {
      if (document.querySelector('script[src*="assets.mailerlite.com/js/universal.js"]')) {
        return; // Already loaded
      }
      
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
        .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
        n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
        (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
        ml('account', '1595754');
      `;
      document.head.appendChild(script);
    };

    addUniversalScript();

    // Inject custom CSS to override MailerLite styles with a delay to ensure form is loaded
    const applyCustomStyles = () => {
      const customStyles = document.createElement("style");
      customStyles.id = "mailerlite-dark-theme-override";
      customStyles.innerHTML = `
        /* FutureFast Dark Theme Overrides for MailerLite Form */
        #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper {
          background-color: rgba(17, 24, 39, 0.7) !important;
          border: 1px solid rgba(147, 51, 234, 0.2) !important;
          border-radius: 0.75rem !important;
        }
        
        #mlb2-27227712.ml-form-embedContainer .ml-form-embedBody,
        #mlb2-27227712.ml-form-embedContainer .ml-form-successBody {
          background-color: transparent !important;
          padding: 1.5rem !important;
        }
        
        /* Text colors - match site's white text */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent h4,
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent h4 {
          color: rgb(243, 244, 246) !important;
          font-family: var(--font-orbitron), Arial, sans-serif !important;
        }
        
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p,
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p {
          color: rgb(209, 213, 219) !important;
          font-family: var(--font-geist-sans), system-ui, sans-serif !important;
        }
        
        /* Input fields - ALL INPUTS WITH LIGHT GRAY/OFF-WHITE BACKGROUND */
        #mlb2-27227712 .ml-form-embedWrapper input[type="text"],
        #mlb2-27227712 .ml-form-embedWrapper input[type="email"],
        #mlb2-27227712 .ml-form-embedWrapper input[name="fields[phone]"] {
          background-color: rgb(248, 250, 252) !important; /* Very light gray/off-white */
          border: 1px solid rgba(147, 51, 234, 0.4) !important;
          border-radius: 0.5rem !important;
          color: rgb(31, 41, 55) !important; /* Dark text for readability */
          padding: 0.75rem 1rem !important;
          font-family: var(--font-geist-sans), system-ui, sans-serif !important;
          width: 100% !important;
          box-sizing: border-box !important;
          min-height: 2.5rem !important;
        }
        
        /* Comment textarea - LIGHT GRAY/OFF-WHITE BACKGROUND to match other fields */
        #mlb2-27227712 .ml-form-embedWrapper textarea,
        #mlb2-27227712 .ml-form-embedWrapper textarea[name="fields[note]"] {
          background-color: rgb(248, 250, 252) !important; /* Very light gray/off-white */
          border: 1px solid rgba(147, 51, 234, 0.4) !important;
          border-radius: 0.5rem !important;
          color: rgb(31, 41, 55) !important; /* Dark text for readability */
          padding: 0.75rem 1rem !important;
          font-family: var(--font-geist-sans), system-ui, sans-serif !important;
          width: 100% !important;
          box-sizing: border-box !important;
          min-height: 4rem !important;
          resize: vertical !important;
        }
        
        /* Force override any conflicting textarea styles */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow textarea,
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow textarea,
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody textarea {
          background-color: rgb(248, 250, 252) !important; /* Very light gray/off-white */
          color: rgb(31, 41, 55) !important; /* Dark text */
          border: 1px solid rgba(147, 51, 234, 0.4) !important;
        }
        
        #mlb2-27227712 .ml-form-embedWrapper input[type="text"]:focus,
        #mlb2-27227712 .ml-form-embedWrapper input[type="email"]:focus,
        #mlb2-27227712 .ml-form-embedWrapper textarea:focus {
          outline: none !important;
          box-shadow: 0 0 0 2px rgb(6, 182, 212) !important;
          border-color: rgb(6, 182, 212) !important;
        }
        
        /* Placeholder text - darker for light background */
        #mlb2-27227712 .ml-form-embedWrapper input::placeholder,
        #mlb2-27227712 .ml-form-embedWrapper textarea::placeholder {
          color: rgb(107, 114, 128) !important; /* Darker gray for light background */
        }
        
        /* Labels */
        #mlb2-27227712 .ml-form-embedWrapper .ml-block-form .ml-field-group label {
          color: rgb(196, 181, 253) !important;
          font-family: var(--font-geist-sans), system-ui, sans-serif !important;
          font-weight: 500 !important;
          margin-bottom: 0.5rem !important;
          display: block !important;
        }
        
        /* Submit button - match site's gradient buttons */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedSubmit button {
          background: linear-gradient(to right, rgb(126, 34, 206), rgb(49, 46, 129)) !important;
          color: white !important;
          border: none !important;
          border-radius: 0.5rem !important;
          padding: 0.75rem 1.5rem !important;
          font-weight: 500 !important;
          font-family: var(--font-geist-sans), system-ui, sans-serif !important;
          transition: all 0.2s ease-in-out !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          width: 100% !important;
          cursor: pointer !important;
        }
        
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedSubmit button:hover {
          background: linear-gradient(to right, rgb(107, 33, 168), rgb(67, 56, 202)) !important;
        }
        
        /* Error messages */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-formContent .ml-form-fieldRow .ml-validate-error {
          color: rgb(248, 113, 113) !important;
          background-color: rgba(127, 29, 29, 0.3) !important;
          border: 1px solid rgb(239, 68, 68) !important;
          border-radius: 0.5rem !important;
          padding: 0.5rem !important;
          margin-top: 0.25rem !important;
        }
        
        /* Success messages */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-successBody {
          background-color: rgba(20, 83, 45, 0.3) !important;
          border: 1px solid rgb(34, 197, 94) !important;
          border-radius: 0.5rem !important;
        }
        
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent h4,
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p {
          color: rgb(134, 239, 172) !important;
        }
        
        /* reCAPTCHA styling - ELIMINATE ALL SPACING */
        #mlb2-27227712 .ml-form-recaptcha {
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          clear: both !important;
          width: 100% !important;
          background-color: transparent !important;
        }
        
        #mlb2-27227712 .g-recaptcha {
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          background-color: transparent !important;
        }
        
        /* Ensure reCAPTCHA iframe is visible */
        #mlb2-27227712 .g-recaptcha iframe {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Force reCAPTCHA to be visible with higher z-index */
        #mlb2-27227712 .ml-form-recaptcha,
        #mlb2-27227712 .g-recaptcha,
        #mlb2-27227712 .g-recaptcha iframe {
          z-index: 1000 !important;
          position: relative !important;
        }
        
        /* AGGRESSIVELY REMOVE ALL SPACING - Target all possible containers */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedSubmit {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Target the field row containing reCAPTCHA */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-fieldRow:has(.ml-form-recaptcha),
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-fieldRow:has(.g-recaptcha) {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
        
        /* Target any div containing reCAPTCHA */
        #mlb2-27227712 .ml-form-embedWrapper div:has(.ml-form-recaptcha),
        #mlb2-27227712 .ml-form-embedWrapper div:has(.g-recaptcha) {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
        
        /* Target the submit button container more specifically */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedSubmit,
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedSubmit .ml-form-embedSubmitLoad {
          margin: 0 !important;
          padding: 0 !important;
          margin-top: 0.5rem !important; /* Small controlled spacing */
        }
        
        /* Remove spacing from all form rows */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-fieldRow {
          margin-bottom: 1rem !important;
        }
        
        /* But specifically target the last field row (before submit) to have no bottom margin */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-fieldRow:last-of-type {
          margin-bottom: 0 !important;
        }
        
        /* Target any wrapper around the submit section */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody > div:last-child {
          margin-top: 0.5rem !important;
          padding-top: 0 !important;
        }
        
        /* SUPER AGGRESSIVE - Override reCAPTCHA's own container spacing */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-fieldRow div[style*="margin"],
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-fieldRow div[style*="padding"] {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Target reCAPTCHA wrapper divs that might have inline styles */
        #mlb2-27227712 .ml-form-embedWrapper div[style*="margin"]:has(.g-recaptcha),
        #mlb2-27227712 .ml-form-embedWrapper div[style*="padding"]:has(.g-recaptcha) {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Override any inline styles on reCAPTCHA containers */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-fieldRow:has(.g-recaptcha) {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Force override on any div containing reCAPTCHA regardless of other styles */
        #mlb2-27227712 div:has(.g-recaptcha),
        #mlb2-27227712 div:has(.ml-form-recaptcha) {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
        
        /* Target the specific reCAPTCHA widget container */
        .g-recaptcha-response {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Override any MailerLite default spacing after reCAPTCHA loads */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow + .ml-form-embedSubmit {
          margin-top: 0.5rem !important;
        }
        
        /* NUCLEAR OPTION - Force reCAPTCHA width and eliminate ALL spacing */
        #mlb2-27227712 .g-recaptcha {
          width: 100% !important;
          max-width: 100% !important;
          transform: scale(1) !important;
          transform-origin: 0 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Force reCAPTCHA iframe to match field width */
        #mlb2-27227712 .g-recaptcha iframe {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* CONSISTENT SPACING - Make ALL form elements have the same spacing */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody > div,
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow,
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow {
          margin-bottom: 1rem !important;
        }
        
        /* Force the reCAPTCHA container to have the SAME bottom margin as other fields */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody > div:has(.g-recaptcha),
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow:has(.g-recaptcha),
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedBody .ml-form-horizontalRow:has(.g-recaptcha) {
          margin-bottom: 1rem !important;
          padding-bottom: 0 !important;
        }
        
        /* Force submit button to have the SAME spacing as other fields */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedSubmit {
          margin-top: 1rem !important;
          margin-bottom: 0 !important;
          padding: 0 !important;
        }
        
        /* FINAL OVERRIDE - Simple and direct */
        #mlb2-27227712 * {
          box-sizing: border-box !important;
        }
        
        /* Force ALL elements in the form to have controlled spacing */
        #mlb2-27227712 .ml-form-embedWrapper .ml-form-embedSubmit {
          margin: 0 !important;
          padding: 0 !important;
          margin-top: 8px !important; /* Very small gap */
        }
        
        /* Override any reCAPTCHA container with brute force */
        #mlb2-27227712 [class*="recaptcha"],
        #mlb2-27227712 [id*="recaptcha"],
        #mlb2-27227712 .g-recaptcha {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
      `;
      
      // Remove existing styles if they exist
      const existingStyles = document.getElementById("mailerlite-dark-theme-override");
      if (existingStyles) {
        document.head.removeChild(existingStyles);
      }
      
      document.head.appendChild(customStyles);
    };

    // Apply styles immediately
    applyCustomStyles();
    
    // Add console logging to debug
    console.log('MailerLite component loaded - applying custom styles');
    
    // Also apply styles after delays to ensure MailerLite form and reCAPTCHA are fully loaded
    setTimeout(() => {
      console.log('Applying styles after 1s delay');
      applyCustomStyles();
    }, 1000);
    setTimeout(() => {
      console.log('Applying styles after 3s delay');
      applyCustomStyles();
    }, 3000);
    setTimeout(() => {
      console.log('Applying styles after 5s delay');
      applyCustomStyles();
    }, 5000);

    // Add MutationObserver to watch for reCAPTCHA loading and reapply styles
    const observeRecaptchaChanges = () => {
      const formContainer = document.querySelector('#mlb2-27227712');
      if (!formContainer) return;

      const observer = new MutationObserver((mutations) => {
        let recaptchaChanged = false;
        
        mutations.forEach((mutation) => {
          // Check if reCAPTCHA elements were added or modified
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.classList?.contains('g-recaptcha') || 
                    element.classList?.contains('ml-form-recaptcha') ||
                    element.querySelector?.('.g-recaptcha') ||
                    element.querySelector?.('.ml-form-recaptcha')) {
                  recaptchaChanged = true;
                }
              }
            });
          }
          
          // Check if attributes changed on reCAPTCHA elements
          if (mutation.type === 'attributes' && mutation.target) {
            const target = mutation.target as Element;
            if (target.classList?.contains('g-recaptcha') || 
                target.classList?.contains('ml-form-recaptcha')) {
              recaptchaChanged = true;
            }
          }
        });
        
        // If reCAPTCHA changed, reapply our styles after a short delay
        if (recaptchaChanged) {
          setTimeout(applyCustomStyles, 100);
          setTimeout(applyCustomStyles, 500);
          setTimeout(applyCustomStyles, 1000);
        }
      });

      observer.observe(formContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });

      // Also observe the document body for reCAPTCHA iframe changes
      const bodyObserver = new MutationObserver((mutations) => {
        let recaptchaIframeChanged = false;
        
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.tagName === 'IFRAME' && 
                    (element.getAttribute('src')?.includes('recaptcha') || 
                     element.getAttribute('title')?.includes('reCAPTCHA'))) {
                  recaptchaIframeChanged = true;
                }
              }
            });
          }
        });
        
        if (recaptchaIframeChanged) {
          setTimeout(applyCustomStyles, 100);
          setTimeout(applyCustomStyles, 500);
        }
      });

      bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    };

    // Start observing after a short delay
    setTimeout(observeRecaptchaChanges, 500);

    // DIRECT DOM MANIPULATION - Force consistent spacing with JavaScript
    const forceConsistentSpacing = () => {
      console.log('Forcing consistent spacing with direct DOM manipulation');
      
      const formContainer = document.querySelector('#mlb2-27227712');
      if (!formContainer) return;

      // Find all field rows and the submit button
      const fieldRows = formContainer.querySelectorAll('.ml-form-fieldRow');
      const submitButton = formContainer.querySelector('.ml-form-embedSubmit');
      
      // Set consistent margin-bottom for all field rows
      fieldRows.forEach((row, index) => {
        const element = row as HTMLElement;
        element.style.marginBottom = '1rem';
        element.style.paddingBottom = '0';
        console.log(`Set spacing for field row ${index + 1}`);
      });
      
      // Set consistent margin-top for submit button
      if (submitButton) {
        const element = submitButton as HTMLElement;
        element.style.marginTop = '1rem';
        element.style.marginBottom = '0';
        element.style.padding = '0';
        console.log('Set spacing for submit button');
      }
      
      // Find and fix reCAPTCHA container specifically
      const recaptchaContainer = formContainer.querySelector('.g-recaptcha')?.parentElement;
      if (recaptchaContainer) {
        const element = recaptchaContainer as HTMLElement;
        element.style.marginBottom = '1rem';
        element.style.paddingBottom = '0';
        console.log('Set spacing for reCAPTCHA container');
      }
    };

    // Apply spacing fixes multiple times
    setTimeout(forceConsistentSpacing, 1000);
    setTimeout(forceConsistentSpacing, 2000);
    setTimeout(forceConsistentSpacing, 3000);
    setTimeout(forceConsistentSpacing, 5000);

    // Add client-side validation for email and phone number
    const addFormValidation = () => {
      const form = document.querySelector('#mlb2-27227712 form.ml-block-form');
      if (!form) return;

      // Improved email validation regex (more permissive but still valid)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      // Phone number validation regex (supports various formats)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/;

      // Create validation error display function
      const showValidationError = (input: HTMLInputElement, message: string) => {
        // Remove existing error
        const existingError = input.parentNode?.querySelector('.validation-error');
        if (existingError) {
          existingError.remove();
        }

        // Add error styling to input
        input.style.borderColor = 'rgb(239, 68, 68)';
        input.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.style.cssText = `
          color: rgb(248, 113, 113);
          background-color: rgba(127, 29, 29, 0.3);
          border: 1px solid rgb(239, 68, 68);
          border-radius: 0.5rem;
          padding: 0.5rem;
          margin-top: 0.25rem;
          font-size: 0.875rem;
          font-family: var(--font-geist-sans), system-ui, sans-serif;
        `;
        errorDiv.textContent = message;
        input.parentNode?.appendChild(errorDiv);
      };

      // Clear validation error function
      const clearValidationError = (input: HTMLInputElement) => {
        const existingError = input.parentNode?.querySelector('.validation-error');
        if (existingError) {
          existingError.remove();
        }
        // Reset input styling
        input.style.borderColor = 'rgba(147, 51, 234, 0.4)';
        input.style.boxShadow = '';
      };

      // Add real-time validation on input blur
      const emailInput = form.querySelector('input[name="fields[email]"]') as HTMLInputElement;
      const phoneInput = form.querySelector('input[name="fields[phone]"]') as HTMLInputElement;

      if (emailInput) {
        emailInput.addEventListener('blur', () => {
          const email = emailInput.value.trim();
          if (email && !emailRegex.test(email)) {
            showValidationError(emailInput, 'Please enter a valid email address');
          } else {
            clearValidationError(emailInput);
          }
        });

        emailInput.addEventListener('input', () => {
          if (emailInput.value.trim() === '') {
            clearValidationError(emailInput);
          }
        });
      }

      if (phoneInput) {
        phoneInput.addEventListener('blur', () => {
          const phone = phoneInput.value.trim();
          if (phone && !phoneRegex.test(phone)) {
            showValidationError(phoneInput, 'Please enter a valid phone number (10+ digits)');
          } else {
            clearValidationError(phoneInput);
          }
        });

        phoneInput.addEventListener('input', () => {
          if (phoneInput.value.trim() === '') {
            clearValidationError(phoneInput);
          }
        });
      }

      // Modify form to prevent opening new tab and handle submission inline
      form.removeAttribute('target'); // Remove target="_blank"
      
      // Add form submission validation and AJAX handling - PREVENT ALL NAVIGATION
      form.addEventListener('submit', async (e) => {
        // ALWAYS prevent default form submission to avoid navigation
        e.preventDefault();
        e.stopPropagation();
        
        let hasErrors = false;

        // Clear any existing reCAPTCHA errors
        const existingRecaptchaError = document.querySelector('.recaptcha-error');
        if (existingRecaptchaError) existingRecaptchaError.remove();

        // Validate email
        if (emailInput) {
          const email = emailInput.value.trim();
          if (!email) {
            showValidationError(emailInput, 'Email is required');
            hasErrors = true;
          } else if (!emailRegex.test(email)) {
            showValidationError(emailInput, 'Please enter a valid email address');
            hasErrors = true;
          }
        }

        // Validate phone (only if filled)
        if (phoneInput) {
          const phone = phoneInput.value.trim();
          if (phone && !phoneRegex.test(phone)) {
            showValidationError(phoneInput, 'Please enter a valid phone number (10+ digits)');
            hasErrors = true;
          }
        }

        // Check reCAPTCHA
        const recaptchaResponse = (window as any).grecaptcha?.getResponse();
        if (!recaptchaResponse) {
          // Show reCAPTCHA error
          const recaptchaDiv = document.querySelector('#mlb2-27227712 .g-recaptcha');
          if (recaptchaDiv) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'recaptcha-error';
            errorDiv.style.cssText = `
              color: rgb(248, 113, 113);
              background-color: rgba(127, 29, 29, 0.3);
              border: 1px solid rgb(239, 68, 68);
              border-radius: 0.5rem;
              padding: 0.5rem;
              margin-top: 0.25rem;
              font-size: 0.875rem;
              font-family: var(--font-geist-sans), system-ui, sans-serif;
            `;
            errorDiv.textContent = 'Please complete the reCAPTCHA verification';
            recaptchaDiv.parentNode?.appendChild(errorDiv);
          }
          hasErrors = true;
        }

        // If there are validation errors, scroll to first error and stop
        if (hasErrors) {
          const firstError = form.querySelector('.validation-error, .recaptcha-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return false;
        }

        // If validation passes, submit via AJAX to prevent navigation
        try {
          // Show loading state
          const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
          const originalText = submitButton?.textContent;
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
          }

          // Prepare form data
          const formData = new FormData(form);
          
          // Submit to MailerLite via fetch
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // This prevents CORS issues but we won't get response details
          });

          // Since we're using no-cors, we can't read the response
          // But if we get here without error, assume success
          
          // Show success message inline
          const formBody = document.querySelector('#mlb2-27227712 .row-form') as HTMLElement;
          const successBody = document.querySelector('#mlb2-27227712 .row-success') as HTMLElement;
          
          if (formBody && successBody) {
            formBody.style.display = 'none';
            successBody.style.display = 'block';
          } else {
            // Fallback: create our own success message
            const successDiv = document.createElement('div');
            successDiv.style.cssText = `
              background-color: rgba(20, 83, 45, 0.3);
              border: 1px solid rgb(34, 197, 94);
              border-radius: 0.5rem;
              padding: 1.5rem;
              text-align: center;
              color: rgb(134, 239, 172);
              font-family: var(--font-geist-sans), system-ui, sans-serif;
            `;
            successDiv.innerHTML = `
              <h4 style="color: rgb(134, 239, 172); margin-bottom: 0.5rem;">Thank you!</h4>
              <p style="color: rgb(134, 239, 172); margin: 0;">You have successfully joined our subscriber list. Someone will be in contact soon.</p>
            `;
            
            // Replace form with success message
            const formContainer = document.querySelector('#mlb2-27227712 .ml-form-embedBody');
            if (formContainer) {
              formContainer.innerHTML = '';
              formContainer.appendChild(successDiv);
            }
          }
          
        } catch (error) {
          console.error('Form submission error:', error);
          
          // Reset button state
          const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Subscribe';
          }
          
          // Show error message
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = `
            color: rgb(248, 113, 113);
            background-color: rgba(127, 29, 29, 0.3);
            border: 1px solid rgb(239, 68, 68);
            border-radius: 0.5rem;
            padding: 0.5rem;
            margin-top: 0.5rem;
            font-size: 0.875rem;
            font-family: var(--font-geist-sans), system-ui, sans-serif;
            text-align: center;
          `;
          errorDiv.textContent = 'There was an error submitting the form. Please try again.';
          
          const submitButtonParent = form.querySelector('.ml-form-embedSubmit');
          if (submitButtonParent) {
            submitButtonParent.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
          }
        }
        
        return false; // Always prevent default form submission
      });
    };

    // Add validation after form loads
    setTimeout(addFormValidation, 2000);
    setTimeout(addFormValidation, 4000);

    // Force reCAPTCHA to load and be visible
    const forceRecaptchaLoad = () => {
      // Check if reCAPTCHA API is loaded
      if (typeof window !== 'undefined' && (window as any).grecaptcha) {
        const recaptchaDiv = document.querySelector('#mlb2-27227712 .g-recaptcha');
        if (recaptchaDiv && !recaptchaDiv.innerHTML.trim()) {
          try {
            // Force render the reCAPTCHA
            (window as any).grecaptcha.render(recaptchaDiv, {
              'sitekey': '6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD'
            });
          } catch (error) {
            console.log('reCAPTCHA already rendered or error:', error);
          }
        }
      }
      
      // Ensure reCAPTCHA container is visible
      const recaptchaContainer = document.querySelector('#mlb2-27227712 .ml-form-recaptcha');
      if (recaptchaContainer) {
        (recaptchaContainer as HTMLElement).style.display = 'block';
        (recaptchaContainer as HTMLElement).style.visibility = 'visible';
        (recaptchaContainer as HTMLElement).style.opacity = '1';
      }
    };

    // Try to force reCAPTCHA load at multiple intervals
    setTimeout(forceRecaptchaLoad, 3000);
    setTimeout(forceRecaptchaLoad, 6000);
    setTimeout(forceRecaptchaLoad, 10000);

    return () => {
      // Cleanup
      const customStyles = document.getElementById("mailerlite-dark-theme-override");
      if (customStyles && document.head.contains(customStyles)) {
        document.head.removeChild(customStyles);
      }
    };
  }, []);

  // Raw HTML snippet from MailerLite (version with reCAPTCHA and updated fields)
  const embedHtml = `
<style type="text/css">@import url("https://assets.mlcdn.com/fonts.css?version=1749122");</style>
    <style type="text/css">
    /* LOADER */
    .ml-form-embedSubmitLoad {
      display: inline-block;
      width: 20px;
      height: 20px;
    }

    .g-recaptcha {
    transform: scale(1);
    -webkit-transform: scale(1);
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    height: ;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      border: 0;
    }

    .ml-form-embedSubmitLoad:after {
      content: " ";
      display: block;
      width: 11px;
      height: 11px;
      margin: 1px;
      border-radius: 50%;
      border: 4px solid #fff;
    border-color: #ffffff #ffffff #ffffff transparent;
    animation: ml-form-embedSubmitLoad 1.2s linear infinite;
    }
    @keyframes ml-form-embedSubmitLoad {
      0% {
      transform: rotate(0deg);
      }
      100% {
      transform: rotate(360deg);
      }
    }
      #mlb2-27227712.ml-form-embedContainer {
        box-sizing: border-box;
        display: table;
        margin: 0 auto;
        position: static;
        width: 100% !important;
      }
      #mlb2-27227712.ml-form-embedContainer h4,
      #mlb2-27227712.ml-form-embedContainer p,
      #mlb2-27227712.ml-form-embedContainer span,
      #mlb2-27227712.ml-form-embedContainer button {
        text-transform: none !important;
        letter-spacing: normal !important;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper {
        background-color: #f6f6f6;
        
        border-width: 0px;
        border-color: transparent;
        border-radius: 4px;
        border-style: solid;
        box-sizing: border-box;
        display: inline-block !important;
        margin: 0;
        padding: 0;
        position: relative;
              }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper.embedPopup,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper.embedDefault { width: 400px; }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper.embedForm { max-width: 400px; width: 100%; }
      #mlb2-27227712.ml-form-embedContainer .ml-form-align-left { text-align: left; }
      #mlb2-27227712.ml-form-embedContainer .ml-form-align-center { text-align: center; }
      #mlb2-27227712.ml-form-embedContainer .ml-form-align-default { display: table-cell !important; vertical-align: middle !important; text-align: center !important; }
      #mlb2-27227712.ml-form-embedContainer .ml-form-align-right { text-align: right; }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedHeader img {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        height: auto;
        margin: 0 auto !important;
        max-width: 100%;
        width: undefinedpx;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody {
        padding: 20px 20px 0 20px;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody.ml-form-embedBodyHorizontal {
        padding-bottom: 0;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent {
        text-align: left;
        margin: 0 0 20px 0;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent h4,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent h4 {
        color: #000000;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 30px;
        font-weight: 400;
        margin: 0 0 10px 0;
        text-align: left;
        word-break: break-word;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p {
        color: #000000;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        margin: 0 0 10px 0;
        text-align: left;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ul,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ol,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ul,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ol {
        color: #000000;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ol ol,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ol ol {
        list-style-type: lower-alpha;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent ol ol ol,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent ol ol ol {
        list-style-type: lower-roman;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p a,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p a {
        color: #000000;
        text-decoration: underline;
      }

      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-block-form .ml-field-group {
        text-align: left!important;
      }

      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-block-form .ml-field-group label {
        margin-bottom: 5px;
        color: #333333;
        font-size: 14px;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-weight: bold; font-style: normal; text-decoration: none;;
        display: inline-block;
        line-height: 20px;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p:last-child,
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p:last-child {
        margin: 0;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody form {
        margin: 0;
        width: 100%;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent,
      #mlb2-27227712.ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow {
        margin: 0 0 20px 0;
        width: 100%;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-checkboxRow {
        float: left;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent.horozintalForm {
        margin: 0;
        padding: 0 0 20px 0;
        width: 100%;
        height: auto;
        float: left;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow {
        margin: 0 0 10px 0;
        width: 100%;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow.ml-last-item {
        margin: 0;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow.ml-formfieldHorizintal {
        margin: 0;
      }
      #mlb2-27227712.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow input {
        background-color: #ffffff !important;
        color: #333333 !important;
        border-color: #cccccc;
        border-radius: 4px !important;
        border-style: solid !important;
        border-width: 1px !important;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px !important;
        height: auto;
        line-height: 21px !important;
        margin-bottom: 0;
        margin-top: 0;
        margin-left: 0;
        margin-right: 0;
        padding: 10px 10px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        max-width: 100% !important;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow input::-webkit-input-placeholder,
      #mlb2-27227712.ml-form-embedBody .ml-form-embedBody .ml-form-horizontalRow input::-webkit-input-placeholder { color: #333333; }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow input::-moz-placeholder,
      #mlb2-27227712.ml-form-embedBody .ml-form-embedBody .ml-form-horizontalRow input::-moz-placeholder { color: #333333; }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow input:-ms-input-placeholder,
      #mlb2-27227712.ml-form-embedBody .ml-form-embedBody .ml-form-horizontalRow input:-ms-input-placeholder { color: #333333; }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow input:-moz-placeholder,
      #mlb2-27227712.ml-form-embedBody .ml-form-embedBody .ml-form-horizontalRow input:-moz-placeholder { color: #333333; }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow textarea, #mlb2-27227712.ml-form-embedBody .ml-form-embedBody .ml-form-horizontalRow textarea {
        background-color: #ffffff !important;
        color: #333333 !important;
        border-color: #cccccc;
        border-radius: 4px !important;
        border-style: solid !important;
        border-width: 1px !important;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px !important;
        height: auto;
        line-height: 21px !important;
        margin-bottom: 0;
        margin-top: 0;
        padding: 10px 10px;
        width: 100%;
        box-sizing: border-box;
        overflow-y: initial;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-label::before, #mlb2-27227712.ml-form-embedBody .ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-label::before, #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-label::before, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-label::before, #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::before, #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::before, #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .label-description::before {
          border-color: #cccccc!important;
          background-color: #ffffff!important;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow input.custom-control-input[type="checkbox"]{
        box-sizing: border-box;
        padding: 0;
        position: absolute;
        z-index: -1;
        opacity: 0;
        margin-top: 5px;
        margin-left: -1.5rem;
        overflow: visible;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-label::before, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-label::before, #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::before, #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::before, #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .label-description::before {
        border-radius: 4px!important;
      }


      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow input[type=checkbox]:checked~.label-description::after, #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox input[type=checkbox]:checked~.label-description::after, #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-input:checked~.custom-control-label::after, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-input:checked~.custom-control-label::after, #mlb2-27227712.ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox input[type=checkbox]:checked~.label-description::after {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-input:checked~.custom-control-label::after, #mlb2-27227712.ml-form-fieldRow .custom-radio .custom-control-input:checked~.custom-control-label::after {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-label::before, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-label::before, #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-label::after, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-label::after, #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-label::before, #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-label::after, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-label::before, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-label::after {
           top: 2px;
           box-sizing: border-box;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::before, #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::before, #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow .label-description::before, #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow .label-description::after {
           top: 4px;
           box-sizing: border-box;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow .label-description::before, #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow .label-description::after {
        top: 0px!important;
           box-sizing: border-box!important;
      }

       #mlb2-27227712.ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::after {
            top: 0px!important;
            box-sizing: border-box!important;
            position: absolute;
            left: -1.5rem;
            display: block;
            width: 1rem;
            height: 1rem;
            content: "";
       }

      #mlb2-27227712.ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::before {
        top: 0px!important;
        box-sizing: border-box!important;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::before, #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::before, #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow .label-description::before {
          position: absolute;
          top: 4px;
          left: -1.5rem;
          display: block;
          width: 16px;
          height: 16px;
          pointer-events: none;
          content: "";
          background-color: #ffffff;
          border: #adb5bd solid 1px;
          border-radius: 50%;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::after {
          position: absolute;
          top: 0px!important;
          left: -1.5rem;
          display: block;
          width: 1rem;
          height: 1rem;
          content: "";
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow .label-description::after {
          position: absolute;
          top: 0px!important;
          left: -1.5rem;
          display: block;
          width: 1rem;
          height: 1rem;
          content: "";
      }

      #mlb2-27227712.ml-form-embedBody .custom-radio .custom-control-label::after {
          background: no-repeat 50%/50% 50%;
      }
      #mlb2-27227712.ml-form-embedBody .custom-checkbox .custom-control-label::after, #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsOptionsCheckbox .label-description::after, #mlb2-27227712.ml-form-embedBody .ml-form-embedPermissions .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description::after, #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow .label-description::after {
          background: no-repeat 50%/50% 50%;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-control, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-control {
        position: relative;
        display: block;
        min-height: 1.5rem;
        padding-left: 1.5rem;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-input, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-input, #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-input, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-input {
          position: absolute;
          z-index: -1;
          opacity: 0;
          box-sizing: border-box;
          padding: 0;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-radio .custom-control-label, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-radio .custom-control-label, #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-checkbox .custom-control-label, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-checkbox .custom-control-label {
          color: #000000;
          font-size: 12px!important;
          font-family: 'Open Sans', Arial, Helvetica, sans-serif;
          line-height: 22px;
          margin-bottom: 0;
          position: relative;
          vertical-align: top;
          font-style: normal;
          font-weight: 700;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-fieldRow .custom-select, #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow .custom-select {
        background-color: #ffffff !important;
        color: #333333 !important;
        border-color: #cccccc;
        border-radius: 4px !important;
        border-style: solid !important;
        border-width: 1px !important;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px !important;
        line-height: 20px !important;
        margin-bottom: 0;
        margin-top: 0;
        padding: 10px 28px 10px 12px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        max-width: 100% !important;
        height: auto;
        display: inline-block;
        vertical-align: middle;
        background: url('https://assets.mlcdn.com/ml/images/default/dropdown.svg') no-repeat right .75rem center/8px 10px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }


      #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow {
        height: auto;
        width: 100%;
        float: left;
      }
      .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-input-horizontal { width: 70%; float: left; }
      .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-button-horizontal { width: 30%; float: left; }
      .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-button-horizontal.labelsOn { padding-top: 25px;  }
      .ml-form-formContent.horozintalForm .ml-form-horizontalRow .horizontal-fields { box-sizing: border-box; float: left; padding-right: 10px;  }
      #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow input {
        background-color: #ffffff;
        color: #333333;
        border-color: #cccccc;
        border-radius: 4px;
        border-style: solid;
        border-width: 1px;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 0;
        margin-top: 0;
        padding: 10px 10px;
        width: 100%;
        box-sizing: border-box;
        overflow-y: initial;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow button {
        background-color: #000000 !important;
        border-color: #000000;
        border-style: solid;
        border-width: 1px;
        border-radius: 4px;
        box-shadow: none;
        color: #ffffff !important;
        cursor: pointer;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 14px !important;
        font-weight: 700;
        line-height: 20px;
        margin: 0 !important;
        padding: 10px !important;
        width: 100%;
        height: auto;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-horizontalRow button:hover {
        background-color: #333333 !important;
        border-color: #333333 !important;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow input[type="checkbox"] {
        box-sizing: border-box;
        padding: 0;
        position: absolute;
        z-index: -1;
        opacity: 0;
        margin-top: 5px;
        margin-left: -1.5rem;
        overflow: visible;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow .label-description {
        color: #000000;
        display: block;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif;
        font-size: 12px;
        text-align: left;
        margin-bottom: 0;
        position: relative;
        vertical-align: top;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow label {
        font-weight: normal;
        margin: 0;
        padding: 0;
        position: relative;
        display: block;
        min-height: 24px;
        padding-left: 24px;

      }
      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow label a {
        color: #000000;
        text-decoration: underline;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow label p {
        color: #000000 !important;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
        font-size: 12px !important;
        font-weight: normal !important;
        line-height: 18px !important;
        padding: 0 !important;
        margin: 0 5px 0 0 !important;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow label p:last-child {
        margin: 0;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-embedSubmit {
        margin: 0 0 20px 0;
        float: left;
        width: 100%;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-embedSubmit button {
        background-color: #000000 !important;
        border: none !important;
        border-radius: 4px !important;
        box-shadow: none !important;
        color: #ffffff !important;
        cursor: pointer;
        font-family: 'Open Sans', Arial, Helvetica, sans-serif !important;
        font-size: 14px !important;
        font-weight: 700 !important;
        line-height: 21px !important;
        height: auto;
        padding: 10px !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-embedSubmit button.loading {
        display: none;
      }
      #mlb2-27227712.ml-form-embedBody .ml-form-embedSubmit button:hover {
        background-color: #333333 !important;
      }
      .ml-subscribe-close {
        width: 30px;
        height: 30px;
        background: url('https://assets.mlcdn.com/ml/images/default/modal_close.png') no-repeat;
        background-size: 30px;
        cursor: pointer;
        margin-top: -10px;
        margin-right: -10px;
        position: absolute;
        top: 0;
        right: 0;
      }
      .ml-error input, .ml-error textarea, .ml-error select {
        border-color: red!important;
      }

      .ml-error .custom-checkbox-radio-list {
        border: 1px solid red !important;
        border-radius: 4px;
        padding: 10px;
      }

      .ml-error .label-description,
      .ml-error .label-description p,
      .ml-error .label-description p a,
      .ml-error label:first-child {
        color: #ff0000 !important;
      }

      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow.ml-error .label-description p,
      #mlb2-27227712.ml-form-embedBody .ml-form-checkboxRow.ml-error .label-description p:first-letter {
        color: #ff0000 !important;
      }
            @media only screen and (max-width: 400px){

        .ml-form-embedWrapper.embedDefault, .ml-form-embedWrapper.embedPopup { width: 100%!important; }
        .ml-form-formContent.horozintalForm { float: left!important; }
        .ml-form-formContent.horozintalForm .ml-form-horizontalRow { height: auto!important; width: 100%!important; float: left!important; }
        .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-input-horizontal { width: 100%!important; }
        .ml-form-formContent.horozintalForm .ml-form-horizontalRow .ml-input-horizontal > div { padding-right: 0px!important; padding-bottom: 10px; }
        .ml-form-formContent.horozintalForm .ml-button-horizontal { width: 100%!important; }
        .ml-form-formContent.horozintalForm .ml-button-horizontal.labelsOn { padding-top: 0px!important; }

      }
    </style>

    <div id="mlb2-27227712" class="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-27227712">
      <div class="ml-form-align-center ">
        <div class="ml-form-embedWrapper embedForm">

          <div class="ml-form-embedBody ml-form-embedBodyDefault row-form">

            <div class="ml-form-embedContent" style=" ">
              
                <h4>Let's connect</h4>
                
                  <p>Signup for news and special offers!</p>
                
              
            </div>

            <form class="ml-block-form" action="https://assets.mailerlite.com/jsonp/1595754/forms/157210520722605964/subscribe" data-code="" method="post">
              <div class="ml-form-formContent">
                

                  
                  <div class="ml-form-fieldRow ">
                    <div class="ml-field-group ml-field-name ml-validate-required">

                      <label>First Name</label>


                      <!-- input -->
                      <input aria-label="name" aria-required="true" type="text" class="form-control" data-inputmask="" name="fields[name]" placeholder="" autocomplete="given-name">
                      <!-- /input -->

                    </div>
                  </div><div class="ml-form-fieldRow ">
                    <div class="ml-field-group ml-field-last_name">

                      <label>Last name</label>


                      <!-- input -->
                      <input aria-label="last_name" type="text" class="form-control" data-inputmask="" name="fields[last_name]" placeholder="" autocomplete="family-name">
                      <!-- /input -->

                    </div>
                  </div><div class="ml-form-fieldRow ">
                    <div class="ml-field-group ml-field-email ml-validate-email ml-validate-required">

                      <label>Email</label>


                      <!-- input -->
                      <input aria-label="email" aria-required="true" type="email" class="form-control" data-inputmask="" name="fields[email]" placeholder="" autocomplete="email">
                      <!-- /input -->

                    </div>
                  </div><div class="ml-form-fieldRow ">
                    <div class="ml-field-group ml-field-phone">

                      <label>Phone (optional)</label>


                      <!-- input -->
                      <input aria-label="phone" type="text" class="form-control" data-inputmask="" name="fields[phone]" placeholder="" autocomplete="">
                      <!-- /input -->

                    </div>
                  </div><div class="ml-form-fieldRow ml-last-item">
                    <div class="ml-field-group ml-field-note ml-validate-required">

                      <label>Comment</label>

                      <!-- textarea -->
                      <textarea class="form-control" name="fields[note]" aria-label="note" aria-required="true" maxlength="255" placeholder=""></textarea>
                      <!-- /textarea -->

                    </div>
                  </div>
                
              </div>

<div class="ml-form-recaptcha ml-validate-required" style="float: left;">
                <style type="text/css">
  .ml-form-recaptcha {
    margin-bottom: 20px;
  }

  .ml-form-recaptcha.ml-error iframe {
    border: solid 1px #ff0000;
  }

  @media screen and (max-width: 480px) {
    .ml-form-recaptcha {
      width: 220px!important
    }
    .g-recaptcha {
      transform: scale(0.78);
      -webkit-transform: scale(0.78);
      transform-origin: 0 0;
      -webkit-transform-origin: 0 0;
    }
  }
</style>
  <script src="https://www.google.com/recaptcha/api.js"></script>
  <div class="g-recaptcha" data-sitekey="6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD"></div>
</div>

              
              <input type="hidden" name="ml-submit" value="1">

              <div class="ml-form-embedSubmit">
                
                  <button type="submit" class="primary">Subscribe</button>
                
                <button disabled="disabled" style="display: none;" type="button" class="loading">
                  <div class="ml-form-embedSubmitLoad"></div>
                  <span class="sr-only">Loading...</span>
                </button>
              </div>

              
              <input type="hidden" name="anticsrf" value="true">
            </form>
          </div>

          <div class="ml-form-successBody row-success" style="display: none">

            <div class="ml-form-successContent">
              
                <h4>Thank you!</h4>
                
                  <p>You have successfully joined our subscriber list.</p>
                
              
            </div>

          </div>
        </div>
      </div>
    </div>

  <script>
    function ml_webform_success_27227712() {
      var $ = ml_jQuery || jQuery;
      $('.ml-subscribe-form-27227712 .row-success').show();
      $('.ml-subscribe-form-27227712 .row-form').hide();
    }
      </script>
  
  
      <script src="https://groot.mailerlite.com/js/w/webforms.min.js?v176e10baa5e7ed80d35ae235be3d5024" type="text/javascript"></script>
        <script>
            fetch("https://assets.mailerlite.com/jsonp/1595754/forms/157210520722605964/takel")
        </script>
`;

  return (
    <div className="w-full bg-gray-900/70 rounded-xl p-6 shadow-lg border border-purple-700/20">
      <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
    </div>
  );
}
