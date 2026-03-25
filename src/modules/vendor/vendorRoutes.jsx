import React, { lazy, Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';
import ClientLayout from '../../layouts/ClientLayout';

// ─── Lazy-load all vendor pages ───────────────────────────────────────────────
const VendorDashboard   = lazy(() => import('./pages/VendorDashboard'));
const PaymentTracking   = lazy(() => import('./pages/PaymentTracking'));
const VendorMeetings    = lazy(() => import('./pages/VendorMeetings'));
const VendorReachOut    = lazy(() => import('./pages/VendorReachOut'));
const VendorFeedback    = lazy(() => import('./pages/VendorFeedback'));
const VendorPublication = lazy(() => import('./pages/VendorPublication'));

// ─── Vendor Routes ────────────────────────────────────────────────────────────
// Uses the same ClientLayout (Navbar + Sidebar) — no duplicate layout needed.
// Sidebar will render vendor menu items based on the active role derived from the URL.

const VendorRoutes = () => (
  <Route path="/vendor" element={<ClientLayout role="vendor" />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard"        element={<VendorDashboard />} />
    <Route path="payment-tracking" element={<PaymentTracking />} />
    <Route path="meetings"         element={<VendorMeetings />} />
    <Route path="reach-out"        element={<VendorReachOut />} />
    <Route path="feedback"         element={<VendorFeedback />} />
    <Route path="publication"      element={<VendorPublication />} />
  </Route>
);

export default VendorRoutes;
