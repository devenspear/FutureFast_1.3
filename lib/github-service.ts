/**
 * GitHub Service for committing files directly to repository
 * Used in production environments where file system is read-only
 */

interface GitHubFileCommitOptions {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  content: string;
  message: string;
  token: string;
}

interface GitHubCommitResult {
  success: boolean;
  commitSha?: string;
  error?: string;
}

export class GitHubService {
  private token: string;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';

    // Parse repo from GITHUB_REPO env var (format: owner/repo)
    const repoConfig = process.env.GITHUB_REPO || '';
    const [owner, repo] = repoConfig.split('/');

    this.owner = owner || '';
    this.repo = repo || '';
    this.branch = process.env.GITHUB_BRANCH || 'main';

    if (!this.token || !this.owner || !this.repo) {
      console.warn('⚠️ GitHub credentials not fully configured');
    }
  }

  /**
   * Commit a single file to GitHub repository
   */
  async commitFile(filePath: string, content: string, commitMessage: string): Promise<GitHubCommitResult> {
    try {
      console.log(`📤 Committing file to GitHub: ${filePath}`);

      // Step 1: Get the current reference (SHA of the branch)
      const refResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/refs/heads/${this.branch}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!refResponse.ok) {
        throw new Error(`Failed to get branch ref: ${refResponse.statusText}`);
      }

      const refData = await refResponse.json();
      const currentCommitSha = refData.object.sha;

      // Step 2: Get the current commit to get the tree SHA
      const commitResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/commits/${currentCommitSha}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!commitResponse.ok) {
        throw new Error(`Failed to get commit: ${commitResponse.statusText}`);
      }

      const commitData = await commitResponse.json();
      const baseTreeSha = commitData.tree.sha;

      // Step 3: Create a blob with the new file content
      const blobResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/blobs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: Buffer.from(content).toString('base64'),
            encoding: 'base64',
          }),
        }
      );

      if (!blobResponse.ok) {
        throw new Error(`Failed to create blob: ${blobResponse.statusText}`);
      }

      const blobData = await blobResponse.json();
      const blobSha = blobData.sha;

      // Step 4: Create a new tree with the file
      const treeResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/trees`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base_tree: baseTreeSha,
            tree: [
              {
                path: filePath,
                mode: '100644',
                type: 'blob',
                sha: blobSha,
              },
            ],
          }),
        }
      );

      if (!treeResponse.ok) {
        throw new Error(`Failed to create tree: ${treeResponse.statusText}`);
      }

      const treeData = await treeResponse.json();
      const newTreeSha = treeData.sha;

      // Step 5: Create a new commit
      const newCommitResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/commits`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: commitMessage,
            tree: newTreeSha,
            parents: [currentCommitSha],
          }),
        }
      );

      if (!newCommitResponse.ok) {
        throw new Error(`Failed to create commit: ${newCommitResponse.statusText}`);
      }

      const newCommitData = await newCommitResponse.json();
      const newCommitSha = newCommitData.sha;

      // Step 6: Update the reference to point to the new commit
      const updateRefResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/refs/heads/${this.branch}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sha: newCommitSha,
            force: false,
          }),
        }
      );

      if (!updateRefResponse.ok) {
        throw new Error(`Failed to update reference: ${updateRefResponse.statusText}`);
      }

      console.log(`✅ Successfully committed file to GitHub: ${filePath} (${newCommitSha})`);

      return {
        success: true,
        commitSha: newCommitSha,
      };
    } catch (error) {
      console.error('❌ GitHub commit failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Commit multiple files in a single commit
   */
  async commitMultipleFiles(
    files: Array<{ path: string; content: string }>,
    commitMessage: string
  ): Promise<GitHubCommitResult> {
    try {
      console.log(`📤 Committing ${files.length} files to GitHub`);

      // Step 1: Get the current reference
      const refResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/refs/heads/${this.branch}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!refResponse.ok) {
        throw new Error(`Failed to get branch ref: ${refResponse.statusText}`);
      }

      const refData = await refResponse.json();
      const currentCommitSha = refData.object.sha;

      // Step 2: Get the current commit
      const commitResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/commits/${currentCommitSha}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!commitResponse.ok) {
        throw new Error(`Failed to get commit: ${commitResponse.statusText}`);
      }

      const commitData = await commitResponse.json();
      const baseTreeSha = commitData.tree.sha;

      // Step 3: Create blobs for all files
      const blobPromises = files.map(async (file) => {
        const blobResponse = await fetch(
          `https://api.github.com/repos/${this.owner}/${this.repo}/git/blobs`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: Buffer.from(file.content).toString('base64'),
              encoding: 'base64',
            }),
          }
        );

        if (!blobResponse.ok) {
          throw new Error(`Failed to create blob for ${file.path}`);
        }

        const blobData = await blobResponse.json();
        return {
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blobData.sha,
        };
      });

      const treeItems = await Promise.all(blobPromises);

      // Step 4: Create a new tree with all files
      const treeResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/trees`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base_tree: baseTreeSha,
            tree: treeItems,
          }),
        }
      );

      if (!treeResponse.ok) {
        throw new Error(`Failed to create tree: ${treeResponse.statusText}`);
      }

      const treeData = await treeResponse.json();
      const newTreeSha = treeData.sha;

      // Step 5: Create a new commit
      const newCommitResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/commits`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: commitMessage,
            tree: newTreeSha,
            parents: [currentCommitSha],
          }),
        }
      );

      if (!newCommitResponse.ok) {
        throw new Error(`Failed to create commit: ${newCommitResponse.statusText}`);
      }

      const newCommitData = await newCommitResponse.json();
      const newCommitSha = newCommitData.sha;

      // Step 6: Update the reference
      const updateRefResponse = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/git/refs/heads/${this.branch}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sha: newCommitSha,
            force: false,
          }),
        }
      );

      if (!updateRefResponse.ok) {
        throw new Error(`Failed to update reference: ${updateRefResponse.statusText}`);
      }

      console.log(`✅ Successfully committed ${files.length} files to GitHub (${newCommitSha})`);

      return {
        success: true,
        commitSha: newCommitSha,
      };
    } catch (error) {
      console.error('❌ GitHub multi-file commit failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.token && this.owner && this.repo);
  }

  /**
   * Get repository info
   */
  getRepoInfo(): { owner: string; repo: string; branch: string } {
    return {
      owner: this.owner,
      repo: this.repo,
      branch: this.branch,
    };
  }
}

export default GitHubService;
