import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import DSA from './pages/DSA';
import Projects from './pages/Projects';
import Hackathons from './pages/Hackathons';
import Habits from './pages/Habits';
import Skills from './pages/Skills';
import Applications from './pages/Applications';
import InterviewPrep from './pages/InterviewPrep';
import WeeklyReview from './pages/WeeklyReview';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-dark-bg overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/dsa" element={<DSA />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/weekly-review" element={<WeeklyReview />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
