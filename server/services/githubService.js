const axios = require('axios');

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Configure axios for GitHub API
const githubApi = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Spoon-AI-Insights'
  }
});

/**
 * Extract owner and repository name from GitHub URL
 * @param {string} repoUrl - GitHub repository URL
 * @returns {Object} Repository info
 */
function extractRepoInfo(repoUrl) {
  const url = new URL(repoUrl);
  const pathParts = url.pathname.split('/').filter(part => part);
  
  if (pathParts.length < 2) {
    throw new Error('Invalid GitHub repository URL');
  }
  
  return {
    owner: pathParts[0],
    repo: pathParts[1]
  };
}

/**
 * Get file content from GitHub repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path
 * @returns {string|null} File content or null if not found
 */
async function getFileContent(owner, repo, path) {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/contents/${path}`);
    
    if (response.data.type === 'file') {
      // Decode content if it's base64 encoded
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return content;
    }
    
    return null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // File doesn't exist
    }
    console.warn(`⚠️ Could not fetch ${path}:`, error.message);
    return null;
  }
}

/**
 * Get important repository files
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Object} Important files content
 */
async function getImportantFiles(owner, repo) {
  const importantFiles = {
    readme: null,
    packageJson: null,
    contributing: null,
    ciConfig: null,
    requirements: null,
    pomXml: null,
    gradle: null,
    cargo: null,
    composer: null,
    gemfile: null,
    goMod: null,
    pyproject: null
  };

  // List of important files to check
  const filesToCheck = [
    { key: 'readme', paths: ['README.md', 'readme.md', 'README.MD'] },
    { key: 'packageJson', paths: ['package.json'] },
    { key: 'contributing', paths: ['CONTRIBUTING.md', 'contributing.md'] },
    { key: 'ciConfig', paths: ['.github/workflows/ci.yml', '.github/workflows/ci.yaml', '.github/workflows/build.yml', '.github/workflows/build.yaml', '.travis.yml', '.circleci/config.yml'] },
    { key: 'requirements', paths: ['requirements.txt', 'requirements-dev.txt'] },
    { key: 'pomXml', paths: ['pom.xml'] },
    { key: 'gradle', paths: ['build.gradle', 'build.gradle.kts'] },
    { key: 'cargo', paths: ['Cargo.toml'] },
    { key: 'composer', paths: ['composer.json'] },
    { key: 'gemfile', paths: ['Gemfile', 'Gemfile.lock'] },
    { key: 'goMod', paths: ['go.mod'] },
    { key: 'pyproject', paths: ['pyproject.toml'] }
  ];

  // Fetch all important files
  for (const fileGroup of filesToCheck) {
    for (const path of fileGroup.paths) {
      const content = await getFileContent(owner, repo, path);
      if (content) {
        importantFiles[fileGroup.key] = {
          path: path,
          content: content
        };
        break; // Found the file, no need to check other variations
      }
    }
  }

  return importantFiles;
}

/**
 * Get comprehensive GitHub repository data
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Object} GitHub data
 */
async function getGitHubData(owner, repo) {
  try {
    console.log(`🔍 Fetching GitHub data for ${owner}/${repo}`);
    
    // Get repository information
    const repoResponse = await githubApi.get(`/repos/${owner}/${repo}`);
    const repoData = repoResponse.data;
    
    // Get contributors
    const contributorsResponse = await githubApi.get(`/repos/${owner}/${repo}/contributors?per_page=5`);
    const contributors = contributorsResponse.data.map(contributor => ({
      name: contributor.login,
      contributions: contributor.contributions,
      avatar: contributor.login.substring(0, 2).toUpperCase()
    }));
    
    // Get commits count
    const commitsResponse = await githubApi.get(
      `/repos/${owner}/${repo}/commits?per_page=1`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    
    const linkHeader = commitsResponse.headers.link;
    
    let totalCommits = 'Unknown'; // Default fallback
    
    if (linkHeader) {
      const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
      if (match && match[1]) {
        totalCommits = parseInt(match[1], 10);
      }
    }
    
    // Calculate project age
    const createdAt = new Date(repoData.created_at);
    const now = new Date();
    const projectAge = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24 * 365.25));
    const ageText = projectAge === 0 ? 'Less than 1 year' : `${projectAge} year${projectAge > 1 ? 's' : ''}`;
    
    // Generate timeline
    const timeline = generateTimeline(repoData);
    
    // Get important files
    const importantFiles = await getImportantFiles(owner, repo);
    
    return {
      contributors,
      projectAge: ageText,
      totalCommits: totalCommits === 'Unknown' ? 'Unknown' : `${totalCommits}`,
      timeline,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      description: repoData.description,
      topics: repoData.topics || [],
      importantFiles
    };
    
  } catch (error) {
    console.error('❌ Error fetching GitHub data:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error('Repository not found');
    }
    
    if (error.response?.status === 403) {
      throw new Error('Rate limit exceeded');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key');
    }
    
    throw new Error('Failed to fetch GitHub data');
  }
}

/**
 * Get commit count for a repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @returns {string} Commit count
 */
async function getCommitCount(owner, repo, branch) {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/commits?sha=${branch}&per_page=1`);
    const linkHeader = response.headers.link;
    
    if (linkHeader) {
      const lastLink = linkHeader.split(',').find(link => link.includes('rel="last"'));
      if (lastLink) {
        const pageMatch = lastLink.match(/page=(\d+)/);
        if (pageMatch) {
          return parseInt(pageMatch[1]) * 30; // GitHub returns 30 per page
        }
      }
    }
    
    return '100+'; // Fallback
  } catch (error) {
    console.warn('⚠️ Could not get commit count:', error.message);
    return '100+';
  }
}

/**
 * Generate project timeline
 * @param {Object} repoData - Repository data from GitHub API
 * @returns {Array} Timeline events
 */
function generateTimeline(repoData) {
  const timeline = [];
  const createdAt = new Date(repoData.created_at);
  const updatedAt = new Date(repoData.updated_at);
  const pushedAt = new Date(repoData.pushed_at);
  
  // Add creation date
  timeline.push({
    date: createdAt.getFullYear().toString(),
    event: 'Project Created'
  });
  
  // Add last update if different from creation
  if (updatedAt.getTime() !== createdAt.getTime()) {
    timeline.push({
      date: updatedAt.getFullYear().toString(),
      event: 'Last Updated'
    });
  }
  
  // Add last push if different from update
  if (pushedAt.getTime() !== updatedAt.getTime()) {
    timeline.push({
      date: pushedAt.getFullYear().toString(),
      event: 'Last Commit'
    });
  }
  
  // Sort by date and remove duplicates
  const uniqueTimeline = timeline.filter((item, index, self) => 
    index === self.findIndex(t => t.date === item.date)
  );
  
  return uniqueTimeline.sort((a, b) => parseInt(a.date) - parseInt(b.date));
}

/**
 * Get repository languages
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Object} Languages data
 */
async function getRepositoryLanguages(owner, repo) {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}/languages`);
    return response.data;
  } catch (error) {
    console.warn('⚠️ Could not fetch languages:', error.message);
    return {};
  }
}

module.exports = {
  extractRepoInfo,
  getGitHubData,
  getRepositoryLanguages,
  getImportantFiles
};


