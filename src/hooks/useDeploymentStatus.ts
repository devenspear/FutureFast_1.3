import { useState, useEffect, useCallback } from 'react';

interface DeploymentStatus {
  status: 'pending' | 'queued' | 'building' | 'ready' | 'error' | 'canceled' | 'unknown';
  message: string;
  deploymentUrl?: string;
  commitSha?: string;
  pollingEnabled: boolean;
}

interface UseDeploymentStatusReturn {
  deploymentStatus: DeploymentStatus | null;
  isPolling: boolean;
  startPolling: (commitSha: string) => void;
  stopPolling: () => void;
}

/**
 * Custom hook to poll for Vercel deployment status after content updates
 * Automatically stops polling when deployment is ready, errored, or canceled
 */
export function useDeploymentStatus(): UseDeploymentStatusReturn {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [commitSha, setCommitSha] = useState<string | null>(null);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
    setIsPolling(false);
  }, [pollInterval]);

  const checkDeploymentStatus = useCallback(async (sha: string) => {
    try {
      const response = await fetch(`/api/admin/deployment-status?commitSha=${sha}`);
      const data: DeploymentStatus = await response.json();

      setDeploymentStatus(data);

      // Stop polling if deployment reached final state or polling is disabled
      if (!data.pollingEnabled || ['ready', 'error', 'canceled'].includes(data.status)) {
        stopPolling();
      }

      return data;
    } catch (error) {
      console.error('Error checking deployment status:', error);
      setDeploymentStatus({
        status: 'error',
        message: 'Failed to check deployment status',
        pollingEnabled: false
      });
      stopPolling();
      return null;
    }
  }, [stopPolling]);

  const startPolling = useCallback((sha: string) => {
    console.log('🔄 Starting deployment status polling for commit:', sha);
    setCommitSha(sha);
    setIsPolling(true);

    // Initial check
    checkDeploymentStatus(sha);

    // Poll every 5 seconds
    const interval = setInterval(() => {
      checkDeploymentStatus(sha);
    }, 5000);

    setPollInterval(interval);

    // Stop polling after 5 minutes (max build time)
    setTimeout(() => {
      stopPolling();
      console.log('⏱️ Deployment polling timeout reached (5 minutes)');
    }, 5 * 60 * 1000);
  }, [checkDeploymentStatus, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  return {
    deploymentStatus,
    isPolling,
    startPolling,
    stopPolling
  };
}
