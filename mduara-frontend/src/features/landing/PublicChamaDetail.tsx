import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  MapPin,
  ShieldCheck,
  UserRoundCheck,
  Users,
  WalletCards,
} from 'lucide-react-native';

import { MduaraBrand } from '../../components/brand/MduaraBrand';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ChamaTrustIndicator } from './ChamaTrustIndicator';
import type { PublicChama } from '../../shared/prototype';
import { formatCurrency } from '../../shared/date';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

interface PublicChamaDetailProps {
  chama: PublicChama;
  onBack: () => void;
  onCreateAccount: (chama: PublicChama) => void;
  onSignIn: (chama: PublicChama) => void;
}

function entryModeCopy(chama: PublicChama) {
  if (chama.entryMode === 'PUBLIC') {
    return 'Direct entry is available after account verification and acceptance of the current Constitution.';
  }
  if (chama.entryMode === 'APPLICATION') {
    return 'Applications are reviewed by the Chama officials before membership is approved.';
  }
  return 'This Chama is invite-only. A valid invitation is required before registration can continue.';
}

export function PublicChamaDetail({ chama, onBack, onCreateAccount, onSignIn }: PublicChamaDetailProps) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const narrow = width < 480;
  const progress = chama.target > 0 ? Math.min(100, Math.round((chama.pooled / chama.target) * 100)) : 0;
  const openForApplications = chama.recruitmentStatus !== 'Closed' && chama.entryMode !== 'PRIVATE';

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.topbar, compact && styles.topbarCompact]}>
        <MduaraBrand variant="full" width={compact ? 158 : 196} />
        <Pressable accessibilityRole="button" onPress={onBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <ArrowLeft size={17} color={colors.navy} />
          <Text style={styles.backText}>Back to Chamas</Text>
        </Pressable>
      </View>

      <View style={styles.shell}>
        <View style={[styles.hero, compact && styles.heroCompact]}>
          <View style={styles.heroCopy}>
            <View style={styles.pillRow}>
              <View style={styles.pill}><Text style={styles.pillText}>{chama.goalCategory}</Text></View>
              <View style={[styles.pill, chama.recruitmentStatus === 'Closed' ? styles.pillMuted : styles.pillSuccess]}>
                <Text style={[styles.pillText, chama.recruitmentStatus === 'Closed' ? styles.pillMutedText : styles.pillSuccessText]}>{chama.recruitmentStatus}</Text>
              </View>
              <View style={styles.pill}><Text style={styles.pillText}>{chama.entryMode}</Text></View>
            </View>
            <Text style={[styles.title, narrow && styles.titleNarrow]}>{chama.name}</Text>
            <Text style={styles.goal}>{chama.goal}</Text>
            <Text style={styles.description}>{chama.description}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}><MapPin size={15} color={colors.textMuted} /><Text style={styles.metaText}>{chama.location}</Text></View>
              <View style={styles.metaItem}><Users size={15} color={colors.textMuted} /><Text style={styles.metaText}>{chama.members}/{chama.capacity} members</Text></View>
              <View style={styles.metaItem}><CalendarDays size={15} color={colors.textMuted} /><Text style={styles.metaText}>{chama.durationMonths} months</Text></View>
            </View>
          </View>

          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>GROUP PROGRESS</Text>
            <View style={styles.progressNumbers}>
              <Text style={styles.progressMain}>{formatCurrency(chama.pooled)}</Text>
              <Text style={styles.progressTarget}>of {formatCurrency(chama.target)}</Text>
            </View>
            <ProgressBar progress={progress} />
            <Text style={styles.progressFoot}>{progress}% toward target</Text>
          </View>
        </View>

        <View style={[styles.statGrid, compact && styles.statGridCompact]}>
          <View style={styles.statCard}><WalletCards size={20} color={colors.primary} /><Text style={styles.statLabel}>Contribution</Text><Text style={styles.statValue}>{formatCurrency(chama.contributionAmount)}</Text><Text style={styles.statSub}>{chama.contributionFrequency}</Text></View>
          <View style={styles.statCard}><ShieldCheck size={20} color={colors.primary} /><Text style={styles.statLabel}>Commitment</Text><Text style={styles.statValue}>{formatCurrency(chama.commitmentAmount)}</Text><Text style={styles.statSub}>Subject to accepted Chama rules</Text></View>
          <View style={styles.statCard}><CalendarDays size={20} color={colors.primary} /><Text style={styles.statLabel}>Meeting</Text><Text style={styles.statValueSmall}>{chama.meeting}</Text><Text style={styles.statSub}>Scheduled group meeting</Text></View>
          <View style={styles.statCard}><FileText size={20} color={colors.primary} /><Text style={styles.statLabel}>Constitution</Text><Text style={styles.statValue}>{chama.constitutionVersion}</Text><Text style={styles.statSub}>Current version shown before joining</Text></View>
        </View>

        <View style={styles.trustBlock}>
          <View>
            <Text style={styles.sectionTitle}>Trust & transparency</Text>
            <Text style={styles.sectionIntro}>This public indicator uses safe prototype signals only. It does not reveal any member’s private contribution, repayment or balance data.</Text>
          </View>
          <ChamaTrustIndicator score={chama.trustScore} signals={chama.trustSignals} />
        </View>

        <View style={[styles.twoColumn, compact && styles.stack]}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeadingRow}><UserRoundCheck size={20} color={colors.primary} /><Text style={styles.sectionTitle}>Chama leadership</Text></View>
            <Text style={styles.sectionIntro}>Public-safe official information only. Private phone numbers and member financial details are not exposed.</Text>
            <View style={styles.officialList}>
              {chama.officials.map((official) => (
                <View key={official.role} style={styles.officialRow}>
                  <View style={styles.officialAvatar}><Text style={styles.officialAvatarText}>{official.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</Text></View>
                  <View style={styles.officialCopy}><Text style={styles.officialName}>{official.name}</Text><Text style={styles.officialRole}>{official.role}</Text></View>
                  <View style={styles.verifiedPill}><ShieldCheck size={12} color={colors.success} /><Text style={styles.verifiedText}>Official</Text></View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeadingRow}><FileText size={20} color={colors.primary} /><Text style={styles.sectionTitle}>Before you join</Text></View>
            <Text style={styles.sectionIntro}>These are the key areas a member must understand. The complete Constitution remains the binding Chama document.</Text>
            <View style={styles.ruleList}>
              {chama.rules.map((rule, index) => (
                <View key={rule.title} style={styles.ruleRow}>
                  <View style={styles.ruleNumber}><Text style={styles.ruleNumberText}>{index + 1}</Text></View>
                  <View style={styles.ruleCopy}><Text style={styles.ruleTitle}>{rule.title}</Text><Text style={styles.ruleSummary}>{rule.summary}</Text></View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.joinCard, compact && styles.joinCardCompact]}>
          <View style={styles.joinCopy}>
            <Text style={styles.joinEyebrow}>ENTRY METHOD</Text>
            <Text style={styles.joinTitle}>{chama.entryMode === 'PUBLIC' ? 'Ready for direct joining' : chama.entryMode === 'APPLICATION' ? 'Application required' : 'Invitation required'}</Text>
            <Text style={styles.joinText}>{entryModeCopy(chama)}</Text>
            <Text style={styles.joinNote}>Any applicable payment-processing or platform fee must be displayed before payment. The KSh 500 commitment remains separate from ordinary platform revenue.</Text>
          </View>

          {openForApplications ? (
            <View style={[styles.joinActions, compact && styles.joinActionsCompact]}>
              <Button onPress={() => onCreateAccount(chama)}>Create account to apply</Button>
              <Button variant="secondary" onPress={() => onSignIn(chama)}>I already have an account</Button>
            </View>
          ) : (
            <View style={styles.closedState}>
              <ShieldCheck size={18} color={colors.textMuted} />
              <Text style={styles.closedText}>This Chama is not accepting public applications.</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 48 },
  topbar: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 86,
    paddingHorizontal: 28,
  },
  topbarCompact: { minHeight: 74, paddingHorizontal: 16 },
  backButton: { alignItems: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: radii.md },
  backText: { color: colors.navy, fontSize: typography.sizes.body, fontWeight: typography.weights.semibold },
  pressed: { opacity: 0.72 },
  shell: { alignSelf: 'center', maxWidth: 1180, paddingHorizontal: 20, paddingTop: 30, width: '100%' },
  hero: { alignItems: 'stretch', backgroundColor: colors.brandCanvas, borderColor: colors.primaryLine, borderRadius: 26, borderWidth: 1, flexDirection: 'row', gap: 26, padding: 30 },
  heroCompact: { flexDirection: 'column', padding: 22 },
  heroCopy: { flex: 1.25 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  pillText: { color: colors.primaryDark, fontSize: 9, fontWeight: '900', letterSpacing: 0.25 },
  pillSuccess: { backgroundColor: colors.successSoft, borderColor: '#CFEFDE' },
  pillSuccessText: { color: colors.success },
  pillMuted: { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
  pillMutedText: { color: colors.textMuted },
  title: { color: colors.navy, fontSize: 40, fontWeight: '900', letterSpacing: -1.4, lineHeight: 44, marginTop: 18 },
  titleNarrow: { fontSize: 32, lineHeight: 37 },
  goal: { color: colors.primaryDark, fontSize: 15, fontWeight: '800', marginTop: 8 },
  description: { color: colors.textMuted, fontSize: 14, lineHeight: 23, marginTop: 12, maxWidth: 720 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 18 },
  metaItem: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  metaText: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  progressCard: { alignSelf: 'stretch', backgroundColor: colors.navy, borderRadius: 20, flex: 0.65, justifyContent: 'center', minWidth: 260, padding: 22 },
  progressLabel: { color: colors.brandInversePurple, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  progressNumbers: { alignItems: 'baseline', flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16, marginTop: 7 },
  progressMain: { color: colors.white, fontSize: 25, fontWeight: '900' },
  progressTarget: { color: '#BFC6D8', fontSize: 10, fontWeight: '700' },
  progressFoot: { color: '#C6CCDB', fontSize: 10, fontWeight: '700', marginTop: 9 },
  statGrid: { flexDirection: 'row', gap: 12, marginTop: 18 },
  statGridCompact: { flexWrap: 'wrap' },
  statCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flex: 1, minWidth: 170, padding: 18 },
  statLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '800', marginTop: 12, textTransform: 'uppercase' },
  statValue: { color: colors.navy, fontSize: 18, fontWeight: '900', marginTop: 5 },
  statValueSmall: { color: colors.navy, fontSize: 13, fontWeight: '900', lineHeight: 18, marginTop: 5 },
  statSub: { color: colors.textSubtle, fontSize: 9, lineHeight: 14, marginTop: 4 },
  trustBlock: { gap: 12, marginTop: 18 },
  twoColumn: { flexDirection: 'row', gap: 18, marginTop: 18 },
  stack: { flexDirection: 'column' },
  sectionCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, flex: 1, padding: 22 },
  sectionHeadingRow: { alignItems: 'center', flexDirection: 'row', gap: 9 },
  sectionTitle: { color: colors.navy, fontSize: 17, fontWeight: '900' },
  sectionIntro: { color: colors.textMuted, fontSize: 11, lineHeight: 18, marginTop: 8 },
  officialList: { gap: 10, marginTop: 18 },
  officialRow: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: 14, flexDirection: 'row', gap: 11, padding: 12 },
  officialAvatar: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 12, height: 38, justifyContent: 'center', width: 38 },
  officialAvatarText: { color: colors.primaryDark, fontSize: 10, fontWeight: '900' },
  officialCopy: { flex: 1 },
  officialName: { color: colors.navy, fontSize: 12, fontWeight: '900' },
  officialRole: { color: colors.textMuted, fontSize: 9, marginTop: 2 },
  verifiedPill: { alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: 999, flexDirection: 'row', gap: 4, paddingHorizontal: 8, paddingVertical: 5 },
  verifiedText: { color: colors.success, fontSize: 8, fontWeight: '900' },
  ruleList: { gap: 12, marginTop: 18 },
  ruleRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 },
  ruleNumber: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 9, height: 26, justifyContent: 'center', width: 26 },
  ruleNumberText: { color: colors.primaryDark, fontSize: 9, fontWeight: '900' },
  ruleCopy: { flex: 1 },
  ruleTitle: { color: colors.navy, fontSize: 11, fontWeight: '900' },
  ruleSummary: { color: colors.textMuted, fontSize: 10, lineHeight: 16, marginTop: 3 },
  joinCard: { alignItems: 'center', backgroundColor: colors.navy, borderRadius: 24, flexDirection: 'row', gap: 22, justifyContent: 'space-between', marginTop: 18, padding: 26 },
  joinCardCompact: { alignItems: 'stretch', flexDirection: 'column' },
  joinCopy: { flex: 1 },
  joinEyebrow: { color: colors.brandInversePurple, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  joinTitle: { color: colors.white, fontSize: 22, fontWeight: '900', marginTop: 6 },
  joinText: { color: '#C6CCDB', fontSize: 11, lineHeight: 18, marginTop: 7, maxWidth: 700 },
  joinNote: { color: '#9EA7BB', fontSize: 9, lineHeight: 15, marginTop: 10, maxWidth: 740 },
  joinActions: { gap: 8, minWidth: 220 },
  joinActionsCompact: { minWidth: 0 },
  closedState: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: 14, flexDirection: 'row', gap: 8, maxWidth: 300, padding: 14 },
  closedText: { color: colors.textMuted, flex: 1, fontSize: 10, fontWeight: '700', lineHeight: 15 },
});
