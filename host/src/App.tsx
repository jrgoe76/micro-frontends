import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RouterLayout from './components/RouterLayout';
import NotFound from './components/NotFound';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Root path redirects to app1 */}
        <Route path="/" element={<Navigate to="/app1" replace />} />

        {/* Micro-frontend routes */}
        <Route path="/app1" element={<RouterLayout />} />
        <Route path="/users" element={<RouterLayout />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
