const { extractRepoInfo, getGitHubData } = require('./githubService');
const { analyzeWithAI } = require('./aiService');

/**
 * Generate comprehensive insights for a GitHub repository
 * @param {string} repoUrl - GitHub repository URL
 * @returns {Object} Repository insights
 */
async function generateInsights(repoUrl) {
  const repoInfo = extractRepoInfo(repoUrl);
  
  try {
    console.log(`🔍 Analyzing repository: ${repoUrl}`);
    
    // Get GitHub API data
    console.log(`🔍 Fetching GitHub data for: ${repoInfo.owner}/${repoInfo.repo}`);
    const githubData = await getGitHubData(repoInfo.owner, repoInfo.repo);
    
    // Analyze with AI using direct repository URL
    console.log(`🤖 Analyzing with AI using structured JSON schema...`);
    const aiAnalysis = await analyzeWithAI(repoUrl, githubData, repoInfo);
    
    // Combine all data
    const insights = {
      repoUrl,
      name: repoInfo.repo,
      summary: aiAnalysis.summary,
      keyFeatures: aiAnalysis.keyFeatures,
      technologies: aiAnalysis.technologies,
      useCases: aiAnalysis.useCases,
      analytics: {
        contributors: githubData.contributors,
        projectAge: githubData.projectAge,
        totalCommits: githubData.totalCommits,
        timeline: githubData.timeline
      }
    };
    
    console.log(`✅ Insights generated successfully`, insights.analytics.totalCommits);
    return insights;
    
  } catch (error) {
    console.error('❌ Error in generateInsights:', error);
    throw error;
  }
}



module.exports = {
  generateInsights
};


