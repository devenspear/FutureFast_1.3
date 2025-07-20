'use client';

import { useState, useEffect } from 'react';

interface UnifiedStats {
  totalRecords: number;
  newsArticles: number;
  youtubeVideos: number;
  incompleteRecords: number;
  processedRecords: number;
}

interface ProcessingResult {
  recordId: string;
  sourceUrl: string;
  contentType: 'News Article' | 'YouTube Video';
  success: boolean;
  extracted?: {
    title: string;
    source: string;
    publishedDate: string;
    category?: string;
    description?: string;
    featured?: boolean;
  };
  error?: string;
}

interface ProcessingStats {
  total: number;
  successful: number;
  failed: number;
  newsArticles: number;
  youtubeVideos: number;
  results: ProcessingResult[];
}

export default function UnifiedContentTestPage() {
  const [stats, setStats] = useState<UnifiedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [autoPopulating, setAutoPopulating] = useState(false);
  const [processingResults, setProcessingResults] = useState<ProcessingStats | null>(null);
  const [autoPopulateResults, setAutoPopulateResults] = useState<{ updated: number; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats on load
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/unified-content');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const processAllContent = async () => {
    try {
      setProcessing(true);
      setProcessingResults(null);
      
      const response = await fetch('/api/unified-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'process-all' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProcessingResults(data.data);
        // Refresh stats after processing
        await fetchStats();
      } else {
        setError(data.error || 'Processing failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setProcessing(false);
    }
  };

  const autoPopulateContentTypes = async () => {
    try {
      setAutoPopulating(true);
      setAutoPopulateResults(null);
      
      const response = await fetch('/api/unified-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'auto-populate-types' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAutoPopulateResults(data.data);
        // Refresh stats after auto-population
        await fetchStats();
      } else {
        setError(data.error || 'Auto-population failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setAutoPopulating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🔧 Unified Content Management Test</h1>
          <div className="animate-pulse text-gray-400">Loading statistics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Unified Content Management Test</h1>
        
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
            <h3 className="text-red-300 font-semibold mb-2">❌ Error</h3>
            <p className="text-red-200">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-red-300 hover:text-red-100 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Current Statistics */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Current Statistics</h2>
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.totalRecords}</div>
                <div className="text-sm text-gray-300">Total Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.newsArticles}</div>
                <div className="text-sm text-gray-300">News Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{stats.youtubeVideos}</div>
                <div className="text-sm text-gray-300">YouTube Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.incompleteRecords}</div>
                <div className="text-sm text-gray-300">Need Processing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.processedRecords}</div>
                <div className="text-sm text-gray-300">Processed</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">No data available</div>
          )}
          
          <button 
            onClick={fetchStats}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            🔄 Refresh Stats
          </button>
        </div>

        {/* Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Actions</h2>
          
          <div className="space-y-4">
            <div>
              <button 
                onClick={autoPopulateContentTypes}
                disabled={autoPopulating}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 px-6 py-3 rounded transition-colors mr-4"
              >
                {autoPopulating ? '🔄 Auto-Populating...' : '🏷️ Auto-Populate Content Types'}
              </button>
              <span className="text-gray-400 text-sm">
                Automatically detect and set Content Type (News Article/YouTube Video) for records
              </span>
            </div>
            
            <div>
              <button 
                onClick={processAllContent}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-6 py-3 rounded transition-colors mr-4"
              >
                {processing ? '🔄 Processing...' : '🚀 Process All Content'}
              </button>
              <span className="text-gray-400 text-sm">
                Extract metadata for incomplete records (both news articles and YouTube videos)
              </span>
            </div>
          </div>
        </div>

        {/* Auto-Populate Results */}
        {autoPopulateResults && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🏷️ Auto-Population Results</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{autoPopulateResults.updated}</div>
                <div className="text-sm text-gray-300">Records Updated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{autoPopulateResults.errors.length}</div>
                <div className="text-sm text-gray-300">Errors</div>
              </div>
            </div>
            
            {autoPopulateResults.errors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-red-300">Errors:</h3>
                <div className="max-h-32 overflow-y-auto">
                  {autoPopulateResults.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-200 mb-1">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing Results */}
        {processingResults && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🚀 Processing Results</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{processingResults.total}</div>
                <div className="text-sm text-gray-300">Total Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{processingResults.successful}</div>
                <div className="text-sm text-gray-300">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{processingResults.failed}</div>
                <div className="text-sm text-gray-300">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{processingResults.newsArticles}</div>
                <div className="text-sm text-gray-300">News Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{processingResults.youtubeVideos}</div>
                <div className="text-sm text-gray-300">YouTube Videos</div>
              </div>
            </div>

            {processingResults.results.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Detailed Results:</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {processingResults.results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded border-l-4 ${
                        result.success 
                          ? 'bg-green-900 border-green-500' 
                          : 'bg-red-900 border-red-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">
                          {result.success ? '✅' : '❌'} {result.contentType}
                        </span>
                        <span className="text-xs text-gray-400">{result.recordId.slice(-8)}</span>
                      </div>
                      
                      <div className="text-sm text-gray-300 mb-1">
                        URL: {result.sourceUrl}
                      </div>
                      
                      {result.success && result.extracted && (
                        <div className="text-sm text-gray-400">
                          <div>📰 {result.extracted.title}</div>
                          <div>🏢 {result.extracted.source}</div>
                          <div>📅 {result.extracted.publishedDate}</div>
                          {result.extracted.category && <div>🏷️ {result.extracted.category}</div>}
                          {result.extracted.featured && <div>⭐ Featured</div>}
                        </div>
                      )}
                      
                      {!result.success && result.error && (
                        <div className="text-sm text-red-300">
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Schema Guide */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Enhanced Notion Schema</h2>
          <div className="text-sm text-gray-300 space-y-2">
            <p><strong>Required Fields:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Title</strong> (Title) - Content headline</li>
              <li><strong>Source</strong> (Rich Text) - Publication/Channel name</li>
              <li><strong>Publication Date</strong> (Date) - When published</li>
              <li><strong>Source URL</strong> (URL) - Original URL (user entry)</li>
              <li><strong>Status</strong> (Select) - Published/Draft</li>
              <li><strong>Content Type</strong> (Select) - News Article/YouTube Video</li>
              <li><strong>Category</strong> (Select) - AI & Future of Work, Web3, etc.</li>
            </ul>
            
            <p className="mt-4"><strong>Optional Fields:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Featured</strong> (Checkbox) - Highlight content</li>
              <li><strong>Processed</strong> (Checkbox) - Track processing status</li>
              <li><strong>Description</strong> (Rich Text) - Full description/summary</li>
            </ul>
            
            <p className="mt-4 text-yellow-300">
              <strong>💡 How to use:</strong> Just add a Source URL and the system will automatically detect if it&apos;s a news article or YouTube video, then extract all metadata!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 