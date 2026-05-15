import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import RotaPage from './pages/RotaPage';
import StaffPage from './pages/StaffPage';
import MenuPage from './pages/MenuPage';
import AwardsPage from './pages/AwardsPage';
import HygienePage from './pages/HygienePage';
import { storage } from './utils/storage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = storage.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/rota" element={<ProtectedRoute><RotaPage /></ProtectedRoute>} />
          <Route path="/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
          <Route path="/awards" element={<ProtectedRoute><AwardsPage /></ProtectedRoute>} />
          <Route path="/hygiene" element={<ProtectedRoute><HygienePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}