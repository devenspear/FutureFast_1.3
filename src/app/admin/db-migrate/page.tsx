'use client';

/**
 * TEMPORARY: Database Migration UI
 * Visit this page in your browser to run the database migration.
 * DELETE THIS FILE AFTER RUNNING THE MIGRATION ONCE.
 */

import { useState } from 'react';

export default function DatabaseMigrationPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const runMigration = async () => {
    setStatus('running');
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/run-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Migration-Key': 'migrate-db-2025',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setResult(data);
      } else {
        setStatus('error');
        setError(data.error || 'Migration failed');
        setResult(data);
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Database Migration</h1>

        <div className="bg-yellow-900/30 border border-yellow-500 p-4 rounded mb-6">
          <p className="font-semibold">⚠️ Temporary Migration Tool</p>
          <p className="text-sm mt-2">
            This page will create the database schema (tables, indexes, triggers) for the new CMS system.
            Delete this file after running the migration once.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Migration Status</h2>

          <div className="mb-4">
            {status === 'idle' && (
              <p className="text-gray-400">Ready to run migration</p>
            )}
            {status === 'running' && (
              <p className="text-blue-400">🔄 Running migration...</p>
            )}
            {status === 'success' && (
              <p className="text-green-400">✅ Migration completed successfully!</p>
            )}
            {status === 'error' && (
              <p className="text-red-400">❌ Migration failed</p>
            )}
          </div>

          <button
            onClick={runMigration}
            disabled={status === 'running'}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded font-semibold transition"
          >
            {status === 'running' ? 'Running Migration...' : 'Run Database Migration'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 p-4 rounded mb-6">
            <p className="font-semibold">Error:</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Migration Result</h2>
            <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">What This Migration Does</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
            <li>Creates <code className="bg-gray-700 px-2 py-1 rounded">news_articles</code> table</li>
            <li>Creates <code className="bg-gray-700 px-2 py-1 rounded">youtube_videos</code> table</li>
            <li>Creates <code className="bg-gray-700 px-2 py-1 rounded">resources</code> table</li>
            <li>Creates <code className="bg-gray-700 px-2 py-1 rounded">static_content</code> table</li>
            <li>Creates indexes for better query performance</li>
            <li>Creates triggers for automatic timestamp updates</li>
            <li>Enables full-text search capabilities</li>
          </ul>

          <p className="mt-4 text-sm text-gray-400">
            After running this migration, you can delete this page and the migration API endpoint.
          </p>
        </div>
      </div>
    </div>
  );
}
