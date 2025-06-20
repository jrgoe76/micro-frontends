import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SecurityProvider, useSecurity } from './security';
import Welcome from './components/Welcome';
import RouterLayout from './components/RouterLayout';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLoading from './components/AuthLoading';
import './App.css';

// Inner App component that uses auth context
const AppRoutes: React.FC = () => {
  const { isLoading } = useSecurity();

  // Show loading screen while authentication is being initialized
  if (isLoading) {
    return <AuthLoading message="Initializing authentication..." />;
  }

  return (
    <Routes>
      {/* Welcome page at root path - always accessible */}
      <Route path="/" element={<Welcome />} />

      {/* Protected micro-frontend routes */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <RouterLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <RouterLayout />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App component with providers
const App: React.FC = () => {
  return (
    <SecurityProvider>
      <Router>
        <AppRoutes />
      </Router>
    </SecurityProvider>
  );
};

export default App;
