import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';

// Layout & Icons
import Button from './components/ui/Button';
import BarChartIcon from './components/icons/BarChartIcon';

// Page-level Views
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import VerticalSelectionView from './views/VerticalSelectionView';
import SkillAssessmentView from './views/SkillAssessmentView';
import QuizView from './views/QuizView';
import QuizResultsView from './views/QuizResultsView';

// A wrapper to protect routes that require authentication.
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// The main application layout including the header.
const AppLayout = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-slate-900 font-sans text-slate-200 flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center space-x-3">
          <BarChartIcon />
          <h1 className="text-3xl font-bold text-slate-50">Prometheus Ascent</h1>
        </div>
        {isAuthenticated && (
          <Button onClick={logout} className="bg-red-800/50 hover:bg-red-800/80 border border-red-500/50 text-white">
            Sign Out
          </Button>
        )}
      </header>
      <main className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet /> {/* Renders the matched child route component */}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// The main App component defining all routes.
function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-slate-900 text-slate-300 text-xl">Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthView />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/select-vertical" element={<VerticalSelectionView />} />
          <Route path="/assessment/:verticalId" element={<SkillAssessmentView />} />
          <Route path="/quiz" element={<QuizView />} />
          <Route path="/quiz-results" element={<QuizResultsView />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Route>
    </Routes>
  );
}

export default App;