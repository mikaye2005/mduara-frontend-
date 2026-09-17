import {
  Activity,
  Bell,
  BookOpenCheck,
  Building2,
  CircleDollarSign,
  ClipboardList,
  FileBarChart,
  Gauge,
  HandCoins,
  Headphones,
  Home,
  Megaphone,
  ReceiptText,
  Settings,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
  Users,
  WalletCards,
} from 'lucide-react-native';

import type { BadgeVariant } from '../../components/ui/Badge';
import type { AppPath, AppRole, NavItem, RouteContent } from './types';

const shared = {
  support: { icon: Headphones, label: 'Support Tickets', path: '/support' as AppPath, showInMobile: false },
  reports: { icon: FileBarChart, label: 'Reports', path: '/reports' as AppPath, showInMobile: false },
  notifications: { icon: Bell, label: 'Notifications', path: '/notifications' as AppPath, showInMobile: false },
  settings: { icon: Settings, label: 'Settings', path: '/settings' as AppPath, showInMobile: false },
  profile: { icon: UserRound, label: 'My Profile', path: '/profile' as AppPath, showInMobile: false },
} satisfies Record<string, NavItem>;

export const roleNavigation: Record<AppRole, NavItem[]> = {
  superadmin: [
    { icon: Gauge, label: 'Dashboard', path: '/admin/dashboard', showInMobile: true },
    { icon: Users, label: 'Users', path: '/admin/users', showInMobile: true },
    { icon: Building2, label: 'Chamas', path: '/admin/chamas', showInMobile: true },
    { icon: CircleDollarSign, label: 'Payments', path: '/admin/payments', showInMobile: true },
    shared.support,
    shared.reports,
    shared.notifications,
    { icon: Activity, label: 'System Health', path: '/admin/health', showInMobile: false },
    shared.settings,
    shared.profile,
  ],
  chair: [
    { icon: Gauge, label: 'Dashboard', path: '/chair/dashboard', showInMobile: true },
    { icon: UserRoundCheck, label: 'Recruitment', path: '/chair/recruitment', showInMobile: true },
    { icon: ClipboardList, label: 'Applications', path: '/chair/applications', showInMobile: true },
    { icon: Users, label: 'Members', path: '/members', showInMobile: true },
    { icon: WalletCards, label: 'Contributions', path: '/contributions', showInMobile: false },
    shared.support,
    shared.reports,
    shared.notifications,
    shared.settings,
    shared.profile,
  ],
  secretary: [
    { icon: Gauge, label: 'Dashboard', path: '/secretary/dashboard', showInMobile: true },
    { icon: Users, label: 'Member Register', path: '/secretary/members', showInMobile: true },
    { icon: ClipboardList, label: 'Applications', path: '/secretary/applications', showInMobile: true },
    { icon: Megaphone, label: 'Announcements', path: '/secretary/announcements', showInMobile: true },
    shared.support,
    shared.reports,
    shared.notifications,
    shared.settings,
    shared.profile,
  ],
  treasurer: [
    { icon: Gauge, label: 'Dashboard', path: '/treasurer/dashboard', showInMobile: true },
    { icon: WalletCards, label: 'Contributions', path: '/contributions', showInMobile: true },
    { icon: HandCoins, label: 'Financial Monitor', path: '/treasurer/monitor', showInMobile: true },
    shared.support,
    shared.reports,
    shared.notifications,
    shared.settings,
    shared.profile,
  ],
  member: [
    { icon: Home, label: 'Dashboard', path: '/dashboard', showInMobile: true },
    { icon: Building2, label: 'My Chama', path: '/my-chama', showInMobile: true },
    { icon: ReceiptText, label: 'Payments & Contributions', path: '/payments', showInMobile: true },
    { icon: Users, label: 'Members', path: '/members', showInMobile: true },
    shared.support,
    shared.reports,
    shared.notifications,
    shared.settings,
    shared.profile,
  ],
  guest: [],
};

export const startPage: Record<AppRole, AppPath | null> = {
  superadmin: '/admin/dashboard',
  chair: '/chair/dashboard',
  secretary: '/secretary/dashboard',
  treasurer: '/treasurer/dashboard',
  member: '/dashboard',
  guest: null,
};

export function normalizeAppRole(role?: string | null, isPlatformAdmin = false): AppRole {
  if (isPlatformAdmin || role === 'super_admin' || role === 'superadmin') return 'superadmin';
  if (role === 'chairperson' || role === 'chair') return 'chair';
  if (role === 'secretary') return 'secretary';
  if (role === 'treasurer') return 'treasurer';
  if (role === 'member') return 'member';
  return 'guest';
}

export function getRoleNavItems(role: AppRole): NavItem[] {
  return roleNavigation[role];
}

export function isPathAllowed(path: AppPath, role: AppRole): boolean {
  return roleNavigation[role].some((item) => item.path === path);
}

export function getFallbackPath(role: AppRole): AppPath {
  return startPage[role] ?? '/dashboard';
}

export const roleLabelMap: Record<AppRole, string> = {
  superadmin: 'Super Admin',
  chair: 'Chairperson',
  secretary: 'Secretary',
  treasurer: 'Treasurer',
  member: 'Member',
  guest: 'Guest',
};

export const roleBadgeVariantMap: Record<AppRole, BadgeVariant> = {
  superadmin: 'danger',
  chair: 'brand',
  secretary: 'info',
  treasurer: 'warning',
  member: 'success',
  guest: 'neutral',
};

const defaultSearch = 'Search this workspace';
const route = (title: string, searchPlaceholder = defaultSearch): RouteContent => ({ breadcrumbs: ['M-Duara', title], searchPlaceholder });

export const routeContentMap: Record<AppPath, RouteContent> = {
  '/dashboard': route('Dashboard', 'Search your Chama activity'),
  '/my-chama': route('My Chama', 'Search rules, members, or transactions'),
  '/payments': route('Payments & Contributions', 'Search transaction ID, date, or status'),
  '/contributions': route('Contributions', 'Search member, receipt, or contribution cycle'),
  '/loans': route('Loans', 'Search borrower, loan code, or repayment status'),
  '/members': route('Members', 'Search member, phone, role, or status'),
  '/support': route('Support Tickets', 'Search ticket ID, category, or subject'),
  '/reports': route('Reports', 'Search reports and statements'),
  '/notifications': route('Notifications', 'Search notification history'),
  '/settings': route('Settings', 'Search settings'),
  '/profile': route('My Profile', 'Search profile settings'),
  '/chair/dashboard': route('Chair Dashboard', 'Search members, applications, or records'),
  '/chair/recruitment': route('Recruitment', 'Search recruitment settings'),
  '/chair/applications': route('Applications', 'Search applicants by name or status'),
  '/secretary/dashboard': route('Secretary Dashboard', 'Search member records or meetings'),
  '/secretary/members': route('Member Register', 'Search member register'),
  '/secretary/applications': route('Applications', 'Search applications'),
  '/secretary/announcements': route('Announcements', 'Search announcements or meetings'),
  '/treasurer/dashboard': route('Treasurer Dashboard', 'Search financial activity'),
  '/treasurer/monitor': route('Financial Monitor', 'Search transaction or reconciliation reference'),
  '/admin/dashboard': route('Platform Dashboard', 'Search platform records'),
  '/admin/users': route('Users', 'Search users by name, phone, or status'),
  '/admin/chamas': route('Chamas', 'Search Chamas by name, type, or status'),
  '/admin/payments': route('Payments', 'Search payment or provider reference'),
  '/admin/health': route('System Health', 'Search jobs, webhooks, or service events'),
  '/admin/audit-logs': route('Audit Logs', 'Search event, actor, or approval code'),
};
