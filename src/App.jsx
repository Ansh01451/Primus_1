import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';

// Lazy loading all client pages
const Dashboard = lazy(() => import('./modules/client/dashboard/pages/DashboardPage'));
const ProjectOverview = lazy(() => import('./modules/client/dashboard/pages/ProjectOverviewPage'));
const Teams = lazy(() => import('./modules/client/teams/pages/TeamsPage'));
const Meetings = lazy(() => import('./modules/client/meetings/pages/MeetingsPage'));
const ReachOut = lazy(() => import('./modules/client/reachout/pages/ReachOutPage'));
const Feedback = lazy(() => import('./modules/client/feedback/pages/FeedbackPage'));
const Documents = lazy(() => import('./modules/client/documents/pages/DocumentsPage'));
const Publications = lazy(() => import('./modules/client/publications/pages/PublicationsPage'));
const Login = lazy(() => import('./modules/auth/pages/LoginPage'));

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/client/dashboard" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Client Routes */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/:projectNo" element={<ProjectOverview />} />
          <Route path="teams" element={<Teams />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="reachout" element={<ReachOut />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="documents" element={<Documents />} />
          <Route path="publications" element={<Publications />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
