"use client";

import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaGraduationCap, FaBookOpen, FaMicrosoft } from 'react-icons/fa';
import { SiGoogle, SiOpenai } from 'react-icons/si';
import { trackResourceClick } from '../lib/analytics';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  link: string;
  provider: string;
  category: 'AI' | 'Crypto' | 'Blockchain';
  icon?: string;
  isFree: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const scrollAmount = 320;

// Define keyframes for the pulse animation
const pulseAnimation = `
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3), 0 0 15px rgba(59, 130, 246, 0.2);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4);
    transform: scale(1.05);
  }
}
`;

// Learning resources data based on your markdown file
const learningResources: LearningResource[] = [
  {
    id: '1',
    title: 'Generative AI for Beginners - A Course by Microsoft',
    description: 'A 12-lesson comprehensive course covering the fundamentals of Generative AI, Large Language Models (LLMs), prompt engineering, building GenAI apps, and responsible AI. Includes video intros, written lessons, and code samples.',
    link: 'https://microsoft.github.io/generative-ai-for-beginners/',
    provider: 'Microsoft',
    category: 'AI',
    icon: 'microsoft',
    isFree: true,
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: 'Introduction to Generative AI Learning Path',
    description: 'A curated learning path by Google with introductory courses. It introduces what Generative AI is, how it&apos;s used, and its differences from traditional ML. Includes topics like LLMs, image generation, and responsible AI.',
    link: 'https://www.cloudskillsboost.google/paths/118',
    provider: 'Google Cloud',
    category: 'AI',
    icon: 'google',
    isFree: true,
    difficulty: 'Beginner'
  },
  {
    id: '3',
    title: 'OpenAI Learning Resources & Documentation',
    description: 'Comprehensive documentation, guides, and examples on OpenAI&apos;s models (like GPT), APIs, and best practices for developing with generative AI. Excellent for understanding core concepts and practical application.',
    link: 'https://platform.openai.com/docs',
    provider: 'OpenAI',
    category: 'AI',
    icon: 'openai',
    isFree: true,
    difficulty: 'Intermediate'
  },
  {
    id: '4',
    title: 'Binance Academy - Beginner&apos;s Guide & Tracks',
    description: 'Offers extensive free educational content, including a "Beginner Track," articles, and guides on blockchain, cryptocurrency, trading, security, and specific topics like Bitcoin, Ethereum, and NFTs.',
    link: 'https://academy.binance.com/en/articles?page=1&tags=beginner',
    provider: 'Binance Academy',
    category: 'Crypto',
    isFree: true,
    difficulty: 'Beginner'
  },
  {
    id: '5',
    title: 'Coinbase Learn - Crypto Basics',
    description: 'Provides a collection of easy-to-understand articles and guides on fundamental concepts like "What is Bitcoin?", "What is Ethereum?", "What is a blockchain?", and crucially, "How to keep your crypto secure."',
    link: 'https://www.coinbase.com/learn/crypto-basics',
    provider: 'Coinbase',
    category: 'Crypto',
    isFree: true,
    difficulty: 'Beginner'
  },
  {
    id: '6',
    title: 'Blockchain Basics by University at Buffalo',
    description: 'An introductory course covering the fundamental concepts of blockchain technology, its core components (cryptography, transactions, blocks), and how it works. Part of a larger "Blockchain Specialization."',
    link: 'https://www.coursera.org/learn/blockchain-basics',
    provider: 'Coursera',
    category: 'Blockchain',
    isFree: true,
    difficulty: 'Beginner'
  },
  {
    id: '7',
    title: 'Trust Wallet - Beginner&apos;s Guides & Wallet Setup',
    description: 'Offers guides specifically for beginners on how to get started with crypto and Web3. Includes clear explanations of cryptocurrency wallets (software, hardware) and step-by-step instructions for setting up and securing wallets.',
    link: 'https://trustwallet.com/blog/guides/how-to-get-started-in-crypto-and-web3',
    provider: 'Trust Wallet',
    category: 'Crypto',
    isFree: true,
    difficulty: 'Beginner'
  }
];

export default function LearningResourcesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Add the keyframes to the document
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = pulseAnimation;
      document.head.appendChild(style);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getProviderIcon = (provider: string, icon?: string) => {
    const iconClass = "text-lg md:text-xl";
    
    switch (icon) {
      case 'microsoft':
        return <FaMicrosoft className={iconClass} />;
      case 'google':
        return <SiGoogle className={iconClass} />;
      case 'openai':
        return <SiOpenai className={iconClass} />;
      default:
        return <FaBookOpen className={iconClass} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI':
        return 'from-purple-500 to-blue-500';
      case 'Crypto':
        return 'from-yellow-500 to-orange-500';
      case 'Blockchain':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-400';
      case 'Intermediate':
        return 'text-yellow-400';
      case 'Advanced':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleCardClick = (resource: LearningResource) => {
    trackResourceClick(resource.title, resource.link);
    window.open(resource.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-12 md:py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
            Learning Resources
          </h1>
          <p className="font-orbitron text-lg md:text-xl text-cyan-100 max-w-3xl mx-auto">
            If you&apos;re feeling overwhelmed, start your journey here. Most importantly, begin using, testing, and building now!
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 md:left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 touch-manipulation"
            style={{
              animation: 'glow-pulse 3s ease-in-out infinite',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              minWidth: '44px',
              minHeight: '44px',
              willChange: 'transform, box-shadow',
              WebkitTransform: 'translate3d(0, 0, 0)',
              transform: 'translate3d(0, 0, 0)'
            }}
            aria-label="Scroll left"
            type="button"
          >
            <FaChevronLeft className="text-sm md:text-base" />
          </button>
          
          <button
            onClick={scrollRight}
            className="absolute right-2 md:right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 touch-manipulation"
            style={{
              animation: 'glow-pulse 3s ease-in-out infinite 1.5s',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              minWidth: '44px',
              minHeight: '44px',
              willChange: 'transform, box-shadow',
              WebkitTransform: 'translate3d(0, 0, 0)',
              transform: 'translate3d(0, 0, 0)'
            }}
            aria-label="Scroll right"
            type="button"
          >
            <FaChevronRight className="text-sm md:text-base" />
          </button>

          {/* Resource Cards Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide px-4 md:px-12 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              WebkitTransform: 'translate3d(0, 0, 0)',
              transform: 'translate3d(0, 0, 0)',
              overscrollBehaviorX: 'contain',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
          >
            {learningResources.map((resource) => (
              <div
                key={resource.id}
                className="flex-shrink-0 w-72 md:w-80 h-[380px] md:h-[440px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 border border-gray-700 hover:border-cyan-400/50 cursor-pointer group"
                onClick={() => handleCardClick(resource)}
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
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(resource);
                  }
                }}
              >
                {/* Header Section with Icon and Category */}
                <div className={`relative h-20 md:h-24 w-full bg-gradient-to-r ${getCategoryColor(resource.category)} flex items-center justify-center`}>
                  <div className="text-white text-3xl md:text-4xl">
                    {getProviderIcon(resource.provider, resource.icon)}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-black/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                    {resource.category}
                  </div>

                  {/* Free Badge */}
                  {resource.isFree && (
                    <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      FREE
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-3 md:p-4 space-y-2 md:space-y-3 flex flex-col h-full">
                  {/* Provider and Difficulty */}
                  <div className="flex flex-row items-center justify-between gap-1 md:gap-2 text-xs font-semibold mb-1">
                    <span className="text-cyan-400 truncate">{resource.provider}</span>
                    <span className={`${getDifficultyColor(resource.difficulty)} text-xs font-bold`}>
                      {resource.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base md:text-lg text-white line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                    {resource.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs md:text-sm text-gray-300 line-clamp-4 md:line-clamp-5 leading-relaxed flex-grow">
                    {resource.description}
                  </p>

                  {/* Footer with External Link Icon */}
                  <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <FaGraduationCap className="text-sm" />
                      <span>Learning Resource</span>
                    </div>
                    <FaExternalLinkAlt className="text-cyan-400 text-sm group-hover:text-cyan-300 transition-colors duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
