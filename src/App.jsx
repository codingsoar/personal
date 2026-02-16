import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import useThemeStore from './stores/useThemeStore';
import { useAuthStore } from './stores/useAuthStore';
import StudentLoginPage from './pages/StudentLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CourseSelectPage from './pages/CourseSelectPage';
import StageMapPage from './pages/StageMapPage';
import StagePage from './pages/StagePage';
import MissionPage from './pages/MissionPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function ProtectedRoute({ children, adminOnly }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/courses" />;
  return children;
}

export default function App() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <HeroUIProvider>
      <div className={isDark ? 'dark' : ''} style={{ minHeight: '100vh' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StudentLoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/courses" element={<ProtectedRoute><CourseSelectPage /></ProtectedRoute>} />
            <Route path="/course/:courseId" element={<ProtectedRoute><StageMapPage /></ProtectedRoute>} />
            <Route path="/course/:courseId/stage/:stageId" element={<ProtectedRoute><StagePage /></ProtectedRoute>} />
            <Route path="/course/:courseId/stage/:stageId/mission/:difficulty" element={<ProtectedRoute><MissionPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </div>
    </HeroUIProvider>
  );
}
