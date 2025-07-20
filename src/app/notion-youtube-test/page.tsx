'use client';

import { useState, useEffect } from 'react';

interface YouTubeStats {
  youtubeRecordCount: number;
  totalNotionRecords: number;
}

interface ProcessingResult {
  recordId: string;
  sourceUrl: string;
  success: boolean;
  videoId?: string;
  slug?: string;
  error?: string;
}

interface YouTubeProcessingStats {
  total: number;
  successful: number;
  failed: number;
  results: ProcessingResult[];
}

export default function NotionYouTubeTestPage() {
  const [stats, setStats] = useState<YouTubeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<YouTubeProcessingStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notion-youtube');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching YouTube stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const processYouTubeRecords = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      const response = await fetch('/api/notion-youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'process-all' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process YouTube records');
      }
      
      const data = await response.json();
      setProcessingResults(data.data);
      
      // Refresh stats after processing
      await fetchStats();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error processing YouTube records:', err);
    } finally {
      setProcessing(false);
    }
  };

  const processAllContent = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      const response = await fetch('/api/ai-content-extraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'process-all-content' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process all content');
      }
      
      const data = await response.json();
      console.log('All content processing results:', data);
      
      // Refresh stats after processing
      await fetchStats();
      
      alert(`Processing complete!\n${data.message}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error processing all content:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <span className="ml-3 text-cyan-100">Loading YouTube processing stats...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-orbitron mb-2">
            Notion ↔ YouTube Integration Test
          </h1>
          <p className="text-cyan-100 text-lg">
            Test the automatic processing of YouTube URLs found in Notion database entries.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-100 px-6 py-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="bg-gray-900/80 rounded-xl p-6 mb-8 border border-gray-800">
          <h2 className="text-xl font-semibold text-cyan-100 mb-4">Current Statistics</h2>
          
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">{stats.youtubeRecordCount}</div>
                <div className="text-gray-300">YouTube URLs in Notion</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{stats.totalNotionRecords}</div>
                <div className="text-gray-300">Total Notion Records</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">Failed to load statistics</div>
          )}
        </div>

        {/* Actions Section */}
        <div className="bg-gray-900/80 rounded-xl p-6 mb-8 border border-gray-800">
          <h2 className="text-xl font-semibold text-cyan-100 mb-4">Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={processYouTubeRecords}
              disabled={processing}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {processing ? 'Processing...' : 'Process YouTube Records Only'}
            </button>
            
            <button
              onClick={processAllContent}
              disabled={processing}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {processing ? 'Processing...' : 'Process All Content (News + YouTube)'}
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            <p>• <strong>YouTube Only:</strong> Processes only YouTube URLs found in Notion and adds them to the video management system</p>
            <p>• <strong>All Content:</strong> Processes both news articles (excluding YouTube URLs) and YouTube videos</p>
          </div>
        </div>

        {/* Results Section */}
        {processingResults && (
          <div className="bg-gray-900/80 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-cyan-100 mb-4">Processing Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{processingResults.total}</div>
                <div className="text-gray-300">Total Processed</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{processingResults.successful}</div>
                <div className="text-gray-300">Successful</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{processingResults.failed}</div>
                <div className="text-gray-300">Failed</div>
              </div>
            </div>

            {processingResults.results.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-cyan-100 mb-3">Detailed Results</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {processingResults.results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.success
                          ? 'bg-green-900/30 border-green-500/50'
                          : 'bg-red-900/30 border-red-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">
                            {result.success ? '✅' : '❌'} {result.sourceUrl}
                          </div>
                          {result.videoId && (
                            <div className="text-xs text-gray-400">Video ID: {result.videoId}</div>
                          )}
                          {result.slug && (
                            <div className="text-xs text-gray-400">Slug: {result.slug}</div>
                          )}
                          {result.error && (
                            <div className="text-xs text-red-400 mt-1">{result.error}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* How It Works Section */}
        <div className="bg-gray-900/80 rounded-xl p-6 mt-8 border border-gray-800">
          <h2 className="text-xl font-semibold text-cyan-100 mb-4">How It Works</h2>
          
          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg text-cyan-200">Enhanced Notion Content Management</h3>
            <p className="text-gray-300 mb-4">
              The system now automatically detects YouTube URLs in your Notion database and processes them differently from regular news articles:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-4">
              <li><strong>URL Detection:</strong> Scans Notion entries for YouTube URLs using pattern matching</li>
              <li><strong>Automatic Categorization:</strong> Uses AI to determine the appropriate video category based on title and source</li>
              <li><strong>YouTube Integration:</strong> Adds videos to the YouTube management system instead of news processing</li>
              <li><strong>Metadata Fetching:</strong> Triggers YouTube API to fetch video metadata (title, description, etc.)</li>
              <li><strong>Admin Integration:</strong> Videos appear in the admin interface for further management</li>
            </ol>

            <h3 className="text-lg text-cyan-200">Benefits</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Unified content management through Notion</li>
              <li>Automatic routing based on content type</li>
              <li>No manual copy-pasting between systems</li>
              <li>Consistent categorization and metadata</li>
              <li>Seamless integration with existing workflows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 