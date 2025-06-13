import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Welcome.css';

const Welcome: React.FC = () => {
  const { isAuthenticated, isLoading, user, login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="welcome">
      <div className="welcome-container">
        <div className="welcome-header">
          <div className="welcome-icon">
            🚀
          </div>

          <div className="welcome-content">
            <h1>Welcome to this cool React SPA Micro-Frontends Demo!!!</h1>
            <h2>
              {isAuthenticated && user
                ? `Welcome back, ${user.firstName || user.username}!`
                : 'Explore Our Micro-Frontend Architecture'
              }
            </h2>

            <div className="welcome-description">
              <p className="primary-description">
                This application demonstrates a modern micro-frontend architecture using React 19.1,
                TypeScript, and Module Federation with Keycloak authentication.
              </p>
              <p className="secondary-description">
                {isAuthenticated
                  ? 'You are authenticated and can access all micro-frontends. Each can be developed, deployed, and scaled independently.'
                  : 'Please log in to access the micro-frontends. Each can be developed, deployed, and scaled independently while maintaining a seamless user experience.'
                }
              </p>
            </div>

            <div className="micro-frontends-showcase">
              <h3>Available Micro-Frontends:</h3>
              <div className="mf-list">
                {isAuthenticated ? (
                  <>
                    <Link to="/tasks" className="mf-link">
                      <div className="mf-card">
                        <span className="mf-icon">🌐</span>
                        <div className="mf-details">
                          <span className="mf-title">Tasks Manager</span>
                          <span className="mf-description">Federated Remote Component</span>
                          <span className="mf-tech">Module Federation + React 19.1</span>
                        </div>
                        <div className="mf-badge federation">Federation</div>
                      </div>
                    </Link>

                    <Link to="/users" className="mf-link">
                      <div className="mf-card">
                        <span className="mf-icon">📦</span>
                        <div className="mf-details">
                          <span className="mf-title">User Management</span>
                          <span className="mf-description">Local Dynamic Import</span>
                          <span className="mf-tech">Dynamic Import + React 19.1</span>
                        </div>
                        <div className="mf-badge local">Local</div>
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="mf-card mf-card--disabled">
                      <span className="mf-icon">🔒</span>
                      <div className="mf-details">
                        <span className="mf-title">Tasks Manager</span>
                        <span className="mf-description">Authentication Required</span>
                        <span className="mf-tech">Please log in to access</span>
                      </div>
                      <div className="mf-badge federation">Protected</div>
                    </div>

                    <div className="mf-card mf-card--disabled">
                      <span className="mf-icon">🔒</span>
                      <div className="mf-details">
                        <span className="mf-title">User Management</span>
                        <span className="mf-description">Authentication Required</span>
                        <span className="mf-tech">Please log in to access</span>
                      </div>
                      <div className="mf-badge local">Protected</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="welcome-features">
              <h3>Architecture Features:</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span className="feature-text">Module Federation</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔄</span>
                  <span className="feature-text">State Preservation</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🧭</span>
                  <span className="feature-text">React Router v6</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎨</span>
                  <span className="feature-text">Unified Design System</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🛡️</span>
                  <span className="feature-text">TypeScript</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span className="feature-text">Responsive Design</span>
                </div>
              </div>
            </div>

            <div className="welcome-actions">
              {isAuthenticated ? (
                <>
                  <Link to="/tasks" className="primary-button">
                    🌐 Explore Tasks (Federation)
                  </Link>
                  <Link to="/users" className="secondary-button">
                    📦 Explore Users (Local)
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="primary-button"
                  disabled={isLoading}
                >
                  {isLoading ? '🔄 Connecting...' : '🔐 Login with Keycloak'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="welcome-footer">
          <div className="tech-stack">
            <span className="tech-item">React 19.1</span>
            <span className="tech-separator">•</span>
            <span className="tech-item">TypeScript</span>
            <span className="tech-separator">•</span>
            <span className="tech-item">Vite</span>
            <span className="tech-separator">•</span>
            <span className="tech-item">Module Federation</span>
          </div>
          <p className="welcome-note">
            💡 Each micro-frontend maintains its own state and can be developed independently
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
