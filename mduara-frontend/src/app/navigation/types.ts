import type { LucideIcon } from 'lucide-react-native';

import type { NotificationItem, VerifiedTokenPayload } from '../../shared/mockData';

export type AppRole = 'superadmin' | 'chair' | 'secretary' | 'treasurer' | 'member' | 'guest';

export type AppPath =
  | '/dashboard'
  | '/my-chama'
  | '/payments'
  | '/contributions'
  | '/loans'
  | '/members'
  | '/support'
  | '/reports'
  | '/notifications'
  | '/settings'
  | '/profile'
  | '/chair/dashboard'
  | '/chair/recruitment'
  | '/chair/applications'
  | '/secretary/dashboard'
  | '/secretary/members'
  | '/secretary/applications'
  | '/secretary/announcements'
  | '/treasurer/dashboard'
  | '/treasurer/monitor'
  | '/admin/dashboard'
  | '/admin/users'
  | '/admin/chamas'
  | '/admin/payments'
  | '/admin/health'
  | '/admin/audit-logs';

export interface NavItem { icon: LucideIcon; label: string; path: AppPath; permission?: string; showInMobile?: boolean; }
export interface RouteMetric { title: string; value: string; subtext?: string; }
export interface RouteSection { heading: string; body: string; badge?: string; }
export interface RouteContent { breadcrumbs: string[]; searchPlaceholder: string; }
export interface RouteScreenProps { notifications: NotificationItem[]; query: string; unreadNotifications: number; user: VerifiedTokenPayload; onNavigate: (path: AppPath) => void; }
