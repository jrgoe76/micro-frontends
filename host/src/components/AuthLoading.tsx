import React from 'react';
import './AuthLoading.css';

interface AuthLoadingProps {
  message?: string;
}

const AuthLoading: React.FC<AuthLoadingProps> = ({ 
  message = 'Initializing authentication...' 
}) => {
  return (
    <div className="auth-loading-overlay">
      <div className="auth-loading-container">
        <div className="auth-loading-spinner"></div>
        <h2>🔐 Authentication</h2>
        <p>{message}</p>
        <div className="auth-loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default AuthLoading;
