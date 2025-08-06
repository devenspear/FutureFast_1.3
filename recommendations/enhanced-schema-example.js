// Enhanced Schema.org Implementation for FutureFast

// 1. Website/Organization Schema (Expanded)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FutureFast",
  "alternateName": "FutureFast.ai",
  "url": "https://futurefast.ai",
  "logo": "https://futurefast.ai/favicon.svg",
  "description": "Executive insights on AI, Web3, robotics & exponential technology disruption. Real signals, no hype - curated for decision makers.",
  "foundingDate": "2025",
  "sameAs": [
    "https://twitter.com/yourprofile",
    "https://www.linkedin.com/in/yourprofile"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "expertise": [
    "Artificial Intelligence",
    "Web3 Technology", 
    "Robotics",
    "Future of Work",
    "Technology Disruption"
  ]
};

// 2. Knowledge Graph/FAQ Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is FutureFast?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "FutureFast provides executive-level insights on AI, Web3, robotics, and exponential technology disruption, curated specifically for decision makers."
      }
    },
    {
      "@type": "Question", 
      "name": "How does FutureFast help executives?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We track the world's most important tech stories and provide real signals without hype, helping executives navigate exponential disruption with clarity."
      }
    }
  ]
};

// 3. Course/Educational Content Schema
const learningResourceSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Disruption Weekly Newsletter",
  "description": "Weekly insights on technology disruption for executives",
  "provider": {
    "@type": "Organization",
    "name": "FutureFast"
  },
  "educationalLevel": "Executive",
  "audience": {
    "@type": "EducationalAudience",
    "audienceType": "business executives"
  }
};

// 4. WebSite Schema with Search Action
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "FutureFast",
  "url": "https://futurefast.ai",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://futurefast.ai/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// 5. Topic/Subject Area Schema
const topicSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "Exponential Technology Disruption",
  "description": "Rapid technological advancement that fundamentally changes industries and business models",
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "name": "FutureFast Technology Glossary"
  }
};