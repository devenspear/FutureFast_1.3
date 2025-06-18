"use client";

import React, { useState } from 'react';

interface ProcessingResult {
  recordId: string;
  sourceUrl: string;
  success: boolean;
  extracted?: {
    title: string;
    source: string;
    publishedDate: string;
  };
  error?: string;
}

interface ProcessingStats {
  total: number;
  successful: number;
  failed: number;
  results: ProcessingResult[];
}

export default function AIContentTestPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [results, setResults] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const processAllRecords = async () => {
    setIsProcessing(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/ai-content-extraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'process-all' }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processTestUrl = async () => {
    if (!testUrl.trim()) {
      alert('Please enter a URL to test');
      return;
    }

    setLoading(true);
    setResults(null);
    
    try {
      const response = await fetch('/api/ai-content-extraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'process-url',
          url: testUrl.trim()
        }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/ai-content-extraction', {
        method: 'GET',
      });

      const data = await response.json();
      setStats(data);
    } catch (error) {
      setStats({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🤖 AI Content Extraction
            </h1>
            <p className="text-xl text-gray-300">
              Test AI-powered content extraction from news URLs
            </p>
          </div>

          {/* Stats Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-700/20 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-blue-400">System Status</h2>
              <button
                onClick={getStats}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
              >
                {loading ? 'Loading...' : 'Refresh Stats'}
              </button>
            </div>
            
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {stats.data?.incompleteRecords || 0}
                  </div>
                  <div className="text-gray-300">Incomplete Records</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">
                    {stats.data?.totalRecords || 0}
                  </div>
                  <div className="text-gray-300">Total Records</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className={`text-2xl font-bold ${stats.data?.readyForProcessing ? 'text-yellow-400' : 'text-green-400'}`}>
                    {stats.data?.readyForProcessing ? 'Ready' : 'Complete'}
                  </div>
                  <div className="text-gray-300">Status</div>
                </div>
              </div>
            )}
          </div>

          {/* Test Single URL */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-700/20 mb-8">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">🔍 Test Single URL</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="url"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="Enter a news article URL to test..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={processTestUrl}
                disabled={loading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : 'Extract Content'}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Try URLs from TechCrunch, Forbes, Reuters, etc.
            </p>
          </div>

          {/* Process All Records */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-700/20 mb-8">
            <h2 className="text-2xl font-semibold text-green-400 mb-4">⚡ Process All Incomplete Records</h2>
            <p className="text-gray-300 mb-4">
              This will find all Notion records with URLs but missing title, source, or date, and extract the content using AI.
            </p>
            <button
              onClick={processAllRecords}
              disabled={isProcessing}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-colors text-lg font-medium"
            >
              {isProcessing ? 'Processing All Records...' : 'Process All Incomplete Records'}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-700/20">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">📊 Results</h2>
              
              {results.success ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-900/30 border border-green-700/30 rounded-lg">
                    <span className="text-green-400 text-2xl">✅</span>
                    <div>
                      <div className="font-semibold text-green-400">Success!</div>
                      <div className="text-gray-300">{results.message}</div>
                    </div>
                  </div>

                  {/* Single URL Result */}
                  {results.data.recordId === 'manual' && results.data.extracted && (
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">Extracted Content:</h3>
                      <div className="space-y-2">
                        <div><span className="text-gray-400">Title:</span> <span className="text-white">{results.data.extracted.title}</span></div>
                        <div><span className="text-gray-400">Source:</span> <span className="text-white">{results.data.extracted.source}</span></div>
                        <div><span className="text-gray-400">Date:</span> <span className="text-white">{results.data.extracted.publishedDate}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Batch Processing Results */}
                  {results.data.results && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-blue-400">Processing Details:</h3>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {results.data.results.map((result: ProcessingResult, index: number) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              result.success 
                                ? 'bg-green-900/20 border-green-700/30' 
                                : 'bg-red-900/20 border-red-700/30'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className={result.success ? 'text-green-400' : 'text-red-400'}>
                                {result.success ? '✅' : '❌'}
                              </span>
                              <div className="flex-1">
                                <div className="text-sm text-gray-300">{result.sourceUrl}</div>
                                {result.success && result.extracted && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    {result.extracted.title}
                                  </div>
                                )}
                                {!result.success && (
                                  <div className="text-xs text-red-400 mt-1">
                                    {result.error}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-red-900/30 border border-red-700/30 rounded-lg">
                  <span className="text-red-400 text-2xl">❌</span>
                  <div>
                    <div className="font-semibold text-red-400">Error</div>
                    <div className="text-gray-300">{results.error}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 