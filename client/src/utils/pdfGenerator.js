// PDF Generator Utility
export const generatePDFContent = (insights) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const createPDFContent = () => {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${insights.name} - GitHub Insights Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #64748b;
            margin-bottom: 20px;
          }
          .summary {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #3b82f6;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 5px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
          }
          .card {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .card-title {
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 8px;
          }
          .tech-tag {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin: 2px;
          }
          .analytics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          .analytics-card {
            background: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
          }
          .analytics-value {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
          }
          .analytics-label {
            font-size: 12px;
            color: #64748b;
            margin-top: 5px;
          }
          .contributor-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .contributor-avatar {
            width: 30px;
            height: 30px;
            background: #3b82f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            margin-right: 10px;
          }
          .timeline-item {
            display: flex;
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
          }
          .timeline-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            width: 8px;
            height: 8px;
            background: #3b82f6;
            border-radius: 50%;
          }
          .timeline-date {
            font-weight: bold;
            color: #3b82f6;
            margin-right: 10px;
            min-width: 80px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; }
            .header { page-break-after: avoid; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${insights.name}</div>
          <div class="subtitle">GitHub Repository Insights Report</div>
          <div style="font-size: 12px; color: #64748b;">
            Generated on ${formatDate(new Date())}
          </div>
        </div>

        <div class="summary">
          <strong>Project Summary:</strong><br>
          ${insights.summary}
        </div>

        <div class="section">
          <div class="section-title">Key Features</div>
          <div class="grid">
            ${insights.keyFeatures.map(feature => `
              <div class="card">
                <div class="card-title">${feature.title}</div>
                <div>${feature.description}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Technologies Used</div>
          <div>
            ${insights.technologies.map(tech => `
              <span class="tech-tag">${tech}</span>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Use Cases</div>
          <div class="grid">
            ${insights.useCases.map(useCase => `
              <div class="card">
                <div class="card-title">${useCase.title}</div>
                <div>${useCase.description}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Analytics Dashboard</div>
          
          <div class="analytics-grid">
            <div class="analytics-card">
              <div class="analytics-value">${insights.analytics.projectAge}</div>
              <div class="analytics-label">Project Age</div>
            </div>
            <div class="analytics-card">
              <div class="analytics-value">${insights.analytics.totalCommits}</div>
              <div class="analytics-label">Total Commits</div>
            </div>
          </div>

          <div style="margin-top: 20px;">
            <div class="section-title" style="font-size: 16px;">Top Contributors</div>
            ${insights.analytics.contributors.map(contributor => `
              <div class="contributor-item">
                <div class="contributor-avatar">${contributor.avatar}</div>
                <div>
                  <div style="font-weight: bold;">${contributor.name}</div>
                  <div style="font-size: 12px; color: #64748b;">
                    ${contributor.contributions.toLocaleString()} contributions
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 20px;">
            <div class="section-title" style="font-size: 16px;">Project Timeline</div>
            ${insights.analytics.timeline.map(item => `
              <div class="timeline-item">
                <div class="timeline-date">${item.date}</div>
                <div>${item.event}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="footer">
          <div>Generated by Spoon - AI-powered GitHub insights</div>
          <div style="margin-top: 5px;">© 2025 Spoon. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;
    
    return content;
  };

  return createPDFContent();
};

export const downloadPDF = (insights) => {
  const content = generatePDFContent(insights);
  
  // Create a blob with the HTML content
  const blob = new Blob([content], { type: 'text/html' });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = `${insights.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_insights_report.html`;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
};

// Alternative method using window.print() for better PDF generation
export const printPDF = (insights) => {
  const content = generatePDFContent(insights);
  
  // Create a new window with the content
  const printWindow = window.open('', '_blank');
  printWindow.document.write(content);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print();
    // Close the window after printing
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  };
};
