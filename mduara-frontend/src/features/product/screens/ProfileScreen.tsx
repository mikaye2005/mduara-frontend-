import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BadgeCheck, Building2, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import type { VerifiedTokenPayload } from '../../../shared/mockData';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

export function ProfileScreen({ user }: { user: VerifiedTokenPayload }) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);

  const activeMemberships = useMemo(() => user.memberships.filter((item) => item.status === 'active'), [user.memberships]);
  const officialMemberships = activeMemberships.filter((item) => item.officialRole);

  const save = () => {
    setEditing(false);
    setSaved(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View style={styles.titleWrap}><Text style={styles.eyebrow}>ACCOUNT</Text><Text style={styles.title}>My Profile</Text><Text style={styles.subtitle}>One identity across all your Chamas and any official workspaces you have actually been assigned.</Text></View><Badge variant="success">Verified prototype identity</Badge></View>

      <View style={[styles.layout, compact && styles.layoutCompact]}>
        <Card variant="outlined" style={styles.identityCard}>
          <View style={styles.avatar}><UserRound color={colors.primary} size={32} /></View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.verified}><BadgeCheck color={colors.success} size={17} /><Text style={styles.verifiedText}>Account identity verified in mock session</Text></View>
          <View style={styles.contact}><Phone color={colors.textMuted} size={16} /><Text style={styles.contactText}>{user.phone}</Text></View>
          <View style={styles.contact}><Mail color={colors.textMuted} size={16} /><Text style={styles.contactText}>{email}</Text></View>
          <Button onPress={() => { setEditing((value) => !value); setSaved(false); }} variant="secondary">{editing ? 'Cancel editing' : 'Edit profile preview'}</Button>
        </Card>

        <View style={styles.rightColumn}>
          {editing ? (
            <Card variant="outlined" style={styles.editCard}>
              <Text style={styles.cardTitle}>Profile preview</Text>
              <Input label="Full name" value={name} onChangeText={(value) => { setName(value); setSaved(false); }} />
              <Input keyboardType="email-address" label="Email address" value={email} onChangeText={(value) => { setEmail(value); setSaved(false); }} />
              <Input editable={false} label="Verified phone" value={user.phone} />
              <Text style={styles.help}>Phone changes require OTP and are intentionally disabled here.</Text>
              <Button disabled={name.trim().length < 2 || !email.includes('@')} onPress={save}>Save profile preview</Button>
            </Card>
          ) : null}

          <Card variant="outlined" style={styles.membershipCard}>
            <View style={styles.cardHeading}><Building2 color={colors.primary} size={20} /><Text style={styles.cardTitle}>My Chamas & responsibilities</Text></View>
            {activeMemberships.length ? activeMemberships.map((membership) => (
              <View key={membership.chamaId} style={styles.membershipRow}>
                <View style={styles.membershipCopy}><Text style={styles.membershipName}>{membership.chamaName}</Text><Text style={styles.help}>{membership.goalLabel}</Text></View>
                <View style={styles.badges}><Badge variant="success">Member</Badge>{membership.officialRole ? <Badge variant="brand">{membership.officialRole === 'chairperson' ? 'Chairperson' : membership.officialRole[0].toUpperCase() + membership.officialRole.slice(1)}</Badge> : null}</View>
              </View>
            )) : <Text style={styles.help}>No active Chama memberships are attached to this account.</Text>}
            {user.isPlatformAdmin ? <View style={styles.platform}><ShieldCheck color={colors.primary} size={17} /><Text style={styles.platformText}>Platform Administration is available as a separate workspace.</Text></View> : null}
          </Card>
        </View>
      </View>

      {saved ? <View style={styles.saved}><Text style={styles.savedText}>Profile preview updated for this screen session. Production persistence will use the profile API.</Text></View> : null}

      <View style={styles.summary}><Text style={styles.summaryText}>{activeMemberships.length} active Chama{activeMemberships.length === 1 ? '' : 's'} · {officialMemberships.length} official responsibilit{officialMemberships.length === 1 ? 'y' : 'ies'}</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 34, height: 68, justifyContent: 'center', width: 68 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  cardHeading: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  cardTitle: { color: colors.navy, fontSize: 16, fontWeight: '900' },
  contact: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  contactText: { color: colors.textMuted, fontSize: 12 },
  editCard: { gap: spacing.md },
  email: { color: colors.textMuted, fontSize: 12 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  help: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  identityCard: { alignItems: 'flex-start', flex: 0.8, gap: spacing.md, minWidth: 280 },
  layout: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.lg },
  layoutCompact: { flexDirection: 'column' },
  membershipCard: { gap: spacing.md },
  membershipCopy: { flex: 1 },
  membershipName: { color: colors.text, fontSize: 13, fontWeight: '900' },
  membershipRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between', paddingBottom: spacing.md },
  name: { color: colors.navy, fontSize: 22, fontWeight: '900' },
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  platform: { alignItems: 'flex-start', backgroundColor: colors.primaryLight, borderRadius: radii.md, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  platformText: { color: colors.primaryDark, flex: 1, fontSize: 11, fontWeight: '700', lineHeight: 17 },
  rightColumn: { flex: 1.4, gap: spacing.md, minWidth: 300 },
  saved: { backgroundColor: colors.successSoft, borderRadius: radii.md, padding: spacing.md },
  savedText: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  summary: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: radii.md, padding: spacing.md },
  summaryText: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  titleWrap: { gap: 4, maxWidth: 720 },
  verified: { alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: 999, flexDirection: 'row', gap: 5, paddingHorizontal: 10, paddingVertical: 6 },
  verifiedText: { color: colors.success, fontSize: 10, fontWeight: '800' },
});
