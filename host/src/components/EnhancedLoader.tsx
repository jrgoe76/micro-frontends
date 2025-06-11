import React, { useState, useEffect } from 'react';
import type { AppId } from '../types/index.ts';
import './EnhancedLoader.css';

interface LoadingStage {
  id: string;
  message: string;
  duration: number; // in milliseconds
  icon: string;
}

interface EnhancedLoaderProps {
  appId: AppId;
  appName: string;
  loadingType: 'federation' | 'local';
  onTimeout?: () => void;
  timeoutMs?: number;
}

const EnhancedLoader: React.FC<EnhancedLoaderProps> = ({
  appId,
  appName,
  loadingType,
  onTimeout,
  timeoutMs = 15000 // 15 second timeout
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Define loading stages based on type
  const loadingStages: LoadingStage[] = loadingType === 'federation' 
    ? [
        { id: 'connecting', message: 'Connecting to remote micro-frontend...', duration: 2000, icon: '🌐' },
        { id: 'fetching', message: 'Fetching federation entry point...', duration: 2000, icon: '📡' },
        { id: 'loading', message: 'Loading federated component...', duration: 2000, icon: '📦' },
        { id: 'initializing', message: 'Initializing component...', duration: 1000, icon: '⚡' }
      ]
    : [
        { id: 'loading', message: 'Loading local micro-frontend...', duration: 1500, icon: '📂' },
        { id: 'importing', message: 'Importing component module...', duration: 1500, icon: '📥' },
        { id: 'initializing', message: 'Initializing component...', duration: 1000, icon: '⚡' }
      ];

  // Update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  // Handle stage progression
  useEffect(() => {
    if (currentStage >= loadingStages.length) return;

    const stage = loadingStages[currentStage];
    const timer = setTimeout(() => {
      if (currentStage < loadingStages.length - 1) {
        setCurrentStage(prev => prev + 1);
      }
    }, stage.duration);

    return () => clearTimeout(timer);
  }, [currentStage, loadingStages]);

  // Handle progress calculation
  useEffect(() => {
    const totalDuration = loadingStages.reduce((sum, stage) => sum + stage.duration, 0);
    const completedDuration = loadingStages
      .slice(0, currentStage)
      .reduce((sum, stage) => sum + stage.duration, 0);
    
    const currentStageDuration = loadingStages[currentStage]?.duration || 0;
    const stageProgress = Math.min(elapsedTime - completedDuration, currentStageDuration);
    
    const totalProgress = (completedDuration + stageProgress) / totalDuration * 100;
    setProgress(Math.min(totalProgress, 95)); // Cap at 95% until actual loading completes
  }, [currentStage, elapsedTime, loadingStages]);

  // Handle timeout
  useEffect(() => {
    const timeoutTimer = setTimeout(() => {
      if (onTimeout) {
        onTimeout();
      }
    }, timeoutMs);

    return () => clearTimeout(timeoutTimer);
  }, [onTimeout, timeoutMs]);

  const currentStageData = loadingStages[currentStage] || loadingStages[loadingStages.length - 1];
  const formattedElapsedTime = (elapsedTime / 1000).toFixed(1);

  return (
    <div className="enhanced-loader" role="status" aria-live="polite">
      <div className="loader-container">
        {/* Header */}
        <div className="loader-header">
          <div className="loader-icon">
            {loadingType === 'federation' ? '🌐' : '📦'}
          </div>
          <h2>Loading {appName}</h2>
          <div className="loader-type-badge">
            {loadingType === 'federation' ? 'Module Federation' : 'Dynamic Import'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>
          <div className="progress-text">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Current Stage */}
        <div className="current-stage">
          <div className="stage-icon">{currentStageData.icon}</div>
          <div className="stage-message">{currentStageData.message}</div>
        </div>

        {/* Stage Indicators */}
        <div className="stage-indicators">
          {loadingStages.map((stage, index) => (
            <div
              key={stage.id}
              className={`stage-indicator ${
                index < currentStage ? 'completed' : 
                index === currentStage ? 'active' : 'pending'
              }`}
              title={stage.message}
            >
              <div className="indicator-icon">{stage.icon}</div>
              <div className="indicator-label">{stage.message}</div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="performance-metrics">
          <div className="metric">
            <span className="metric-label">Loading Time:</span>
            <span className="metric-value">{formattedElapsedTime}s</span>
          </div>
          <div className="metric">
            <span className="metric-label">Target:</span>
            <span className="metric-value">{appId.toUpperCase()}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Type:</span>
            <span className="metric-value">
              {loadingType === 'federation' ? 'Remote' : 'Local'}
            </span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="loading-animation">
          <div className="pulse-ring"></div>
          <div className="pulse-ring delay-1"></div>
          <div className="pulse-ring delay-2"></div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoader;
