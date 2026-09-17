import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CalendarDays, Check, FileText, Megaphone, UsersRound } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type Tab = 'Announcements' | 'Meetings' | 'Minutes';
const tabs: Tab[] = ['Announcements', 'Meetings', 'Minutes'];

const initialAnnouncements = [
  { id: 'ANN-12', subject: 'September contribution reminder', message: 'Members are reminded that the September contribution closes on 20 September.', audience: 'All active members', published: '15 Sep 2026' },
  { id: 'ANN-11', subject: 'Saturday meeting venue', message: 'This month’s meeting will be held at the community hall from 2:00 PM.', audience: 'All active members', published: '09 Sep 2026' },
];

const meetings = [
  { id: 'MTG-08', title: 'September General Meeting', date: '20 Sep 2026 · 2:00 PM', venue: 'Community Hall', going: 17, pending: 5 },
  { id: 'MTG-07', title: 'Officials planning session', date: '12 Sep 2026 · 6:30 PM', venue: 'Online', going: 3, pending: 0 },
];

const minutes = [
  { id: 'MIN-07', title: 'August General Meeting', date: '23 Aug 2026', status: 'Published' },
  { id: 'MIN-06', title: 'July General Meeting', date: '26 Jul 2026', status: 'Published' },
];

export function SecretaryCommunicationsScreen() {
  const [tab, setTab] = useState<Tab>('Announcements');
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [announcementNote, setAnnouncementNote] = useState<string | null>(null);
  const [minuteTitle, setMinuteTitle] = useState('');
  const [minuteBody, setMinuteBody] = useState('');
  const [minuteNote, setMinuteNote] = useState<string | null>(null);
  const canPublish = subject.trim().length >= 4 && message.trim().length >= 12;
  const canSaveMinutes = minuteTitle.trim().length >= 4 && minuteBody.trim().length >= 20;

  const publishPrototype = () => {
    if (!canPublish) return;
    setAnnouncements((current) => [{ id: `ANN-${current.length + 13}`, subject: subject.trim(), message: message.trim(), audience: 'All active members', published: 'Prototype now' }, ...current]);
    setSubject(''); setMessage('');
    setAnnouncementNote('Saved to this frontend session. Live member notification will occur only after the broadcast API is connected.');
  };

  const saveMinutesPrototype = () => {
    if (!canSaveMinutes) return;
    setMinuteTitle(''); setMinuteBody('');
    setMinuteNote('Draft validated in the frontend. Publishing remains backend-gated so an unaudited prototype cannot create an official meeting record.');
  };

  const tabIcon = useMemo(() => tab === 'Announcements' ? Megaphone : tab === 'Meetings' ? CalendarDays : FileText, [tab]);
  const ActiveIcon = tabIcon;

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View style={styles.titleWrap}><Text style={styles.eyebrow}>SECRETARY WORKSPACE</Text><Text style={styles.title}>Communications & Meetings</Text><Text style={styles.subtitle}>Announcements, scheduling, attendance visibility and meeting minutes in one coordinated workspace.</Text></View><Badge variant="info">Secretary only</Badge></View>

      <View style={styles.tabs}>{tabs.map((value) => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: tab === value }} onPress={() => setTab(value)} style={[styles.tab, tab === value && styles.tabActive]}><Text style={[styles.tabText, tab === value && styles.tabTextActive]}>{value}</Text></Pressable>)}</View>

      <View style={styles.context}><ActiveIcon color={colors.primary} size={18} /><Text style={styles.contextText}>{tab === 'Announcements' ? 'Compose and review Chama broadcasts.' : tab === 'Meetings' ? 'Review scheduled meetings and RSVP visibility.' : 'Prepare meeting minutes without silently publishing official records.'}</Text></View>

      {tab === 'Announcements' ? (
        <View style={styles.twoCol}>
          <Card variant="outlined" style={styles.formCard}>
            <Text style={styles.cardTitle}>New announcement</Text>
            <Input label="Subject" value={subject} onChangeText={(value) => { setSubject(value); setAnnouncementNote(null); }} placeholder="e.g. Contribution reminder" />
            <View style={styles.field}><Text style={styles.label}>Message</Text><TextInput accessibilityLabel="Announcement message" multiline value={message} onChangeText={(value) => { setMessage(value); setAnnouncementNote(null); }} placeholder="Write the message members should receive" placeholderTextColor={colors.textMuted} style={styles.textarea} /></View>
            <Text style={styles.help}>Audience: all active members of the current Chama.</Text>
            <Button fullWidth disabled={!canPublish} onPress={publishPrototype}>Save prototype announcement</Button>
            {announcementNote ? <View style={styles.note}><Check color={colors.success} size={16} /><Text style={styles.noteText}>{announcementNote}</Text></View> : null}
          </Card>
          <Card variant="outlined" style={styles.listCard}><Text style={styles.cardTitle}>Broadcast history</Text>{announcements.map((item) => <View key={item.id} style={styles.broadcast}><Text style={styles.broadcastTitle}>{item.subject}</Text><Text style={styles.broadcastText}>{item.message}</Text><Text style={styles.meta}>{item.audience} · {item.published}</Text></View>)}</Card>
        </View>
      ) : null}

      {tab === 'Meetings' ? <View style={styles.meetingGrid}>{meetings.map((meeting) => <Card key={meeting.id} variant="outlined" style={styles.meetingCard}><View style={styles.meetingIcon}><CalendarDays color={colors.primary} size={20} /></View><Text style={styles.cardTitle}>{meeting.title}</Text><Text style={styles.meta}>{meeting.date}</Text><Text style={styles.meta}>{meeting.venue}</Text><View style={styles.rsvp}><UsersRound color={colors.textMuted} size={16} /><Text style={styles.rsvpText}>{meeting.going} going · {meeting.pending} awaiting RSVP</Text></View><Badge variant="success">Scheduled</Badge></Card>)}</View> : null}

      {tab === 'Minutes' ? (
        <View style={styles.twoCol}>
          <Card variant="outlined" style={styles.formCard}><Text style={styles.cardTitle}>Prepare meeting minutes</Text><Input label="Meeting title" value={minuteTitle} onChangeText={(value) => { setMinuteTitle(value); setMinuteNote(null); }} placeholder="e.g. September General Meeting" /><View style={styles.field}><Text style={styles.label}>Minutes body</Text><TextInput accessibilityLabel="Meeting minutes body" multiline value={minuteBody} onChangeText={(value) => { setMinuteBody(value); setMinuteNote(null); }} placeholder="Record agenda outcomes, decisions and action items" placeholderTextColor={colors.textMuted} style={[styles.textarea, styles.minutesArea]} /></View><Button fullWidth disabled={!canSaveMinutes} onPress={saveMinutesPrototype}>Validate minutes draft</Button>{minuteNote ? <View style={styles.note}><Check color={colors.success} size={16} /><Text style={styles.noteText}>{minuteNote}</Text></View> : null}</Card>
          <Card variant="outlined" style={styles.listCard}><Text style={styles.cardTitle}>Published minutes</Text>{minutes.map((item) => <View key={item.id} style={styles.minuteRow}><View><Text style={styles.broadcastTitle}>{item.title}</Text><Text style={styles.meta}>{item.date}</Text></View><Badge variant="success">{item.status}</Badge></View>)}</Card>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  titleWrap: { gap: 4, maxWidth: 760 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  tabs: { borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  tab: { borderBottomColor: 'transparent', borderBottomWidth: 2, paddingVertical: 12 },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 13, fontWeight: '800' },
  tabTextActive: { color: colors.primary },
  context: { alignItems: 'center', backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  contextText: { color: colors.primaryDark, flex: 1, fontSize: 12, fontWeight: '700' },
  twoCol: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  formCard: { flexGrow: 1, gap: spacing.md, minWidth: 300 },
  listCard: { flexGrow: 1, gap: spacing.md, minWidth: 300 },
  cardTitle: { color: colors.navy, fontSize: 16, fontWeight: '900' },
  field: { gap: 6 },
  label: { color: colors.text, fontSize: 12, fontWeight: '800' },
  textarea: { borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, color: colors.text, minHeight: 120, outlineStyle: 'none', padding: spacing.md, textAlignVertical: 'top' } as any,
  minutesArea: { minHeight: 180 },
  help: { color: colors.textMuted, fontSize: 11 },
  note: { alignItems: 'flex-start', backgroundColor: colors.successSoft, borderRadius: radii.md, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  noteText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
  broadcast: { borderBottomColor: colors.border, borderBottomWidth: 1, gap: 5, paddingBottom: spacing.md },
  broadcastTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  broadcastText: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  meta: { color: colors.textMuted, fontSize: 11 },
  meetingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  meetingCard: { flexGrow: 1, gap: spacing.sm, minWidth: 250, maxWidth: 420 },
  meetingIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 17, height: 38, justifyContent: 'center', width: 38 },
  rsvp: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  rsvpText: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  minuteRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', paddingBottom: spacing.md },
});
