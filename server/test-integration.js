const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

// Check if environment variables are set
if (!process.env.OPENAI_API_KEY || !process.env.GITHUB_TOKEN) {
  console.log("❌ Environment variables not found!");
  console.log(
    "\n📝 Please create a .env file in the server directory with the following content:"
  );
  console.log("\n# OpenAI Configuration");
  console.log("OPENAI_API_KEY");
  console.log("\n# GitHub Configuration");
  console.log("GITHUB_TOKEN");
  console.log("\n# Server Configuration");
  console.log("PORT=5000");
  console.log("NODE_ENV=development");
  console.log("\n# CORS Configuration");
  console.log("CORS_ORIGIN=http://localhost:3000");
  console.log("\nAfter creating the .env file, run this test again.");
  process.exit(1);
}

const { extractRepoInfo, getGitHubData } = require("./services/githubService");
const { analyzeWithAI } = require("./services/aiService");

async function testIntegrations() {
  console.log("🧪 Testing Spoon Server Integrations...\n");

  // Test GitHub API
  console.log("🔍 Testing GitHub API Integration...");
  try {
    const testRepo = "https://github.com/facebook/react";
    const repoInfo = extractRepoInfo(testRepo);
    console.log(
      `✅ Repository info extracted: ${repoInfo.owner}/${repoInfo.repo}`
    );

    const githubData = await getGitHubData(repoInfo.owner, repoInfo.repo);
    console.log("✅ GitHub API data fetched successfully:");
    console.log(`   - Language: ${githubData.language}`);
    console.log(`   - Stars: ${githubData.stars}`);
    console.log(`   - Project Age: ${githubData.projectAge}`);
    console.log(`   - Contributors: ${githubData.contributors.length}`);
    console.log(`   - Total Commits: ${githubData.totalCommits}\n`);
  } catch (error) {
    console.error("❌ GitHub API test failed:", error.message);
    return;
  }

  // Test OpenAI API
  console.log("🤖 Testing OpenAI API Integration...");
  try {
    const mockRepoContent = {
      readme: "# React\n\nA JavaScript library for building user interfaces.",
      packageJson: '{"name": "react", "version": "18.0.0"}',
      codeFiles: [],
      configFiles: [],
    };

    const mockGithubData = {
      language: "JavaScript",
      stars: 200000,
      forks: 40000,
      projectAge: "10 years",
      totalCommits: "50000+",
      topics: ["react", "javascript", "ui"],
    };

    const mockRepoInfo = {
      owner: "facebook",
      repo: "react",
    };

    const aiAnalysis = await analyzeWithAI(
      mockRepoContent,
      mockGithubData,
      mockRepoInfo
    );
    console.log("✅ OpenAI API analysis completed successfully:");
    console.log(`   - Summary: ${aiAnalysis.summary.substring(0, 100)}...`);
    console.log(
      `   - Key Features: ${aiAnalysis.keyFeatures.length} features extracted`
    );
    console.log(
      `   - Technologies: ${aiAnalysis.technologies.length} technologies identified`
    );
    console.log(
      `   - Use Cases: ${aiAnalysis.useCases.length} use cases suggested\n`
    );
  } catch (error) {
    console.error("❌ OpenAI API test failed:", error.message);
    return;
  }

  console.log("🎉 All integrations are working correctly!");
  console.log("\n📋 Environment Variables Check:");
  console.log(
    `   - GITHUB_TOKEN: ${process.env.GITHUB_TOKEN ? "✅ Set" : "❌ Missing"}`
  );
  console.log(
    `   - OPENAI_API_KEY: ${
      process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing"
    }`
  );
  console.log(`   - PORT: ${process.env.PORT || "5000 (default)"}`);

  console.log("\n🚀 You can now start the server with: npm run dev");
}

// Run the test
testIntegrations().catch(console.error);
