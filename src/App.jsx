import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { motion, useScroll, useTransform } from 'framer-motion';

const BackgroundLayer = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <motion.div 
      className="data-flow-bg w-full" 
      style={{ y: yParallax }} 
    />
  );
};

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-base)]">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <BackgroundLayer />
      <Routes>
        {/* Unauthenticated Routes */}
        <Route path="/" element={!session ? <Landing /> : <Navigate to="/student/dashboard" />} />
        <Route path="/student/login" element={!session ? <StudentLogin /> : <Navigate to="/student/dashboard" />} />
        <Route path="/admin/login" element={!session ? <AdminLogin /> : <Navigate to="/admin/dashboard" />} />

        {/* Protected Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
