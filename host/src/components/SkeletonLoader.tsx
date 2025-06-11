import React from 'react';
import type { AppId } from '../types/index.ts';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  appId: AppId;
  appName: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ appId, appName }) => {
  if (appId === 'tasks') {
    // Skeleton for TaskManager (Tasks)
    return (
      <div className="skeleton-loader" aria-label={`Loading ${appName} skeleton`}>
        <div className="skeleton-container">
          {/* Header skeleton */}
          <div className="skeleton-header">
            <div className="skeleton-title"></div>
            <div className="skeleton-subtitle"></div>
          </div>

          {/* Task form skeleton */}
          <div className="skeleton-form">
            <div className="skeleton-form-row">
              <div className="skeleton-input"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>

          {/* Task list skeleton */}
          <div className="skeleton-task-list">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="skeleton-task-item">
                <div className="skeleton-checkbox"></div>
                <div className="skeleton-task-content">
                  <div className="skeleton-task-text"></div>
                  <div className="skeleton-task-meta"></div>
                </div>
                <div className="skeleton-task-actions">
                  <div className="skeleton-action-button"></div>
                  <div className="skeleton-action-button"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats skeleton */}
          <div className="skeleton-stats">
            <div className="skeleton-stat-item">
              <div className="skeleton-stat-number"></div>
              <div className="skeleton-stat-label"></div>
            </div>
            <div className="skeleton-stat-item">
              <div className="skeleton-stat-number"></div>
              <div className="skeleton-stat-label"></div>
            </div>
            <div className="skeleton-stat-item">
              <div className="skeleton-stat-number"></div>
              <div className="skeleton-stat-label"></div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (appId === 'app2') {
    // Skeleton for User Management (App2)
    return (
      <div className="skeleton-loader" aria-label={`Loading ${appName} skeleton`}>
        <div className="skeleton-container">
          {/* Header skeleton */}
          <div className="skeleton-header">
            <div className="skeleton-title"></div>
            <div className="skeleton-subtitle"></div>
          </div>

          {/* Search and controls skeleton */}
          <div className="skeleton-controls">
            <div className="skeleton-search"></div>
            <div className="skeleton-filter-buttons">
              <div className="skeleton-filter-button"></div>
              <div className="skeleton-filter-button"></div>
              <div className="skeleton-filter-button"></div>
            </div>
          </div>

          {/* User form skeleton */}
          <div className="skeleton-user-form">
            <div className="skeleton-form-grid">
              <div className="skeleton-input"></div>
              <div className="skeleton-input"></div>
              <div className="skeleton-input"></div>
              <div className="skeleton-select"></div>
            </div>
            <div className="skeleton-form-actions">
              <div className="skeleton-button"></div>
              <div className="skeleton-button secondary"></div>
            </div>
          </div>

          {/* User list skeleton */}
          <div className="skeleton-user-list">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="skeleton-user-item">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-user-info">
                  <div className="skeleton-user-name"></div>
                  <div className="skeleton-user-email"></div>
                  <div className="skeleton-user-role"></div>
                </div>
                <div className="skeleton-user-actions">
                  <div className="skeleton-action-button"></div>
                  <div className="skeleton-action-button"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="skeleton-pagination">
            <div className="skeleton-page-button"></div>
            <div className="skeleton-page-button"></div>
            <div className="skeleton-page-button active"></div>
            <div className="skeleton-page-button"></div>
            <div className="skeleton-page-button"></div>
          </div>
        </div>
      </div>
    );
  }

  // Default skeleton
  return (
    <div className="skeleton-loader" aria-label={`Loading ${appName} skeleton`}>
      <div className="skeleton-container">
        <div className="skeleton-header">
          <div className="skeleton-title"></div>
          <div className="skeleton-subtitle"></div>
        </div>
        <div className="skeleton-content">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="skeleton-content-block">
              <div className="skeleton-text-line"></div>
              <div className="skeleton-text-line short"></div>
              <div className="skeleton-text-line medium"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
