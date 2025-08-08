# Spoon Server - Backend API

This is the backend server for the Spoon AI GitHub insights generator. It provides a RESTful API that analyzes GitHub repositories using AI to generate comprehensive insights.

## Features

- **GitHub Repository Analysis**: Clone and analyze any public GitHub repository
- **AI-Powered Insights**: Use Google Gemini 2.5 Flash to generate intelligent analysis
- **Comprehensive Data**: Extract key features, technologies, use cases, and analytics
- **Real-time Processing**: Fast analysis with detailed logging
- **Error Handling**: Robust error handling and fallback mechanisms

## API Endpoints

### POST `/api/insights`
Generate insights for a GitHub repository.

**Request Body:**
```json
{
  "repoUrl": "https://github.com/username/repository"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "repoUrl": "https://github.com/username/repository",
    "name": "repository",
    "summary": "Project description...",
    "keyFeatures": [
      {
        "title": "Feature Name",
        "description": "Feature description"
      }
    ],
    "technologies": ["React", "Node.js", "Python"],
    "useCases": [
      {
        "title": "Use Case Name",
        "description": "Use case description"
      }
    ],
    "analytics": {
      "contributors": [
        {
          "name": "username",
          "contributions": 1200,
          "avatar": "US"
        }
      ],
      "projectAge": "3 years",
      "totalCommits": "500+",
      "timeline": [
        {
          "date": "2020",
          "event": "Project Created"
        }
      ]
    }
  },
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

### GET `/health`
Server health check endpoint.

### GET `/api/insights/health`
Insights service health check.

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# GitHub Configuration
GITHUB_TOKEN=your_github_token_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your API keys

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

## Project Structure

```
server/
├── routes/
│   └── insights.js          # API route handlers
├── services/
│   ├── insightsService.js   # Main insights generation logic
│   ├── githubService.js     # GitHub API integration
│   └── aiService.js         # Gemini AI integration
├── server.js                # Express server setup
├── package.json
└── README.md
```

## How It Works

1. **GitHub URL Analysis**: Directly analyzes GitHub repository URLs without cloning
2. **GitHub API Integration**: Fetches repository metadata, contributors, and analytics
3. **AI Analysis**: Uses Google Gemini 2.5 Flash with structured JSON schema to analyze repository and generate insights
4. **Data Combination**: Merges GitHub data with AI analysis for comprehensive insights

## Error Handling

The API includes comprehensive error handling for:
- Invalid GitHub URLs
- Private repositories
- Rate limit exceeded
- Invalid API keys
- Network errors
- AI analysis failures

## Rate Limits

- GitHub API: 5000 requests per hour (with authenticated token)
- Gemini API: Depends on your plan
- Consider implementing caching for frequently requested repositories

## Security Considerations

- API keys are stored in environment variables
- Temporary files are automatically cleaned up
- CORS is configured for frontend integration
- Input validation for GitHub URLs
- Error messages don't expose sensitive information

## Development

### Adding New Features

1. **New API Endpoints**: Add routes in `routes/` directory
2. **New Services**: Create service files in `services/` directory
3. **Error Handling**: Add specific error types in route handlers
4. **Testing**: Add tests for new functionality

### Debugging

- Check console logs for detailed processing information
- Use the health endpoints to verify service status
- Monitor temporary file cleanup in the `temp/` directory

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Set up environment variables
4. Consider using PM2 or similar process manager
5. Set up monitoring and logging
6. Implement rate limiting and caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.


