import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="not-found-icon">
          🔍❌
        </div>
        
        <div className="not-found-content">
          <h1>404 - Page Not Found</h1>
          <h2>Micro-Frontend Route Not Available</h2>
          
          <div className="not-found-message">
            <p className="primary-message">
              The requested micro-frontend route could not be found.
            </p>
            <p className="secondary-message">
              Please check the URL or navigate to one of the available micro-frontends.
            </p>
          </div>

          <div className="available-routes">
            <h3>Available Routes:</h3>
            <div className="route-list">
              <Link to="/app1" className="route-link">
                <div className="route-item">
                  <span className="route-icon">🌐</span>
                  <div className="route-details">
                    <span className="route-path">/app1</span>
                    <span className="route-description">Federated Task Manager</span>
                  </div>
                </div>
              </Link>
              
              <Link to="/app2" className="route-link">
                <div className="route-item">
                  <span className="route-icon">📦</span>
                  <div className="route-details">
                    <span className="route-path">/app2</span>
                    <span className="route-description">User Management System</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="not-found-actions">
            <Link to="/app1" className="home-button">
              🏠 Go to Home (App1)
            </Link>
          </div>

          <div className="not-found-info">
            <div className="info-item">
              <span className="info-label">Current URL:</span>
              <span className="info-value">{window.location.pathname}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Host Application:</span>
              <span className="info-value">Micro-Frontend Host</span>
            </div>
          </div>
        </div>

        <div className="not-found-footer">
          <p>💡 <strong>For Developers:</strong> Add new routes in the Router configuration</p>
          <p>🔧 Each micro-frontend should have its own route mapping</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
