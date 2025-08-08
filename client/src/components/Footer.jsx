import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="copyright">
          © 2025 Spoon. All rights reserved.
        </div>
        <div className="credit">
          Made with <span className="vibe">vibe</span> and <span className="love">love</span> by{' '}
          <a 
            href="https://x.com/purnez23" 
            target="_blank" 
            rel="noopener noreferrer"
            className="purnez-link"
          >
            purnez
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
