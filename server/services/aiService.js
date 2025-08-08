const { GoogleGenAI, Type } = require('@google/genai');

// Initialize Google GenAI
const ai = new GoogleGenAI({});

/**
 * Analyze repository with AI using direct GitHub URL
 * @param {string} repoUrl - GitHub repository URL
 * @param {Object} githubData - GitHub API data
 * @param {Object} repoInfo - Repository information
 * @returns {Object} AI analysis results
 */
async function analyzeWithAI(repoUrl, githubData, repoInfo) {
  try {
    console.log(`🤖 Starting AI analysis for ${repoInfo.owner}/${repoInfo.repo}`);
    
    // Generate comprehensive analysis using direct repo URL
    const analysis = await generateComprehensiveAnalysis(repoUrl, githubData, repoInfo);
    
    console.log(`✅ AI analysis completed`);
    return analysis;
    
  } catch (error) {
    console.error('❌ Error in AI analysis:', error);
    console.log('🔄 Using fallback analysis due to AI failure');
    return generateFallbackAnalysis(repoInfo);
  }
}

/**
 * Generate comprehensive analysis using Gemini
 * @param {string} repoUrl - GitHub repository URL
 * @param {Object} githubData - GitHub API data
 * @param {Object} repoInfo - Repository information
 * @returns {Object} Analysis results
 */
async function generateComprehensiveAnalysis(repoUrl, githubData, repoInfo) {
  try {
    // Define the JSON schema for structured output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: "A comprehensive 3-4 sentence summary of the repository's purpose, main functionality, and key characteristics based on all available information including README, configuration files, and project structure"
        },
        keyFeatures: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Feature name or title"
              },
              description: {
                type: Type.STRING,
                description: "Brief description of the feature"
              }
            },
            required: ["title", "description"],
            propertyOrdering: ["title", "description"]
          },
          minItems: 4,
          maxItems: 4,
          description: "List of exactly 4 main features or capabilities"
        },
        technologies: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "List of main technologies, frameworks, and tools used based on configuration files and project structure"
        },
        useCases: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Use case title"
              },
              description: {
                type: Type.STRING,
                description: "Description of the use case"
              }
            },
            required: ["title", "description"],
            propertyOrdering: ["title", "description"]
          },
          minItems: 4,
          maxItems: 4,
          description: "List of exactly 4 potential real-world use cases"
        }
      },
      required: ["summary", "keyFeatures", "technologies", "useCases"],
      propertyOrdering: ["summary", "keyFeatures", "technologies", "useCases"]
    };

    // Build additional context from important files
    const additionalContext = buildAdditionalContext(githubData.importantFiles);

    const prompt = `You are an expert software analyst. Analyze this GitHub repository and provide comprehensive insights based on ALL available information including README files, configuration files, and project structure.

Repository URL: ${repoUrl}
Repository: ${repoInfo.owner}/${repoInfo.repo}

GitHub Data:
- Language: ${githubData.language || 'Unknown'}
- Stars: ${githubData.stars}
- Forks: ${githubData.forks}
- Project Age: ${githubData.projectAge}
- Total Commits: ${githubData.totalCommits}
- Topics: ${githubData.topics.join(', ') || 'None'}

${additionalContext}

Please provide:
● A comprehensive summary of the repo's purpose, main functionality, and key characteristics based on all available information
● List exactly 4 main key features with descriptions
● Main technologies and frameworks used (extracted from configuration files when available)
● Exactly 4 potential real-world use cases for this code

Be specific, accurate, and focus on the most important aspects. Use information from README files, package.json, requirements.txt, pom.xml, and other configuration files to provide more accurate insights.`;

    console.log('🤖 Sending request to Gemini with structured JSON schema...');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking for faster response
        },
      }
    });

    const analysisText = response.text;
    console.log('✅ Received structured JSON response from Gemini');
    
    // Parse JSON response (should be guaranteed to be valid JSON)
    try {
      const analysis = JSON.parse(analysisText);
      return validateAndCleanAnalysis(analysis);
    } catch (parseError) {
      console.warn('⚠️ Failed to parse structured JSON response, using fallback');
      return generateFallbackAnalysis(repoInfo);
    }
    
  } catch (error) {
    console.error('❌ Gemini API error:', error);
    return generateFallbackAnalysis(repoInfo);
  }
}

/**
 * Build additional context from important files
 * @param {Object} importantFiles - Important files data
 * @returns {string} Additional context string
 */
function buildAdditionalContext(importantFiles) {
  let context = '\nAdditional Repository Files Analysis:\n';
  
  if (importantFiles.readme) {
    context += `\nREADME.md Content (${importantFiles.readme.path}):\n${importantFiles.readme.content.substring(0, 1000)}${importantFiles.readme.content.length > 1000 ? '...' : ''}\n`;
  }
  
  if (importantFiles.packageJson) {
    context += `\nPackage.json Content (${importantFiles.packageJson.path}):\n${importantFiles.packageJson.content.substring(0, 800)}${importantFiles.packageJson.content.length > 800 ? '...' : ''}\n`;
  }
  
  if (importantFiles.contributing) {
    context += `\nCONTRIBUTING.md Content (${importantFiles.contributing.path}):\n${importantFiles.contributing.content.substring(0, 600)}${importantFiles.contributing.content.length > 600 ? '...' : ''}\n`;
  }
  
  if (importantFiles.ciConfig) {
    context += `\nCI/CD Configuration (${importantFiles.ciConfig.path}):\n${importantFiles.ciConfig.content.substring(0, 600)}${importantFiles.ciConfig.content.length > 600 ? '...' : ''}\n`;
  }
  
  if (importantFiles.requirements) {
    context += `\nRequirements.txt Content (${importantFiles.requirements.path}):\n${importantFiles.requirements.content.substring(0, 400)}${importantFiles.requirements.content.length > 400 ? '...' : ''}\n`;
  }
  
  if (importantFiles.pomXml) {
    context += `\nPOM.xml Content (${importantFiles.pomXml.path}):\n${importantFiles.pomXml.content.substring(0, 800)}${importantFiles.pomXml.content.length > 800 ? '...' : ''}\n`;
  }
  
  if (importantFiles.gradle) {
    context += `\nGradle Configuration (${importantFiles.gradle.path}):\n${importantFiles.gradle.content.substring(0, 600)}${importantFiles.gradle.content.length > 600 ? '...' : ''}\n`;
  }
  
  if (importantFiles.cargo) {
    context += `\nCargo.toml Content (${importantFiles.cargo.path}):\n${importantFiles.cargo.content.substring(0, 600)}${importantFiles.cargo.content.length > 600 ? '...' : ''}\n`;
  }
  
  if (importantFiles.composer) {
    context += `\nComposer.json Content (${importantFiles.composer.path}):\n${importantFiles.composer.content.substring(0, 600)}${importantFiles.composer.content.length > 600 ? '...' : ''}\n`;
  }
  
  if (importantFiles.gemfile) {
    context += `\nGemfile Content (${importantFiles.gemfile.path}):\n${importantFiles.gemfile.content.substring(0, 600)}${importantFiles.gemfile.content.length > 600 ? '...' : ''}\n`;
  }
  
  if (importantFiles.goMod) {
    context += `\nGo.mod Content (${importantFiles.goMod.path}):\n${importantFiles.goMod.content.substring(0, 600)}${importantFiles.goMod.content.length > 600 ? '...' : ''}\n`;
  }
  
  if (importantFiles.pyproject) {
    context += `\nPyProject.toml Content (${importantFiles.pyproject.path}):\n${importantFiles.pyproject.content.substring(0, 600)}${importantFiles.pyproject.content.length > 600 ? '...' : ''}\n`;
  }
  
  // Add summary of what files were found
  const foundFiles = Object.entries(importantFiles)
    .filter(([key, value]) => value !== null)
    .map(([key, value]) => value.path);
  
  if (foundFiles.length > 0) {
    context += `\nFound Configuration Files: ${foundFiles.join(', ')}\n`;
  } else {
    context += '\nNo additional configuration files found.\n';
  }
  
  return context;
}

/**
 * Validate and clean AI analysis results
 * @param {Object} analysis - Raw analysis from AI
 * @returns {Object} Cleaned analysis
 */
function validateAndCleanAnalysis(analysis) {
  // Ensure all required fields exist
  const cleaned = {
    summary: analysis.summary || 'This project appears to be a software application with various features and capabilities.',
    keyFeatures: Array.isArray(analysis.keyFeatures) ? analysis.keyFeatures.slice(0, 4) : [],
    technologies: Array.isArray(analysis.technologies) ? analysis.technologies.slice(0, 8) : [],
    useCases: Array.isArray(analysis.useCases) ? analysis.useCases.slice(0, 4) : []
  };
  
  // Ensure keyFeatures have required structure
  cleaned.keyFeatures = cleaned.keyFeatures.map(feature => ({
    title: feature.title || 'Feature',
    description: feature.description || 'A key feature of this project.'
  }));
  
  // Ensure useCases have required structure
  cleaned.useCases = cleaned.useCases.map(useCase => ({
    title: useCase.title || 'Use Case',
    description: useCase.description || 'A potential application for this project.'
  }));
  
  return cleaned;
}

/**
 * Generate fallback analysis when AI fails
 * @param {Object} repoInfo - Repository information
 * @returns {Object} Fallback analysis
 */
function generateFallbackAnalysis(repoInfo) {
  return {
    summary: `This is a GitHub repository (${repoInfo.owner}/${repoInfo.repo}) that contains software code and documentation. The repository appears to be a software project with various features and capabilities.`,
    keyFeatures: [
      {
        title: "Source Code Management",
        description: "Contains organized source code files and project structure"
      },
      {
        title: "Documentation",
        description: "Includes README files and project documentation for easy understanding"
      },
      {
        title: "Version Control",
        description: "Git-based version control for collaborative development"
      },
      {
        title: "Project Structure",
        description: "Well-organized project structure with configuration files"
      }
    ],
    technologies: ["Git", "Markdown", "Various programming languages", "Configuration files"],
    useCases: [
      {
        title: "Software Development",
        description: "Source code management and collaborative development workflows"
      },
      {
        title: "Project Documentation",
        description: "Documentation and project information sharing for teams"
      },
      {
        title: "Code Review",
        description: "Version control and code review processes"
      },
      {
        title: "Collaborative Work",
        description: "Team collaboration and code sharing across developers"
      }
    ]
  };
}

module.exports = {
  analyzeWithAI
};
