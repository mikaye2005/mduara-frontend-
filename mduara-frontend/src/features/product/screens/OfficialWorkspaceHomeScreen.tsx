import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, ClipboardCheck, FileText, Megaphone, ShieldCheck, Users } from 'lucide-react-native';

import { useAuth } from '../../../app/providers/AuthContext';
import type { AppPath } from '../../../app/navigation/types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

interface WorkspaceAction {
  title: string;
  body: string;
  icon: typeof Users;
  path: AppPath | null;
  availability?: 'ready' | 'overview-only';
}

interface WorkspaceCopy {
  title: string;
  description: string;
  actions: WorkspaceAction[];
}

const roleCopy: Record<'secretary' | 'chairperson' | 'treasurer', WorkspaceCopy> = {
  secretary: {
    title: 'Secretary Workspace',
    description: 'Manage the official member register, applications, communication, meetings and records for this Chama.',
    actions: [
      { title: 'Member Register', body: 'Keep the Chama register accurate and current.', icon: Users, path: '/secretary/members', availability: 'ready' },
      { title: 'Applications', body: 'Review incoming membership applications.', icon: ClipboardCheck, path: '/secretary/applications', availability: 'ready' },
      { title: 'Announcements', body: 'Publish official member communication.', icon: Megaphone, path: '/secretary/announcements', availability: 'ready' },
      { title: 'Minutes & Records', body: 'Meeting minutes and formal records will live in the dedicated meetings module.', icon: FileText, path: null, availability: 'overview-only' },
    ],
  },
  chairperson: {
    title: 'Chair Workspace',
    description: 'Lead recruitment, approvals, member administration and governance for this Chama.',
    actions: [
      { title: 'Recruitment', body: 'Control recruitment status and capacity.', icon: Users, path: '/chair/recruitment', availability: 'ready' },
      { title: 'Applications', body: 'Review and approve membership decisions.', icon: ClipboardCheck, path: '/chair/applications', availability: 'ready' },
      { title: 'Governance', body: 'Governance tools remain overview-only until the dedicated decision module is connected.', icon: ShieldCheck, path: null, availability: 'overview-only' },
      { title: 'Reports', body: 'Review Chama-level operational reports.', icon: FileText, path: '/reports', availability: 'ready' },
    ],
  },
  treasurer: {
    title: 'Treasurer Workspace',
    description: 'Reconcile member contributions and monitor Chama financial operations.',
    actions: [
      { title: 'Contributions', body: 'Reconcile received contributions.', icon: ClipboardCheck, path: '/contributions', availability: 'ready' },
      { title: 'Financial Monitor', body: 'Review liquidity and financial activity.', icon: ShieldCheck, path: '/treasurer/monitor', availability: 'ready' },
      { title: 'Statements', body: 'Prepare Chama financial records.', icon: FileText, path: '/reports', availability: 'ready' },
      { title: 'Member Status', body: 'Review privacy-safe contribution status.', icon: Users, path: '/members', availability: 'ready' },
    ],
  },
};

interface OfficialWorkspaceHomeScreenProps {
  onNavigate: (path: AppPath) => void;
}

export function OfficialWorkspaceHomeScreen({ onNavigate }: OfficialWorkspaceHomeScreenProps) {
  const { activeMembership, selectWorkspace, user } = useAuth();
  if (!user || !activeMembership || user.role === 'member' || user.role === 'superadmin') return null;

  const copy = roleCopy[user.role];
  const roleLabel = user.role === 'chairperson' ? 'Chairperson' : `${user.role[0].toUpperCase()}${user.role.slice(1)}`;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.icon}><ShieldCheck color="#CDBFFF" size={24} /></View>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>OFFICIAL CHAMA CONTEXT</Text>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.description}</Text>
          <View style={styles.badges}>
            <Badge variant="success">Member</Badge>
            <Badge variant="brand">{roleLabel}</Badge>
            <Badge variant="neutral">{activeMembership.chamaName}</Badge>
          </View>
        </View>
        <Button variant="outline" onPress={() => selectWorkspace('member')}>Back to Member View</Button>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Your personal membership is still active.</Text>
        <Text style={styles.noticeText}>This workspace changes what official tools are visible; it does not create another account or replace your Member View.</Text>
      </View>

      <View style={styles.grid}>
        {copy.actions.map(({ title, body, icon: Icon, path, availability = 'ready' }) => {
          const disabled = path === null;
          return (
            <Pressable
              key={title}
              accessibilityRole={disabled ? undefined : 'button'}
              accessibilityState={disabled ? { disabled: true } : undefined}
              disabled={disabled}
              onPress={() => path && onNavigate(path)}
              style={({ pressed, hovered }: any) => [
                styles.card,
                disabled && styles.cardDisabled,
                hovered && !disabled && styles.cardHover,
                pressed && !disabled && styles.cardPressed,
              ]}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.cardIcon}><Icon color={colors.primary} size={21} /></View>
                {availability === 'overview-only' ? (
                  <Badge variant="neutral">Overview only</Badge>
                ) : (
                  <ArrowRight color={colors.primary} size={18} />
                )}
              </View>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardBody}>{body}</Text>
              {!disabled ? <Text style={styles.cardAction}>Open workspace</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, flex: 1, gap: spacing.sm, minWidth: 230, padding: spacing.lg },
  cardAction: { color: colors.primaryDark, fontSize: typography.sizes.small, fontWeight: typography.weights.bold, marginTop: spacing.xs },
  cardBody: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 20 },
  cardDisabled: { backgroundColor: colors.surfaceMuted, opacity: 0.82 },
  cardHover: { borderColor: colors.primaryLine, transform: [{ translateY: -2 }] },
  cardIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.md, height: 42, justifyContent: 'center', width: 42 },
  cardPressed: { opacity: 0.92, transform: [{ translateY: 0 }] },
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: typography.weights.bold },
  cardTopRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  content: { gap: spacing.xl, padding: 24, paddingBottom: 80 },
  eyebrow: { color: '#CDBFFF', fontSize: 11, fontWeight: typography.weights.bold, letterSpacing: 1.1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  hero: { alignItems: 'center', backgroundColor: colors.navy, borderRadius: radii.xl, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, padding: 28 },
  heroCopy: { flex: 1, minWidth: 260 },
  icon: { alignItems: 'center', backgroundColor: 'rgba(99,56,212,.24)', borderRadius: radii.lg, height: 52, justifyContent: 'center', width: 52 },
  notice: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: radii.lg, borderWidth: 1, padding: spacing.lg },
  noticeText: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 20, marginTop: 3 },
  noticeTitle: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold },
  page: { backgroundColor: colors.background, flex: 1 },
  subtitle: { color: '#C9CDDA', fontSize: typography.sizes.body, lineHeight: 21, marginTop: 5 },
  title: { color: colors.white, fontSize: 28, fontWeight: typography.weights.extrabold, marginTop: 3 },
});
