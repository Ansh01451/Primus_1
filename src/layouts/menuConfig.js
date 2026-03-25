import {
  LayoutDashboard, Users, Video, Send, MessageSquare, Folder,
  BookOpen, CreditCard
} from 'lucide-react';

// ─── Client Menu ──────────────────────────────────────────────────────────────
export const clientMenuConfig = [
  { title: 'Dashboard',    path: '/client/dashboard',    icon: LayoutDashboard },
  { title: 'Teams',        path: '/client/teams',        icon: Users           },
  { title: 'Meetings',     path: '/client/meetings',     icon: Video           },
  { title: 'Reach Out',    path: '/client/reachout',     icon: Send            },
  { title: 'Feedback',     path: '/client/feedback',     icon: MessageSquare   },
  { title: 'Documents',    path: '/client/documents',    icon: Folder          },
  { title: 'Publications', path: '/client/publications', icon: BookOpen        },
];

// ─── Vendor Menu ──────────────────────────────────────────────────────────────
export const vendorMenuConfig = [
  { title: 'Dashboard',        path: '/vendor/dashboard',        icon: LayoutDashboard },
  { title: 'Payment Tracking', path: '/vendor/payment-tracking', icon: CreditCard      },
  { title: 'Meetings',         path: '/vendor/meetings',         icon: Video           },
  { title: 'Reach Out',        path: '/vendor/reach-out',        icon: Send            },
  { title: 'Feedback',         path: '/vendor/feedback',         icon: MessageSquare   },
  { title: 'Publication',      path: '/vendor/publication',      icon: BookOpen        },
];

// ─── Role-to-config map ───────────────────────────────────────────────────────
export const menuConfigByRole = {
  client: clientMenuConfig,
  vendor: vendorMenuConfig,
};
