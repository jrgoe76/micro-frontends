import React from 'react';
import type { AppId, NavigationItem } from '../types/index.ts';
import './Navigation.css';

interface NavigationProps {
  activeApp: AppId;
  onAppChange: (appId: AppId) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeApp, onAppChange }) => {
  const navigationItems: NavigationItem[] = [
    { id: 'app1', label: 'App 1', path: '/app1' },
    { id: 'app2', label: 'App 2', path: '/app2' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>Micro-Frontend Host</h2>
        </div>
        <ul className="nav-menu">
          {navigationItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${activeApp === item.id ? 'active' : ''}`}
                onClick={() => onAppChange(item.id)}
                aria-current={activeApp === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
