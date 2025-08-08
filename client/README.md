# Spoon - AI GitHub Insights Generator

Spoon is an AI-powered web application that generates comprehensive insights from GitHub repositories. It helps users quickly understand project purpose, key features, technologies used, and potential use cases.

## Features

- **GitHub Repository Analysis**: Paste any public GitHub repository URL to get instant insights
- **AI-Powered Insights**: Comprehensive analysis including project summary, key features, and use cases
- **Analytics Dashboard**: View top contributors, project age, commit history, and timeline
- **Modern UI**: Clean, responsive design with dark theme
- **Real-time Processing**: Fast analysis with loading states and progress indicators

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: CSS3 with modern design patterns
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios (for future API integration)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spoon
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
spoon/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── LandingPage.jsx
│   │   └── InsightsPage.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Usage

1. **Landing Page**: Enter a GitHub repository URL in the input field
2. **Generate Insights**: Click "Generate Insights" to analyze the repository
3. **View Dashboard**: Explore the comprehensive insights dashboard including:
   - Project summary and purpose
   - Key features and capabilities
   - Technologies and frameworks used
   - Potential use cases
   - Analytics (contributors, project age, timeline)

## Design Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Modern dark interface with blue accents
- **Loading States**: Smooth loading animations and progress indicators
- **Interactive Elements**: Hover effects and smooth transitions
- **Accessibility**: Proper contrast ratios and keyboard navigation

## Future Enhancements

- **Backend Integration**: Connect to OpenAI API for real repository analysis
- **GitHub API Integration**: Fetch real repository data and statistics
- **Document Upload**: Support for PDF and Markdown file uploads
- **User Authentication**: User accounts and saved insights
- **Export Features**: PDF/CSV export of insights
- **Advanced Analytics**: More detailed repository metrics and visualizations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
