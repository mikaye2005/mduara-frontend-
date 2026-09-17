import React from 'react';

import { AdminChamasScreen } from '../../../features/admin/screens/AdminChamasScreen';
import { AdminDashboardScreen } from '../../../features/admin/screens/AdminDashboardScreen';
import { AdminPaymentsScreen } from '../../../features/admin/screens/AdminPaymentsScreen';
import { AdminSystemHealthScreen } from '../../../features/admin/screens/AdminSystemHealthScreen';
import { AdminUsersScreen } from '../../../features/admin/screens/AdminUsersScreen';
import { AuditLogsScreen } from '../../../features/admin/screens/AuditLogsScreen';
import { ChamaMgmtScreen } from '../../../features/chama/screens/ChamaMgmtScreen';
import { ChairApplicationsScreen } from '../../../features/chama/screens/ChairApplicationsScreen';
import { ChairRecruitmentScreen } from '../../../features/chama/screens/ChairRecruitmentScreen';
import { SecretaryApplicationsScreen } from '../../../features/communication/screens/SecretaryApplicationsScreen';
import { SecretaryCommunicationsScreen } from '../../../features/communication/screens/SecretaryCommunicationsScreen';
import { SecretaryMemberRegisterScreen } from '../../../features/communication/screens/SecretaryMemberRegisterScreen';
import { ChamaContributionOverviewScreen } from '../../../features/contribution/screens/ChamaContributionOverviewScreen';
import { MyContributionsScreen } from '../../../features/contribution/screens/MyContributionsScreen';
import { TreasurerFinancialMonitorScreen } from '../../../features/contribution/screens/TreasurerFinancialMonitorScreen';
import { TreasurerReconciliationScreen } from '../../../features/contribution/screens/TreasurerReconciliationScreen';
import { LoanPortfolioScreen } from '../../../features/loan/screens/LoanPortfolioScreen';
import { MemberLoansScreen } from '../../../features/loan/screens/MemberLoansScreen';
import { UserDirectoryScreen } from '../../../features/onboarding/screens/UserDirectoryScreen';
import { MemberMultiChamaDashboard } from '../../../features/product/screens/MemberMultiChamaDashboard';
import { NotificationsScreen } from '../../../features/product/screens/NotificationsScreen';
import { ProfileScreen } from '../../../features/product/screens/ProfileScreen';
import { ReportsScreen } from '../../../features/product/screens/ReportsScreen';
import { SettingsScreen } from '../../../features/product/screens/SettingsScreen';
import { SupportTicketsScreen } from '../../../features/product/screens/SupportTicketsScreen';
import { ModuleStateScreen } from '../../../features/product/screens/ModuleStateScreen';
import { OfficialWorkspaceHomeScreen } from '../../../features/product/screens/OfficialWorkspaceHomeScreen';
import type { AppPath, RouteScreenProps } from '../types';

interface RouteScreenResolverProps extends RouteScreenProps {
  path: AppPath;
}

/**
 * Single route-to-screen resolver for the authenticated shell.
 *
 * Only routes already allowed by role navigation reach this component. Every
 * visible navigation path resolves to a concrete screen. ModuleStateScreen is
 * retained only as a defensive fallback for an unreachable path.
 */
export function RouteScreen({ notifications, onNavigate, path, query, unreadNotifications, user }: RouteScreenResolverProps) {
  switch (path) {
    // Member workspace
    case '/dashboard':
      return <MemberMultiChamaDashboard onNavigate={onNavigate} />;
    case '/my-chama':
      return <ChamaMgmtScreen query={query} unreadNotifications={unreadNotifications} user={user} />;
    case '/payments':
      return <MyContributionsScreen query={query} user={user} />;
    case '/contributions':
      return user.role === 'treasurer'
        ? <TreasurerReconciliationScreen query={query} user={user} />
        : <ChamaContributionOverviewScreen />;
    case '/loans':
      return user.role === 'member'
        ? <MemberLoansScreen query={query} user={user} />
        : <LoanPortfolioScreen query={query} user={user} />;
    case '/members':
      return <UserDirectoryScreen query={query} user={user} />;

    // Chama official workspaces
    case '/chair/dashboard':
    case '/secretary/dashboard':
    case '/treasurer/dashboard':
      return <OfficialWorkspaceHomeScreen onNavigate={onNavigate} />;
    case '/secretary/members':
      return <SecretaryMemberRegisterScreen query={query} />;
    case '/secretary/applications':
      return <SecretaryApplicationsScreen />;
    case '/secretary/announcements':
      return <SecretaryCommunicationsScreen />;
    case '/chair/recruitment':
      return <ChairRecruitmentScreen />;
    case '/chair/applications':
      return <ChairApplicationsScreen />;
    case '/treasurer/monitor':
      return <TreasurerFinancialMonitorScreen />;

    // Platform administration
    case '/admin/dashboard':
      return <AdminDashboardScreen />;
    case '/admin/users':
      return <AdminUsersScreen query={query} />;
    case '/admin/chamas':
      return <AdminChamasScreen />;
    case '/admin/payments':
      return <AdminPaymentsScreen />;
    case '/admin/health':
      return <AdminSystemHealthScreen />;
    case '/admin/audit-logs':
      return <AuditLogsScreen notifications={notifications} query={query} unreadNotifications={unreadNotifications} user={user} />;

    // Shared workspace pages
    case '/support':
      return <SupportTicketsScreen user={user} />;
    case '/reports':
      return <ReportsScreen user={user} />;
    case '/notifications':
      return <NotificationsScreen notifications={notifications} />;
    case '/settings':
      return <SettingsScreen />;
    case '/profile':
      return <ProfileScreen user={user} />;

    default: {
      const unreachablePath: never = path;
      return <ModuleStateScreen path={unreachablePath as AppPath} />;
    }
  }
}
