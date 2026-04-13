import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";

const BackgroundLayer = () => {
  const { scrollY } = useScroll();
  const scaleParallax = useTransform(scrollY, [0, 1000], [1, 1.2]);

  return (
    <motion.div className="data-flow-bg w-full" style={{ scale: scaleParallax }} />
  );
};

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoadingState, setShowLoadingState] = useState(false);

  useEffect(() => {
    let timeout;
    if (loading) {
      timeout = setTimeout(() => setShowLoadingState(true), 300);
    } else {
      setShowLoadingState(false);
    }
    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === "SIGNED_OUT") {
        window.location.replace("/role-selection");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <BackgroundLayer />
      <AnimatePresence>{showLoadingState && <LoadingScreen />}</AnimatePresence>
      {!loading && (
        <Routes>
          {/* Unauthenticated Routes */}
          <Route path="/" element={<Navigate to="/role-selection" replace />} />
          <Route
            path="/role-selection"
            element={
              !session ? <Landing /> : <Navigate to="/student/dashboard" />
            }
          />
          <Route
            path="/student/login"
            element={
              !session ? <StudentLogin /> : <Navigate to="/student/dashboard" />
            }
          />
          <Route
            path="/admin/login"
            element={
              !session ? <AdminLogin /> : <Navigate to="/admin/dashboard" />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
