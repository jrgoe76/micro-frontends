import React from 'react';
import { NavLink } from 'react-router-dom';
import type { AppId, NavigationItem } from '../types/index.ts';
import './Navigation.css';

interface NavigationProps {
  activeApp: AppId;
  onAppChange: (appId: AppId) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeApp, onAppChange }) => {
  const navigationItems: NavigationItem[] = [
    { id: 'tasks', label: 'Tasks', path: '/tasks' },
    { id: 'users', label: 'Users', path: '/users' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>Micro-Frontends</h2>
        </div>
        <ul className="nav-menu">
          {navigationItems.map((item) => (
            <li key={item.id} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => onAppChange(item.id)}
                aria-current={activeApp === item.id ? 'page' : undefined}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
