import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from "./components/auth/Login";
import Register from "./components/auth/Register";
import FeedPage from './views/FeedPage';
import { Kids } from './components/kids/Kids';
import { UpdateKid } from './components/kids/UpdateKid';
import NewKid from './components/new-kid/NewKid';
import { AddMemory } from './components/feed/AddMemory';
import { UserProvider, useUserContext } from './contexts/UserContext';
import { KidProvider } from './contexts/KidContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, hasKids } = useUserContext();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasKids) return <Navigate to="/new-kid" replace />;

  return children;
};

const MainRoutes = () => {
  return (
    <Router className="app">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
        <Route path="/kids" element={<ProtectedRoute><Kids /></ProtectedRoute>} />
        <Route path="/update-kid" element={<ProtectedRoute><UpdateKid /></ProtectedRoute>} />
        <Route path="/new-kid" element={<ProtectedRoute><NewKid /></ProtectedRoute>} />
        <Route path="/add-memory" element={<ProtectedRoute><AddMemory /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <UserProvider>
     <KidProvider>
        <MainRoutes />
      </KidProvider>
    </UserProvider>
  );
}


export default App;
