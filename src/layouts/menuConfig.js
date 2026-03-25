import { LayoutDashboard, Users, Video, Send, MessageSquare, Folder, BookOpen } from 'lucide-react';

export const clientMenuConfig = [
  {
    title: 'Dashboard',
    path: '/client/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Teams',
    path: '/client/teams',
    icon: Users
  },
  {
    title: 'Meetings',
    path: '/client/meetings',
    icon: Video
  },
  {
    title: 'Reach Out',
    path: '/client/reachout',
    icon: Send
  },
  {
    title: 'Feedback',
    path: '/client/feedback',
    icon: MessageSquare
  },
  {
    title: 'Documents',
    path: '/client/documents',
    icon: Folder
  },
  {
    title: 'Publications',
    path: '/client/publications',
    icon: BookOpen
  }
];
