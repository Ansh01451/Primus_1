import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import Loader from './components/ui/Loader';

// ─── Client Pages (lazy) ───────────────────────────────────────────────────────
const Dashboard       = lazy(() => import('./modules/client/dashboard/pages/DashboardPage'));
const ProjectOverview = lazy(() => import('./modules/client/dashboard/pages/ProjectOverviewPage'));
const Teams           = lazy(() => import('./modules/client/teams/pages/TeamsPage'));
const Meetings        = lazy(() => import('./modules/client/meetings/pages/MeetingsPage'));
const ReachOut        = lazy(() => import('./modules/client/reachout/pages/ReachOutPage'));
const Feedback        = lazy(() => import('./modules/client/feedback/pages/FeedbackPage'));
const Documents       = lazy(() => import('./modules/client/documents/pages/DocumentsPage'));
const Publications    = lazy(() => import('./modules/client/publications/pages/PublicationsPage'));
const Login           = lazy(() => import('./modules/auth/pages/LoginPage'));

// ─── Vendor Pages (lazy) ───────────────────────────────────────────────────────
const VendorDashboard   = lazy(() => import('./modules/vendor/pages/VendorDashboard'));
const PaymentTracking   = lazy(() => import('./modules/vendor/pages/PaymentTracking'));
const VendorMeetings    = lazy(() => import('./modules/vendor/pages/VendorMeetings'));
const VendorReachOut    = lazy(() => import('./modules/vendor/pages/VendorReachOut'));
const VendorFeedback    = lazy(() => import('./modules/vendor/pages/VendorFeedback'));
const VendorPublication = lazy(() => import('./modules/vendor/pages/VendorPublication'));

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userType = localStorage.getItem('user_type'); // 'client' | 'vendor'

  const defaultRedirect = isAuthenticated
    ? (userType === 'vendor' ? '/vendor/dashboard' : '/client/dashboard')
    : '/login';

  // Role guards — prevent vendors accessing /client/* and clients accessing /vendor/*
  const vendorGuard = isAuthenticated && userType !== 'vendor'
    ? <Navigate to="/client/dashboard" replace />
    : null;
  const clientGuard = isAuthenticated && userType === 'vendor'
    ? <Navigate to="/vendor/dashboard" replace />
    : null;

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route path="/" element={<Navigate to={defaultRedirect} replace />} />
        <Route path="/login" element={<Login />} />

        {/* ── Client Routes (blocked for vendor users) ─────────── */}
        <Route path="/client" element={clientGuard ?? <ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"      element={<Dashboard />} />
          <Route path="dashboard/:projectNo" element={<ProjectOverview />} />
          <Route path="teams"          element={<Teams />} />
          <Route path="meetings"       element={<Meetings />} />
          <Route path="reachout"       element={<ReachOut />} />
          <Route path="feedback"       element={<Feedback />} />
          <Route path="documents"      element={<Documents />} />
          <Route path="publications"   element={<Publications />} />
        </Route>

        {/* ── Vendor Routes (blocked for non-vendor users) ─────── */}
        <Route path="/vendor" element={vendorGuard ?? <ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"        element={<VendorDashboard />} />
          <Route path="payment-tracking" element={<PaymentTracking />} />
          <Route path="meetings"         element={<VendorMeetings />} />
          <Route path="reach-out"        element={<VendorReachOut />} />
          <Route path="feedback"         element={<VendorFeedback />} />
          <Route path="publication"      element={<VendorPublication />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;

