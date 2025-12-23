"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { FaExternalLinkAlt, FaChevronRight } from 'react-icons/fa';

interface TrendSummary {
  trend: string;
  implication: string;
}

interface DevelopmentSummary {
  headline: string;
  significance: string;
}

interface BriefingData {
  id: string;
  source: string;
  periodStart: string;
  periodEnd: string;
  periodDays: number;
  analysisCount: number;
  validationScore: number | null;
  headline: string | null;
  executiveSummary: string | null;
  topTrends: TrendSummary[] | null;
  keyDevelopments: DevelopmentSummary[] | null;
  companiesWatching: string[] | null;
  technologiesWatching: string[] | null;
  strategicInsight: string | null;
  emergingPatterns: string[] | null;
  fullBriefingUrl: string | null;
  generatedAt: string;
  syncedAt: string;
}

export default function WeeklyIntelligenceDigest() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side cache
  const CACHE_KEY = 'briefing_digest_cache';
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

  const getCachedData = useCallback((): BriefingData | null => {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp < CACHE_DURATION) {
        return data;
      } else {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  const setCachedData = useCallback((data: BriefingData) => {
    if (typeof window === 'undefined') return;

    try {
      const cacheData = { data, timestamp: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch {
      // Ignore cache errors
    }
  }, []);

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        setIsLoading(true);

        // Check cache first
        const cached = getCachedData();
        if (cached) {
          setBriefing(cached);
          setIsLoading(false);
          return;
        }

        // Fetch from API
        const response = await fetch('/api/briefing-digest');

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.briefing) {
          setCachedData(data.briefing);
          setBriefing(data.briefing);
        } else {
          setError('No briefing available');
        }
      } catch (err) {
        console.error('Error fetching briefing:', err);
        setError('Failed to load intelligence digest');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBriefing();
  }, [getCachedData, setCachedData]);

  // Format date for display
  const formatDateRange = (start: string, end: string) => {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

      return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
    } catch {
      return `${start} - ${end}`;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-black text-white" id="intelligence-digest">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
          Weekly Intelligence Digest
        </h1>
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto"></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-800 rounded"></div>
              <div className="h-48 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error or no data state
  if (error || !briefing) {
    return (
      <section className="py-16 bg-black text-white" id="intelligence-digest">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
          Weekly Intelligence Digest
        </h1>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-lg">
            Intelligence digest updating...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Check back Monday for the latest analysis.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black text-white" id="intelligence-digest">
      {/* Section Header */}
      <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#99731A] via-[#D4AF37] to-[#99731A] bg-clip-text text-transparent">
        Weekly Intelligence Digest
      </h1>

      <p className="text-center text-cyan-100 text-lg mb-2 max-w-3xl mx-auto px-4">
        AI-synthesized insights from {briefing.analysisCount} sources
      </p>

      <p className="text-center text-gray-400 text-sm mb-8">
        {formatDateRange(briefing.periodStart, briefing.periodEnd)}
        {briefing.validationScore && (
          <span className="ml-2 text-green-400">
            • {Math.round(briefing.validationScore * 100)}% validated
          </span>
        )}
      </p>

      <div className="max-w-6xl mx-auto px-4">
        {/* Headline */}
        {briefing.headline && (
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {briefing.headline}
            </h2>
            {briefing.executiveSummary && (
              <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
                {briefing.executiveSummary}
              </p>
            )}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Trends & Strategic Insight */}
          <div className="space-y-6">
            {/* Top Trends */}
            {briefing.topTrends && briefing.topTrends.length > 0 && (
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                  Top Trends
                </h3>
                <ul className="space-y-4">
                  {briefing.topTrends.map((trend, idx) => (
                    <li key={idx} className="group">
                      <div className="flex items-start gap-3">
                        <FaChevronRight className="text-cyan-400 mt-1 flex-shrink-0 text-xs" />
                        <div>
                          <p className="text-white font-medium leading-tight">
                            {trend.trend}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            → {trend.implication}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strategic Insight */}
            {briefing.strategicInsight && (
              <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-xl p-6 border border-amber-700/50">
                <h3 className="text-amber-400 text-sm font-bold uppercase tracking-wider mb-3 flex items-center">
                  <span className="text-lg mr-2">💡</span>
                  Strategic Insight
                </h3>
                <p className="text-white leading-relaxed">
                  {briefing.strategicInsight}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Key Developments & Watching */}
          <div className="space-y-6">
            {/* Key Developments */}
            {briefing.keyDevelopments && briefing.keyDevelopments.length > 0 && (
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                  Key Developments
                </h3>
                <ul className="space-y-3">
                  {briefing.keyDevelopments.map((dev, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-cyan-400 font-bold text-sm mt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-white font-medium leading-tight">
                          {dev.headline}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {dev.significance}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Companies & Technologies */}
            <div className="grid grid-cols-2 gap-4">
              {/* Companies */}
              {briefing.companiesWatching && briefing.companiesWatching.length > 0 && (
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
                    Companies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {briefing.companiesWatching.map((company, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {briefing.technologiesWatching && briefing.technologiesWatching.length > 0 && (
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {briefing.technologiesWatching.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-cyan-900/50 text-cyan-200 px-2 py-1 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View Full Analysis Link */}
        {briefing.fullBriefingUrl && (
          <div className="text-center mt-8">
            <a
              href={briefing.fullBriefingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Full Analysis
              <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        )}

        {/* Footer Attribution */}
        <p className="text-center text-gray-500 text-xs italic mt-8">
          Powered by Disruption Radar
        </p>
      </div>
    </section>
  );
}
