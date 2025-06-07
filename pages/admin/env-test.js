// Simple test page to check environment variables
export default function EnvTest({ hasGitHubToken, gitHubRepo, gitHubBranch, tokenLength }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#1a1a1a', color: 'white' }}>
      <h1>Environment Variables Test</h1>
      <p>Check if GitHub integration is properly configured:</p>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#333', border: '1px solid #555' }}>
        <h2>Current Configuration:</h2>
        <p><strong>GITHUB_TOKEN:</strong> {hasGitHubToken ? `✅ Set (${tokenLength} characters)` : '❌ Not set'}</p>
        <p><strong>GITHUB_REPO:</strong> {gitHubRepo}</p>
        <p><strong>GITHUB_BRANCH:</strong> {gitHubBranch}</p>
      </div>
      
      {!hasGitHubToken && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#8B0000', border: '1px solid #FF6B6B' }}>
          <h3>❌ GitHub Token Missing!</h3>
          <p>You need to set the GITHUB_TOKEN environment variable in Vercel.</p>
          <p>Go to: Vercel Dashboard → Your Project → Settings → Environment Variables</p>
        </div>
      )}
      
      {hasGitHubToken && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#006400', border: '1px solid #90EE90' }}>
          <h3>✅ Configuration looks good!</h3>
          <p>Environment variables are properly set. The automated CMS should work.</p>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  // Test environment variables
  const hasGitHubToken = !!process.env.GITHUB_TOKEN;
  const gitHubRepo = process.env.GITHUB_REPO || 'Not set';
  const gitHubBranch = process.env.GITHUB_BRANCH || 'Not set';
  
  return {
    props: {
      hasGitHubToken,
      gitHubRepo,
      gitHubBranch,
      tokenLength: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0
    }
  };
} 