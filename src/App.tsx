import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import QuestPage from './pages/QuestPage';
import './App.css';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === 'student' ? '/student' : '/professor'} replace /> : <LandingPage />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === 'student' ? '/student' : '/professor'} replace />} />
      
      <Route 
        path="/student" 
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/professor" 
        element={
          <ProtectedRoute requiredRole="professor">
            <ProfessorDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/quest/:questId" 
        element={
          <ProtectedRoute requiredRole="student">
            <QuestPage />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

