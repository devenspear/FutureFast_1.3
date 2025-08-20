"use client";

import { useState } from 'react';

interface HealthStatus {
  status: string;
  isHealthy: boolean;
  issues: string[];
  lastProcessedTime?: string;
  failureRate: number;
  totalArticles: number;
  successfulArticles: number;
  timestamp: string;
}

export default function HealthDashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/health-check');
      const data = await response.json();
      setHealthStatus(data);
    } catch (err) {
      setError('Failed to check system health');
      console.error('Health check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerProcessing = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cron/ai-processing', {
        method: 'GET',
        headers: {
          'x-vercel-cron-signature': 'manual'
        }
      });
      const data = await response.json();
      alert(`Processing complete: ${data.message}`);
      // Refresh health status
      await checkHealth();
    } catch (err) {
      setError('Failed to trigger processing');
      console.error('Processing trigger error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400">
          🏥 FutureFast System Health Dashboard
        </h1>
        
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={checkHealth}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Checking...' : '🔍 Check System Health'}
          </button>
          
          <button
            onClick={triggerProcessing}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Processing...' : '▶️ Trigger Processing'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <h3 className="text-red-400 font-bold mb-2">Error</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {healthStatus && (
          <div className="space-y-6">
            {/* Overall Status */}
            <div className={`border rounded-lg p-6 ${
              healthStatus.isHealthy 
                ? 'bg-green-900/20 border-green-500' 
                : 'bg-red-900/20 border-red-500'
            }`}>
              <h2 className={`text-2xl font-bold mb-4 ${
                healthStatus.isHealthy ? 'text-green-400' : 'text-red-400'
              }`}>
                {healthStatus.isHealthy ? '✅ System Healthy' : '❌ System Issues Detected'}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Articles:</span>
                  <div className="text-xl font-bold">{healthStatus.totalArticles}</div>
                </div>
                <div>
                  <span className="text-gray-400">Processed:</span>
                  <div className="text-xl font-bold text-green-400">{healthStatus.successfulArticles}</div>
                </div>
                <div>
                  <span className="text-gray-400">Failure Rate:</span>
                  <div className={`text-xl font-bold ${
                    healthStatus.failureRate > 50 ? 'text-red-400' : 
                    healthStatus.failureRate > 20 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {healthStatus.failureRate.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Last Processed:</span>
                  <div className="text-sm">
                    {healthStatus.lastProcessedTime ? 
                      new Date(healthStatus.lastProcessedTime).toLocaleString() : 
                      'Unknown'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Issues */}
            {healthStatus.issues.length > 0 && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
                <h3 className="text-red-400 font-bold mb-4">Issues Detected:</h3>
                <ul className="space-y-2">
                  {healthStatus.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span className="text-red-300">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timestamp */}
            <div className="text-sm text-gray-400 text-center">
              Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-gray-900/50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">Automated Monitoring</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p>• <strong>Daily Health Checks:</strong> Automated at 9:00 AM UTC</p>
            <p>• <strong>Processing Monitoring:</strong> Checks run after each CRON job (8 times daily)</p>
            <p>• <strong>Email Alerts:</strong> You'll receive notifications if issues are detected</p>
            <p>• <strong>Manual Check:</strong> Use this dashboard anytime to check system status</p>
          </div>
        </div>
      </div>
    </main>
  );
}