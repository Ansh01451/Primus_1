import { apiSlice } from '../../../services/apiSlice';

// ─── Vendor-specific API endpoints (injected into existing apiSlice) ───────────
// This avoids creating a new store — all endpoints live in the same RTK Query cache.

export const vendorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Vendor Meetings — different endpoint than client meetings
    getVendorMeetings: builder.query({
      query: () => 'vendor/meetings',
    }),

    // Vendor Reach Out — submits ticket to a vendor-specific endpoint
    getVendorReachOut: builder.query({
      query: () => 'vendor/support-tickets',
    }),
    submitVendorReachOut: builder.mutation({
      query: (ticketData) => ({
        url: 'vendor/support-tickets',
        method: 'POST',
        body: ticketData,
      }),
    }),

    // Vendor Feedback — vendor submits feedback on engagements
    getVendorFeedback: builder.query({
      query: () => 'vendor/feedback',
    }),
    submitVendorFeedback: builder.mutation({
      query: (feedbackData) => ({
        url: 'vendor/feedback',
        method: 'POST',
        body: feedbackData,
      }),
    }),

    // Vendor Publications — same underlying data API as client publications
    getVendorPublications: builder.query({
      query: () => 'primus/in-news', // same API as client — per requirements
    }),

    // Payment Tracking — vendor-specific
    getPaymentTracking: builder.query({
      query: () => 'vendor/payments',
    }),

    // Vendor Dashboard summary
    getVendorDashboard: builder.query({
      query: () => 'vendor/dashboard',
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVendorMeetingsQuery,
  useGetVendorReachOutQuery,
  useSubmitVendorReachOutMutation,
  useGetVendorFeedbackQuery,
  useSubmitVendorFeedbackMutation,
  useGetVendorPublicationsQuery,
  useGetPaymentTrackingQuery,
  useGetVendorDashboardQuery,
} = vendorApiSlice;
