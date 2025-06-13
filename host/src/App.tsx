import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import RouterLayout from './components/RouterLayout';
import NotFound from './components/NotFound';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Welcome page at root path */}
        <Route path="/" element={<Welcome />} />

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
