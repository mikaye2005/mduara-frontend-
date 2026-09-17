import React, { useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { useAuth } from '../providers/AuthContext';
import { MobileBottomBar } from './components/MobileBottomBar';
import { NavigationContent } from './components/NavigationContent';
import { NavigationSidebar } from './components/NavigationSidebar';
import { TopBar } from './components/TopBar';
import { normalizeAppRole, roleBadgeVariantMap, roleLabelMap, routeContentMap } from './config';
import { useAuthorizedNavigation } from './hooks/useAuthorizedNavigation';
import { colors } from '../../theme/colors';

export function AppNavigator() {
  const { activeMembership, availableWorkspaces, notifications, selectChama, selectWorkspace, signOut, unreadNotifications, user } = useAuth();
  const { width } = useWindowDimensions();
  const isCompact = width < 768;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const appRole = normalizeAppRole(user?.role);
  const { allowedNavItems, currentPath, mobileNavItems, navigateTo } = useAuthorizedNavigation({ role: appRole });

  if (!user) return null;

  const routeContent = routeContentMap[currentPath];
  const roleLabel = roleLabelMap[appRole];
  const roleVariant = roleBadgeVariantMap[appRole];
  const handleNavigate = (path: typeof currentPath) => { navigateTo(path); setIsSidebarOpen(false); setIsNotificationOpen(false); setIsProfileOpen(false); };

  return (
    <View style={styles.shell}>
      {isCompact && isSidebarOpen ? <Pressable style={styles.overlay} onPress={() => setIsSidebarOpen(false)} /> : null}
      <NavigationSidebar
        activeMembership={activeMembership}
        activeRole={user.role}
        currentPath={currentPath}
        isCollapsed={isSidebarCollapsed}
        isCompact={isCompact}
        isOpen={isSidebarOpen}
        memberships={user.memberships}
        onNavigate={handleNavigate}
        onSelectChama={selectChama}
        onSelectWorkspace={selectWorkspace}
        onToggleCollapse={() => setIsSidebarCollapsed((value) => !value)}
        user={user}
        workspaces={availableWorkspaces}
        items={allowedNavItems}
      />
      <View style={styles.mainPane}>
        <TopBar breadcrumbs={routeContent.breadcrumbs} isCompact={isCompact} isNotificationOpen={isNotificationOpen} isProfileOpen={isProfileOpen} onOpenSidebar={() => setIsSidebarOpen(true)} onSignOut={signOut} onToggleNotifications={() => { setIsNotificationOpen((value) => !value); setIsProfileOpen(false); }} onToggleProfile={() => { setIsProfileOpen((value) => !value); setIsNotificationOpen(false); }} query={query} roleBadgeVariant={roleVariant} roleLabel={roleLabel} searchPlaceholder={routeContent.searchPlaceholder} setQuery={setQuery} notifications={notifications} unreadNotifications={unreadNotifications} user={user} />
        <NavigationContent path={currentPath} routeScreenProps={{ notifications, onNavigate: handleNavigate, query, unreadNotifications, user }} />
        {isCompact ? <MobileBottomBar currentPath={currentPath} items={mobileNavItems} onNavigate={handleNavigate} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ mainPane: { flex: 1 }, overlay: { backgroundColor: 'rgba(15, 23, 42, 0.4)', bottom: 0, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 10 }, shell: { backgroundColor: colors.background, flex: 1, flexDirection: 'row' } });
