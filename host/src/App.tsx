import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RouterLayout from './components/RouterLayout';
import NotFound from './components/NotFound';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Root path redirects to tasks */}
        <Route path="/" element={<Navigate to="/tasks" replace />} />

        {/* Micro-frontend routes */}
        <Route path="/tasks" element={<RouterLayout />} />
        <Route path="/users" element={<RouterLayout />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
