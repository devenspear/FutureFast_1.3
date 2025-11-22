import { NextResponse } from 'next/server';

/**
 * API endpoint to check Vercel deployment status
 * This allows the admin UI to poll for deployment completion after adding content
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commitSha = searchParams.get('commitSha');

    if (!commitSha) {
      return NextResponse.json(
        { error: 'Commit SHA is required' },
        { status: 400 }
      );
    }

    // Get Vercel token from environment
    const vercelToken = process.env.VERCEL_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;

    if (!vercelToken || !vercelProjectId) {
      console.warn('⚠️ Vercel API not configured - cannot check deployment status');
      return NextResponse.json({
        status: 'unknown',
        message: 'Vercel API not configured',
        pollingEnabled: false
      });
    }

    // Fetch deployments from Vercel API
    const deploymentsResponse = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${vercelProjectId}&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!deploymentsResponse.ok) {
      console.error('❌ Failed to fetch deployments from Vercel');
      return NextResponse.json({
        status: 'error',
        message: 'Failed to fetch deployment status'
      }, { status: 500 });
    }

    const deploymentsData = await deploymentsResponse.json();

    // Find deployment matching this commit
    const deployment = deploymentsData.deployments?.find((d: any) =>
      d.meta?.githubCommitSha === commitSha
    );

    if (!deployment) {
      return NextResponse.json({
        status: 'pending',
        message: 'Deployment not found yet - may still be queued',
        pollingEnabled: true
      });
    }

    // Map Vercel deployment states to our statuses
    const statusMap: Record<string, string> = {
      'READY': 'ready',
      'ERROR': 'error',
      'BUILDING': 'building',
      'QUEUED': 'queued',
      'CANCELED': 'canceled',
      'INITIALIZING': 'building'
    };

    const status = statusMap[deployment.readyState] || 'unknown';
    const deploymentUrl = deployment.url ? `https://${deployment.url}` : null;

    return NextResponse.json({
      status,
      message: getStatusMessage(status),
      deploymentUrl,
      commitSha: deployment.meta?.githubCommitSha,
      pollingEnabled: true,
      readyState: deployment.readyState,
      createdAt: deployment.createdAt
    });

  } catch (error) {
    console.error('💥 Error checking deployment status:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      pollingEnabled: false
    }, { status: 500 });
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'ready':
      return 'Deployment complete! Changes are now live.';
    case 'building':
      return 'Deployment in progress...';
    case 'queued':
      return 'Deployment queued...';
    case 'error':
      return 'Deployment failed. Check Vercel dashboard for details.';
    case 'canceled':
      return 'Deployment was canceled.';
    default:
      return 'Deployment status unknown.';
  }
}
