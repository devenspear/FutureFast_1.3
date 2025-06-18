# MailerLite Subscription Form Implementation Guide

## 1. Core Components

### A. Main Component (`MailerLiteEmbed.tsx`)
```typescript
// components/MailerLiteEmbed.tsx
"use client";
import React, { useEffect } from "react";
```

### B. Integration Points
- `SubscriptionSection.tsx` - Main subscription section
- `AboutWithSubscription.tsx` - About page with embedded form

## 2. Configuration Variables

### A. MailerLite Account
```javascript
ml('account', '1595754'); // Replace with your MailerLite account ID
```

### B. Form ID
```javascript
#mlb2-27227712 // Replace with your MailerLite form ID
```

### C. reCAPTCHA Configuration
```javascript
sitekey: '6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD' // Replace with your reCAPTCHA site key
```

## 3. Implementation Steps

### Step 1: Create MailerLite Account
1. Sign up at [MailerLite](https://www.mailerlite.com)
2. Create a new form in MailerLite dashboard
3. Copy your account ID and form ID

### Step 2: Set Up reCAPTCHA
1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site
3. Choose reCAPTCHA v2 "I'm not a robot"
4. Add your domains
5. Copy the site key

### Step 3: Create the Component
1. Create `MailerLiteEmbed.tsx`:
```typescript
"use client";
import React, { useEffect } from "react";

export default function MailerLiteEmbed() {
  useEffect(() => {
    // MailerLite Universal Script
    const addUniversalScript = () => {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
        .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
        n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
        (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
        ml('account', 'YOUR_ACCOUNT_ID');
      `;
      document.head.appendChild(script);
    };
    addUniversalScript();
  }, []);

  return (
    <div className="w-full bg-gray-900/70 rounded-xl p-6 shadow-lg border border-purple-700/20">
      <div dangerouslySetInnerHTML={{ __html: YOUR_FORM_HTML }} />
    </div>
  );
}
```

### Step 4: Add Form Validation
```typescript
const addFormValidation = () => {
  const form = document.querySelector('#YOUR_FORM_ID form.ml-block-form');
  if (!form) return;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Phone validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/;

  // Add validation logic
  // ... (see full implementation in MailerLiteEmbed.tsx)
};
```

### Step 5: Style Customization
```css
/* Add to your global CSS or component styles */
#YOUR_FORM_ID.ml-form-embedContainer .ml-form-embedWrapper {
  background-color: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 0.75rem;
}

/* Add more styles as needed */
```

## 4. Integration Points

### A. Subscription Section
```typescript
// components/SubscriptionSection.tsx
import MailerLiteEmbed from './MailerLiteEmbed';

export default function SubscriptionSection() {
  return (
    <section className="py-16 bg-black text-white" id="subscribe">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1>Stay Connected</h1>
          <MailerLiteEmbed />
        </div>
      </div>
    </section>
  );
}
```

### B. About Page Integration
```typescript
// components/AboutWithSubscription.tsx
import MailerLiteEmbed from './MailerLiteEmbed';

export default function AboutWithSubscription() {
  return (
    <section>
      <div className="lg:w-2/5">
        <MailerLiteEmbed />
      </div>
    </section>
  );
}
```

## 5. Customization Variables

Replace these values in your implementation:

1. **MailerLite Account ID**: `1595754` → Your account ID
2. **Form ID**: `mlb2-27227712` → Your form ID
3. **reCAPTCHA Site Key**: `6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD` → Your site key
4. **Form Fields**: Customize based on your needs
5. **Styling**: Adjust colors, fonts, and layout to match your site

## 6. Features

1. **Client-side Validation**
   - Email format validation
   - Phone number format validation
   - Required field validation

2. **reCAPTCHA Integration**
   - Spam protection
   - Automated verification

3. **Custom Styling**
   - Dark theme support
   - Responsive design
   - Custom fonts and colors

4. **Error Handling**
   - Form validation errors
   - Submission errors
   - Network error handling

5. **Success Handling**
   - Custom success messages
   - Form reset after submission
   - Loading states

## 7. Security Considerations

1. **reCAPTCHA Protection**
   - Prevents automated submissions
   - Protects against spam

2. **Form Validation**
   - Client-side validation
   - Server-side validation (via MailerLite)

3. **CORS Protection**
   - Proper CORS headers
   - Secure form submission

## 8. Maintenance

1. **Regular Updates**
   - Check MailerLite API changes
   - Update reCAPTCHA if needed
   - Monitor form performance

2. **Error Monitoring**
   - Console logging
   - Error tracking
   - Form submission monitoring

## 9. Testing

1. **Form Validation**
   - Test all field validations
   - Test error messages
   - Test success scenarios

2. **reCAPTCHA**
   - Test verification flow
   - Test error handling
   - Test mobile responsiveness

3. **Styling**
   - Test on different devices
   - Test dark/light themes
   - Test responsive design

## 10. Troubleshooting

### Common Issues

1. **Form Not Loading**
   - Check MailerLite account ID
   - Verify form ID
   - Check network connectivity

2. **reCAPTCHA Issues**
   - Verify site key
   - Check domain configuration
   - Clear browser cache

3. **Styling Problems**
   - Check CSS specificity
   - Verify class names
   - Inspect element for conflicts

### Debug Tips

1. **Console Logging**
   ```javascript
   console.log('MailerLite component loaded');
   console.log('Form validation status:', validationStatus);
   ```

2. **Network Monitoring**
   - Check Network tab in DevTools
   - Monitor form submissions
   - Verify API responses

3. **Style Debugging**
   - Use browser DevTools
   - Check computed styles
   - Verify CSS overrides

## 11. Best Practices

1. **Performance**
   - Lazy load the form
   - Optimize CSS
   - Minimize JavaScript

2. **Accessibility**
   - Use proper ARIA labels
   - Ensure keyboard navigation
   - Maintain color contrast

3. **User Experience**
   - Clear error messages
   - Loading indicators
   - Success feedback

## 12. Resources

1. **Official Documentation**
   - [MailerLite API Docs](https://developers.mailerlite.com/)
   - [reCAPTCHA Docs](https://developers.google.com/recaptcha)
   - [Next.js Docs](https://nextjs.org/docs)

2. **Support**
   - MailerLite Support
   - Google reCAPTCHA Support
   - Stack Overflow

3. **Tools**
   - Browser DevTools
   - Network Monitoring
   - Form Testing Tools

This implementation provides a robust, secure, and user-friendly subscription form that can be easily integrated into any website while maintaining consistent styling and functionality. 