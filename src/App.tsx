// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkSpace from './pages/workspace';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorkSpace />} />
      </Routes>
    </Router>
  );
}

export default App;
