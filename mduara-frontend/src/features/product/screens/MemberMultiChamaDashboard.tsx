import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Building2, CalendarClock, ChevronRight, ShieldCheck, Target, WalletCards } from 'lucide-react-native';

import { useAuth } from '../../../app/providers/AuthContext';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { TrustScoreCard } from '../components/TrustScoreCard';
import { formatCurrency } from '../../../shared/date';
import { colors } from '../../../theme/colors';
import { radii, shadows, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';
import type { AppPath } from '../../../app/navigation/types';

interface MemberMultiChamaDashboardProps {
  onNavigate: (path: AppPath) => void;
}

export function MemberMultiChamaDashboard({ onNavigate }: MemberMultiChamaDashboardProps) {
  const { activeMembership, selectContext, user } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 1080;
  const isTablet = width >= 720;

  const summary = useMemo(() => {
    const memberships = user?.memberships.filter((item) => item.status === 'active') ?? [];
    const totalSaved = memberships.reduce((sum, item) => sum + item.ownSaved, 0);
    const officialMemberships = memberships.filter((item) => item.officialRole);
    const next = [...memberships].sort((a, b) => a.nextContributionDue.localeCompare(b.nextContributionDue))[0];
    return { memberships, totalSaved, officialMemberships, next };
  }, [user]);

  if (!user) return null;

  const openMemberChama = (chamaId: number) => {
    if (!selectContext(chamaId, 'member')) return;
    onNavigate('/my-chama');
  };

  const openOfficialWorkspace = (chamaId: number) => {
    const membership = user.memberships.find((item) => item.chamaId === chamaId);
    if (!membership?.officialRole) return;
    selectContext(chamaId, membership.officialRole);
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, isTablet && styles.heroWide]}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>MY M-DUARA</Text>
          <Text style={styles.title}>Good morning, {user.fullName.split(' ')[0]} 👋</Text>
          <Text style={styles.subtitle}>One account for every Chama you belong to. Switch context without another login.</Text>
        </View>
        {activeMembership ? (
          <View style={styles.activeContext}>
            <Text style={styles.contextLabel}>ACTIVE CHAMA</Text>
            <Text style={styles.contextName}>{activeMembership.chamaName}</Text>
            <View style={styles.badgeRow}>
              <Badge variant="success">Member</Badge>
              {activeMembership.officialRole ? <Badge variant="brand">{activeMembership.officialRole === 'chairperson' ? 'Chairperson' : activeMembership.officialRole[0].toUpperCase() + activeMembership.officialRole.slice(1)}</Badge> : null}
            </View>
          </View>
        ) : null}
      </View>

      <View style={[styles.metricGrid, isWide && styles.metricGridWide, isTablet && !isWide && styles.metricGridTablet]}>
        <Metric icon={WalletCards} label="My total savings" value={formatCurrency(summary.totalSaved)} detail="Across your active Chamas" />
        <Metric icon={Building2} label="Active Chamas" value={String(summary.memberships.length)} detail="One login, separate Chama contexts" />
        <Metric icon={CalendarClock} label="Next contribution" value={summary.next ? formatCurrency(summary.next.nextContributionAmount) : '—'} detail={summary.next ? `${summary.next.chamaName} • ${summary.next.nextContributionDue}` : 'No upcoming item'} />
        <Metric icon={ShieldCheck} label="Official responsibilities" value={String(summary.officialMemberships.length)} detail={summary.officialMemberships.length ? summary.officialMemberships.map((item) => `${item.officialRole} • ${item.chamaName}`).join('  ·  ') : 'Member View only'} />
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>My Chamas</Text>
          <Text style={styles.sectionText}>Your role is stored per Chama. An official role never carries into another Chama.</Text>
        </View>
        <Badge variant="neutral">{summary.memberships.length} memberships</Badge>
      </View>

      <View style={[styles.chamaGrid, isWide && styles.chamaGridWide, isTablet && !isWide && styles.chamaGridTablet]}>
        {summary.memberships.map((membership) => {
          const progress = membership.ownTarget > 0 ? Math.min(100, Math.round((membership.ownSaved / membership.ownTarget) * 100)) : 0;
          const isActive = activeMembership?.chamaId === membership.chamaId;
          return (
            <Card key={membership.chamaId} variant="outlined" style={[styles.chamaCard, isActive && styles.chamaCardActive]}>
              <View style={styles.cardTop}>
                <View style={styles.goalIcon}><Target color={colors.primary} size={19} /></View>
                <View style={styles.cardHeading}>
                  <Text style={styles.chamaName}>{membership.chamaName}</Text>
                  <Text style={styles.goalLabel}>{membership.goalLabel}</Text>
                </View>
                {isActive ? <Badge variant="success">Active</Badge> : null}
              </View>

              <View style={styles.badgeRow}>
                <Badge variant="neutral">Member</Badge>
                {membership.officialRole ? <Badge variant="brand">{membership.officialRole === 'chairperson' ? 'Chairperson' : membership.officialRole[0].toUpperCase() + membership.officialRole.slice(1)}</Badge> : null}
              </View>

              <View style={styles.moneyRow}>
                <View><Text style={styles.smallLabel}>MY SAVINGS</Text><Text style={styles.money}>{formatCurrency(membership.ownSaved)}</Text></View>
                <View style={styles.alignRight}><Text style={styles.smallLabel}>MY TARGET</Text><Text style={styles.moneyMuted}>{formatCurrency(membership.ownTarget)}</Text></View>
              </View>
              <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View>
              <View style={styles.progressMeta}><Text style={styles.progressText}>{progress}% complete</Text><Text style={styles.progressText}>Trust {membership.trustScore}/100</Text></View>

              <View style={styles.nextBox}>
                <Text style={styles.nextLabel}>Next contribution</Text>
                <Text style={styles.nextValue}>{formatCurrency(membership.nextContributionAmount)} • {membership.nextContributionDue}</Text>
                <Text style={[styles.statusText, membership.contributionStatus === 'Late' && styles.statusLate]}>{membership.contributionStatus}</Text>
              </View>

              <View style={styles.actions}>
                <Button style={styles.actionButton} variant={isActive ? 'soft' : 'outline'} onPress={() => openMemberChama(membership.chamaId)} rightIcon={<ChevronRight color={colors.primary} size={16} />}>
                  Open Member View
                </Button>
                {membership.officialRole ? (
                  <Button style={styles.actionButton} onPress={() => openOfficialWorkspace(membership.chamaId)} leftIcon={<ShieldCheck color={colors.white} size={16} />}>
                    {membership.officialRole === 'chairperson' ? 'Chair Workspace' : `${membership.officialRole[0].toUpperCase() + membership.officialRole.slice(1)} Workspace`}
                  </Button>
                ) : null}
              </View>
            </Card>
          );
        })}
      </View>


      {activeMembership ? (
        <View style={styles.trustSection}>
          <View>
            <Text style={styles.sectionTitle}>My trust snapshot</Text>
            <Text style={styles.sectionText}>This explains the prototype score for your active Chama only. The final scoring formula will come from the approved backend contract.</Text>
          </View>
          <TrustScoreCard score={activeMembership.trustScore} subjectLabel={activeMembership.chamaName} />
        </View>
      ) : null}


      <View style={styles.securityNote}>
        <ShieldCheck color={colors.success} size={20} />
        <View style={styles.securityCopy}>
          <Text style={styles.securityTitle}>Roles are Chama-scoped</Text>
          <Text style={styles.securityText}>Being Secretary in Summertides ’27 does not give this account Secretary access in Future Home, Washing Machine Mbogi or Dubai Travel Circle.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: any; label: string; value: string; detail: string }) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricIcon}><Icon color={colors.primary} size={19} /></View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text numberOfLines={2} style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: { flex: 1 }, actions: { gap: spacing.sm }, activeContext: { backgroundColor: 'rgba(255,255,255,.11)', borderColor: 'rgba(255,255,255,.15)', borderRadius: radii.lg, borderWidth: 1, minWidth: 250, padding: spacing.lg },
  alignRight: { alignItems: 'flex-end' }, badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }, cardHeading: { flex: 1, minWidth: 0 }, cardTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm }, chamaCard: { gap: spacing.md, padding: spacing.lg }, chamaCardActive: { borderColor: colors.primaryLine, borderWidth: 2 },
  chamaGrid: { gap: spacing.md }, chamaGridTablet: { flexDirection: 'row', flexWrap: 'wrap' }, chamaGridWide: { flexDirection: 'row', flexWrap: 'wrap' }, chamaName: { color: colors.text, fontSize: 17, fontWeight: typography.weights.bold },
  content: { gap: spacing.xl, padding: 24, paddingBottom: 80 }, contextLabel: { color: '#CDBFFF', fontSize: 10, fontWeight: typography.weights.bold, letterSpacing: 1 }, contextName: { color: colors.white, fontSize: 18, fontWeight: typography.weights.bold, marginBottom: spacing.sm, marginTop: 4 },
  eyebrow: { color: '#CDBFFF', fontSize: 11, fontWeight: typography.weights.bold, letterSpacing: 1.2 }, fill: { backgroundColor: colors.primary, borderRadius: 99, height: '100%' }, goalIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.md, height: 40, justifyContent: 'center', width: 40 }, goalLabel: { color: colors.textMuted, fontSize: typography.sizes.caption, marginTop: 2 },
  hero: { backgroundColor: colors.navy, borderRadius: radii.xl, gap: spacing.lg, overflow: 'hidden', padding: 28, ...shadows.md }, heroCopy: { flex: 1, gap: spacing.sm }, heroWide: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  metricCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, flex: 1, gap: 5, minWidth: 210, padding: spacing.lg }, metricDetail: { color: colors.textMuted, fontSize: typography.sizes.caption, lineHeight: 16 }, metricGrid: { gap: spacing.md }, metricGridTablet: { flexDirection: 'row', flexWrap: 'wrap' }, metricGridWide: { flexDirection: 'row' }, metricIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.md, height: 38, justifyContent: 'center', marginBottom: 3, width: 38 }, metricLabel: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.semibold }, metricValue: { color: colors.text, fontSize: 24, fontWeight: typography.weights.extrabold },
  money: { color: colors.text, fontSize: 18, fontWeight: typography.weights.bold, marginTop: 3 }, moneyMuted: { color: colors.textMuted, fontSize: 16, fontWeight: typography.weights.semibold, marginTop: 3 }, moneyRow: { flexDirection: 'row', justifyContent: 'space-between' },
  nextBox: { backgroundColor: colors.surfaceMuted, borderRadius: radii.md, padding: spacing.md }, nextLabel: { color: colors.textMuted, fontSize: typography.sizes.caption }, nextValue: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold, marginTop: 3 }, page: { backgroundColor: colors.background, flex: 1 }, progressMeta: { flexDirection: 'row', justifyContent: 'space-between' }, progressText: { color: colors.textMuted, fontSize: typography.sizes.caption },
  sectionHeader: { alignItems: 'flex-end', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' }, sectionText: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 20, marginTop: 4, maxWidth: 650 }, sectionTitle: { color: colors.text, fontSize: 24, fontWeight: typography.weights.extrabold }, securityCopy: { flex: 1 }, securityNote: { alignItems: 'flex-start', backgroundColor: colors.successSoft, borderColor: '#CDEDDD', borderRadius: radii.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.lg }, securityText: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 20, marginTop: 3 }, securityTitle: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold }, smallLabel: { color: colors.textSubtle, fontSize: 10, fontWeight: typography.weights.bold, letterSpacing: .7 }, statusLate: { color: colors.danger }, statusText: { color: colors.success, fontSize: typography.sizes.caption, fontWeight: typography.weights.bold, marginTop: 4 }, subtitle: { color: '#C9CDDA', fontSize: typography.sizes.body, lineHeight: 22, maxWidth: 650 }, title: { color: colors.white, fontSize: 30, fontWeight: typography.weights.extrabold }, track: { backgroundColor: colors.primaryLight, borderRadius: 99, height: 7, overflow: 'hidden' },
});
