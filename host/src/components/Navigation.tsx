import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSecurity } from '../security';
import type { AppId, NavigationItem } from '../types/index.ts';
import './Navigation.css';

interface NavigationProps {
  activeApp: AppId;
  onAppChange: (appId: AppId) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeApp, onAppChange }) => {
  const { isAuthenticated, user, logout } = useSecurity();

  const navigationItems: NavigationItem[] = [
    { id: 'tasks', label: 'Tasks', path: '/tasks' },
    { id: 'users', label: 'Users', path: '/users' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/" className="nav-brand-link">
            <h2>Welcome</h2>
          </NavLink>
        </div>
        <div className="nav-content">
          {isAuthenticated && (
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
          )}

          {isAuthenticated && (
            <div className="nav-user">
              <span className="nav-user-info">
                👋 {user?.firstName || user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="nav-logout-btn"
                title="Logout"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
