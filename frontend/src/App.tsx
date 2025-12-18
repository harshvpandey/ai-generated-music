import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { SubmitWord } from './pages/SubmitWord';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/submit" element={<SubmitWord />} />
            </Routes>
        </Router>
    );
}

export default App;
