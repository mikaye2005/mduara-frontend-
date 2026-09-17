import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { MduaraBrand } from '../../../components/brand/MduaraBrand';
import type { ChamaMembership, UserRole, VerifiedTokenPayload } from '../../../shared/mockData';
import type { WorkspaceOption } from '../../providers/AuthContext';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import type { AppPath, NavItem } from '../types';
import { ContextSwitcher } from './ContextSwitcher';

interface NavigationSidebarProps {
  activeMembership: ChamaMembership | null;
  activeRole: UserRole;
  currentPath: AppPath;
  isCollapsed: boolean;
  isCompact: boolean;
  isOpen: boolean;
  memberships: ChamaMembership[];
  onNavigate: (path: AppPath) => void;
  onSelectChama: (chamaId: number) => void;
  onSelectWorkspace: (role: UserRole) => void;
  onToggleCollapse: () => void;
  user: VerifiedTokenPayload;
  workspaces: WorkspaceOption[];
  items: NavItem[];
}

export function NavigationSidebar({
  activeMembership,
  activeRole,
  currentPath,
  isCollapsed,
  isCompact,
  isOpen,
  memberships,
  onNavigate,
  onSelectChama,
  onSelectWorkspace,
  onToggleCollapse,
  workspaces,
  items,
}: NavigationSidebarProps) {
  const expanded = !isCollapsed || isCompact;
  return (
    <View style={[styles.sidebar, isCollapsed && !isCompact && styles.sidebarCollapsed, isCompact && styles.sidebarMobile, isCompact && isOpen && styles.sidebarMobileOpen]}>
      <View style={styles.sidebarTop}>
        <View style={[styles.brandRow, !expanded && styles.brandRowCollapsed]}>
          <MduaraBrand variant="wordmark" width={expanded ? 150 : 48} />
        </View>

        {expanded && (activeMembership || memberships.some((membership) => membership.status === 'active')) ? (
          <View style={styles.contextWrap}>
            <ContextSwitcher
              activeMembership={activeMembership}
              activeRole={activeRole}
              memberships={memberships}
              workspaces={workspaces}
              onSelectChama={onSelectChama}
              onSelectWorkspace={onSelectWorkspace}
            />
          </View>
        ) : null}

        <View style={styles.navList}>
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.path === currentPath;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={item.path}
                onPress={() => onNavigate(item.path)}
                style={({ pressed }) => [styles.navItem, active && styles.navItemActive, pressed && styles.navItemPressed]}
              >
                <Icon color={active ? colors.primary : colors.textMuted} size={18} />
                {expanded ? <View style={styles.labelBar}><AppNavLabel active={active} label={item.label} /></View> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {!isCompact ? (
        <Pressable accessibilityLabel={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} accessibilityRole="button" style={styles.collapseButton} onPress={onToggleCollapse}>
          {isCollapsed ? <ChevronRight color={colors.textMuted} size={18} /> : <ChevronLeft color={colors.textMuted} size={18} />}
        </Pressable>
      ) : null}
    </View>
  );
}

function AppNavLabel({ active, label }: { active: boolean; label: string }) {
  return <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>;
}

const styles = StyleSheet.create({
  brandRow: { alignItems: 'center', minHeight: 70, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  brandRowCollapsed: { paddingHorizontal: spacing.sm },
  collapseButton: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, padding: spacing.md },
  contextWrap: { marginHorizontal: spacing.md, zIndex: 50 },
  labelBar: { flex: 1 },
  navItem: { alignItems: 'center', borderRadius: radii.sm, flexDirection: 'row', gap: spacing.sm, marginHorizontal: spacing.md, minHeight: 44, paddingHorizontal: spacing.md, paddingVertical: 10 },
  navItemActive: { backgroundColor: colors.primaryLight },
  navItemPressed: { opacity: 0.88 },
  navLabel: { color: colors.textMuted, fontSize: 14, fontWeight: '500' },
  navLabelActive: { color: colors.primary, fontWeight: '700' },
  navList: { gap: spacing.xs, paddingTop: spacing.md },
  sidebar: { backgroundColor: colors.surface, borderRightColor: colors.border, borderRightWidth: 1, justifyContent: 'space-between', width: 286, zIndex: 20 },
  sidebarCollapsed: { width: 78 },
  sidebarMobile: { bottom: 0, left: -300, position: 'absolute', top: 0, width: 286 },
  sidebarMobileOpen: { left: 0 },
  sidebarTop: { gap: spacing.md },
});
