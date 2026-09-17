import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, ChevronDown, ShieldCheck, Users } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import type { ChamaMembership, UserRole } from '../../../shared/mockData';
import type { WorkspaceOption } from '../../providers/AuthContext';
import { colors } from '../../../theme/colors';
import { radii, shadows, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

interface ContextSwitcherProps {
  activeMembership: ChamaMembership | null;
  activeRole: UserRole;
  memberships: ChamaMembership[];
  workspaces: WorkspaceOption[];
  onSelectChama: (chamaId: number) => void;
  onSelectWorkspace: (role: UserRole) => void;
}

export function ContextSwitcher({ activeMembership, activeRole, memberships, workspaces, onSelectChama, onSelectWorkspace }: ContextSwitcherProps) {
  const [open, setOpen] = useState<'chama' | 'workspace' | null>(null);
  const currentWorkspace = workspaces.find((item) => item.role === activeRole)?.label ?? (activeRole === 'superadmin' ? 'Platform Administration' : 'Member View');
  const activeChamaLabel = activeMembership?.chamaName ?? (activeRole === 'superadmin' ? 'M-Duara Platform' : 'Select a Chama');

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>WORKING CONTEXT</Text>
      <View style={styles.anchor}>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: open === 'chama' }} onPress={() => setOpen((value) => value === 'chama' ? null : 'chama')} style={({ pressed }) => [styles.control, pressed && styles.pressed]}>
          <View style={styles.controlCopy}>
            <Text style={styles.controlLabel}>Active Chama</Text>
            <Text numberOfLines={1} style={styles.controlValue}>{activeChamaLabel}</Text>
          </View>
          <ChevronDown color={colors.textMuted} size={16} />
        </Pressable>
        {open === 'chama' ? (
          <View style={styles.menu}>
            {memberships.filter((item) => item.status === 'active').map((membership) => (
              <Pressable key={membership.chamaId} accessibilityRole="button" accessibilityState={{ selected: membership.chamaId === activeMembership?.chamaId }} onPress={() => { onSelectChama(membership.chamaId); setOpen(null); }} style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
                <View style={styles.menuIcon}><Users color={colors.primary} size={16} /></View>
                <View style={styles.menuCopy}>
                  <Text style={styles.menuTitle}>{membership.chamaName}</Text>
                  <View style={styles.badges}>
                    <Badge variant="neutral">Member</Badge>
                    {membership.officialRole ? <Badge variant="brand">{membership.officialRole === 'chairperson' ? 'Chairperson' : membership.officialRole[0].toUpperCase() + membership.officialRole.slice(1)}</Badge> : null}
                  </View>
                </View>
                {membership.chamaId === activeMembership?.chamaId ? <Check color={colors.success} size={17} /> : null}
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.anchor}>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: open === 'workspace' }} onPress={() => setOpen((value) => value === 'workspace' ? null : 'workspace')} style={({ pressed }) => [styles.control, pressed && styles.pressed]}>
          <View style={styles.controlCopy}>
            <Text style={styles.controlLabel}>Workspace</Text>
            <Text numberOfLines={1} style={styles.controlValue}>{currentWorkspace}</Text>
          </View>
          <ChevronDown color={colors.textMuted} size={16} />
        </Pressable>
        {open === 'workspace' ? (
          <View style={styles.menu}>
            {workspaces.map((workspace) => (
              <Pressable key={workspace.role} accessibilityRole="button" accessibilityState={{ selected: workspace.role === activeRole }} onPress={() => { onSelectWorkspace(workspace.role); setOpen(null); }} style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
                <View style={styles.menuIcon}>{workspace.role === 'member' ? <Users color={colors.primary} size={16} /> : <ShieldCheck color={colors.primary} size={16} />}</View>
                <View style={styles.menuCopy}>
                  <Text style={styles.menuTitle}>{workspace.label}</Text>
                  <Text style={styles.menuSubtitle}>{workspace.role === 'member' ? 'Your own savings and membership activity' : workspace.role === 'superadmin' ? 'Platform-wide administration' : `Official duties for ${activeMembership?.chamaName ?? 'the active Chama'}`}</Text>
                </View>
                {workspace.role === activeRole ? <Check color={colors.success} size={17} /> : null}
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { position: 'relative', width: '100%', zIndex: 40 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  control: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 58, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  controlCopy: { flex: 1, gap: 2, minWidth: 0 },
  controlLabel: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.semibold },
  controlValue: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold },
  kicker: { color: colors.textSubtle, fontSize: 10, fontWeight: typography.weights.bold, letterSpacing: 1 },
  menu: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, gap: 2, left: 0, padding: spacing.xs, position: 'absolute', right: 0, top: 64, width: '100%', ...shadows.md },
  menuCopy: { flex: 1, minWidth: 0 },
  menuIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.sm, height: 34, justifyContent: 'center', width: 34 },
  menuItem: { alignItems: 'center', borderRadius: radii.sm, flexDirection: 'row', gap: spacing.sm, padding: spacing.sm },
  menuItemPressed: { backgroundColor: colors.surfaceMuted },
  menuSubtitle: { color: colors.textMuted, fontSize: typography.sizes.caption, lineHeight: 16, marginTop: 2 },
  menuTitle: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.semibold },
  pressed: { opacity: 0.9 },
  wrap: { gap: spacing.sm, width: '100%' },
});
