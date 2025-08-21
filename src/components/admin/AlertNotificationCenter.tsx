'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  details?: any;
  actionable?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export default function AlertNotificationCenter() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check health status
  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health-check');
      const data = await response.json();
      setHealthStatus(data);
      setLastChecked(new Date());
      
      // Generate alerts based on health status
      const newAlerts: Alert[] = [];
      
      if (!data.isHealthy) {
        data.issues.forEach((issue: string, index: number) => {
          const alertType = issue.includes('failed') || issue.includes('error') ? 'error' : 'warning';
          newAlerts.push({
            id: `health-${Date.now()}-${index}`,
            type: alertType,
            title: alertType === 'error' ? '🚨 Critical Issue' : '⚠️ Warning',
            message: issue,
            timestamp: new Date(),
            actionable: true,
            actions: [
              {
                label: 'Trigger Processing',
                action: () => triggerProcessing()
              },
              {
                label: 'View Details',
                action: () => setShowDetails(true)
              }
            ]
          });
        });
      } else if (data.failureRate > 20) {
        newAlerts.push({
          id: `rate-${Date.now()}`,
          type: 'warning',
          title: '⚠️ Elevated Failure Rate',
          message: `Processing failure rate is ${data.failureRate.toFixed(1)}%`,
          timestamp: new Date(),
          details: data
        });
      }
      
      // Add success notification if everything is healthy
      if (data.isHealthy && data.failureRate < 10) {
        newAlerts.push({
          id: `healthy-${Date.now()}`,
          type: 'success',
          title: '✅ System Healthy',
          message: 'All systems are operating normally',
          timestamp: new Date(),
          details: data
        });
      }
      
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 50)); // Keep last 50 alerts
    } catch (err) {
      const errorAlert: Alert = {
        id: `error-${Date.now()}`,
        type: 'error',
        title: '❌ Connection Error',
        message: 'Failed to check system health',
        timestamp: new Date(),
        details: err
      };
      setAlerts(prev => [errorAlert, ...prev].slice(0, 50));
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger manual processing
  const triggerProcessing = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cron/ai-processing', {
        method: 'GET',
        headers: {
          'x-vercel-cron-signature': 'manual'
        }
      });
      const data = await response.json();
      
      const alert: Alert = {
        id: `process-${Date.now()}`,
        type: 'info',
        title: '🔄 Processing Triggered',
        message: data.message || 'Manual processing has been initiated',
        timestamp: new Date(),
        details: data
      };
      setAlerts(prev => [alert, ...prev].slice(0, 50));
      
      // Refresh health status after processing
      setTimeout(() => checkHealth(), 5000);
    } catch (err) {
      const errorAlert: Alert = {
        id: `process-error-${Date.now()}`,
        type: 'error',
        title: '❌ Processing Failed',
        message: 'Failed to trigger manual processing',
        timestamp: new Date(),
        details: err
      };
      setAlerts(prev => [errorAlert, ...prev].slice(0, 50));
    } finally {
      setLoading(false);
    }
  };

  // Clear an alert
  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Clear all alerts
  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // Auto-refresh health status
  useEffect(() => {
    if (autoRefresh) {
      checkHealth();
      const interval = setInterval(checkHealth, 5 * 60 * 1000); // Check every 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, checkHealth]);

  // Get status color
  const getStatusColor = () => {
    if (!healthStatus) return 'bg-gray-500';
    if (healthStatus.isHealthy) return 'bg-green-500';
    if (healthStatus.failureRate > 50) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  // Get alert icon
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
        return 'ℹ️';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full ${getStatusColor()} flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Alert Notification Center</h2>
              <p className="text-gray-300 text-sm mt-1">
                System Health & Workflow Monitoring
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500"
              />
              <span>Auto-refresh</span>
            </label>
            
            <button
              onClick={checkHealth}
              disabled={loading}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              {loading ? 'Checking...' : 'Check Now'}
            </button>
            
            <button
              onClick={triggerProcessing}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Trigger Processing
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {healthStatus && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-800 border-b border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total Articles</p>
            <p className="text-2xl font-bold text-white">{healthStatus.totalArticles}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Processed</p>
            <p className="text-2xl font-bold text-green-400">{healthStatus.successfulArticles}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Failure Rate</p>
            <p className={`text-2xl font-bold ${
              healthStatus.failureRate > 50 ? 'text-red-400' : 
              healthStatus.failureRate > 20 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {healthStatus.failureRate.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Last Processed</p>
            <p className="text-sm font-medium text-white">
              {healthStatus.lastProcessedTime ? 
                new Date(healthStatus.lastProcessedTime).toLocaleTimeString() : 
                'Never'
              }
            </p>
          </div>
        </div>
      )}

      {/* Alerts Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Recent Alerts ({alerts.length})
          </h3>
          {alerts.length > 0 && (
            <button
              onClick={clearAllAlerts}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Alert List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No alerts at this time</p>
                <p className="text-sm mt-2">System monitoring is active</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 rounded-lg border ${
                    alert.type === 'error' ? 'bg-red-900/20 border-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500' :
                    alert.type === 'success' ? 'bg-green-900/20 border-green-500' :
                    'bg-blue-900/20 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{alert.title}</h4>
                        <p className="text-gray-300 text-sm mt-1">{alert.message}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                        
                        {alert.actions && (
                          <div className="flex space-x-2 mt-3">
                            {alert.actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={action.action}
                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => clearAlert(alert.id)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Last Checked */}
        {lastChecked && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}