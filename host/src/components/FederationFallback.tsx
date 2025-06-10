import React from 'react';
import './FederationFallback.css';

interface FederationFallbackProps {
  appName: string;
  onRetry: () => void;
  error?: string;
}

/**
 * Generic fallback component for Module Federation failures
 * Displays when a remote micro-frontend cannot be loaded
 */
const FederationFallback: React.FC<FederationFallbackProps> = ({ 
  appName, 
  onRetry, 
  error 
}) => {
  return (
    <div className="federation-fallback">
      <div className="fallback-container">
        <div className="fallback-icon">
          🌐❌
        </div>
        
        <div className="fallback-content">
          <h1>Remote Micro-Frontend Unavailable</h1>
          <h2>{appName}</h2>
          
          <div className="fallback-message">
            <p className="primary-message">
              Sorry, the remote micro-frontend cannot be loaded.
            </p>
            <p className="secondary-message">
              Please make sure the remote application is running and try again.
            </p>
          </div>

          {error && (
            <div className="error-details">
              <h3>Technical Details:</h3>
              <code className="error-code">{error}</code>
            </div>
          )}

          <div className="fallback-actions">
            <button 
              onClick={onRetry}
              className="retry-button"
              aria-label={`Retry loading ${appName}`}
            >
              🔄 Retry Loading
            </button>
          </div>
        </div>

        <div className="fallback-footer">
          <p>💡 <strong>For Developers:</strong> Check the browser console for detailed error information</p>
          <p>🔧 Ensure the remote micro-frontend is built and served at the expected URL</p>
        </div>
      </div>
    </div>
  );
};

export default FederationFallback;
