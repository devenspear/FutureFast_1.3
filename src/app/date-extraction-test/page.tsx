'use client';

import { useState } from 'react';

interface ExtractedMetadata {
  title: string;
  source: string;
  publishedDate: string;
  summary: string;
  tags: string[];
}

export default function DateExtractionTestPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtractedMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testUrls = [
    'https://techcrunch.com/2024/01/15/openai-gpt-4-turbo-preview/',
    'https://www.forbes.com/sites/forbestechcouncil/2024/01/10/ai-trends-2024/',
    'https://www.wired.com/story/artificial-intelligence-2024-predictions/',
    'https://www.theverge.com/2024/1/8/24030284/ces-2024-ai-technology-trends',
  ];

  const handleTest = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test-date-extraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.metadata);
      } else {
        setError(data.error || 'Failed to extract metadata');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🕰️ Enhanced Date Extraction Test
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test URL Date Extraction</h2>
          
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              Article URL
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Quick test URLs:</p>
            <div className="flex flex-wrap gap-2">
              {testUrls.map((testUrl, index) => (
                <button
                  key={index}
                  onClick={() => setUrl(testUrl)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                >
                  Test URL {index + 1}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-md font-medium transition-colors"
          >
            {loading ? 'Extracting...' : 'Test Date Extraction'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold mb-2">❌ Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">✅ Extracted Metadata</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium mb-2 text-blue-400">Title</h4>
                <p className="text-gray-300">{result.title}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2 text-blue-400">Source</h4>
                <p className="text-gray-300">{result.source}</p>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium mb-2 text-green-400">📅 Publication Date</h4>
                <p className="text-green-300 text-lg font-semibold">
                  {formatDate(result.publishedDate)}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Raw: {result.publishedDate}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium mb-2 text-blue-400">Summary</h4>
                <p className="text-gray-300">{result.summary}</p>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium mb-2 text-blue-400">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-600 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🔧 Enhanced Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• <strong>Meta Tag Extraction:</strong> Reads article:published_time, datePublished, and other meta tags</li>
            <li>• <strong>JSON-LD Parsing:</strong> Extracts structured data from schema.org markup</li>
            <li>• <strong>AI Content Analysis:</strong> GPT-4o analyzes article content for publication dates</li>
            <li>• <strong>Multiple Date Formats:</strong> Handles various date formats and converts to ISO</li>
            <li>• <strong>Smart Fallbacks:</strong> Uses current date only as last resort</li>
            <li>• <strong>Validation:</strong> Ensures extracted dates are valid and properly formatted</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 