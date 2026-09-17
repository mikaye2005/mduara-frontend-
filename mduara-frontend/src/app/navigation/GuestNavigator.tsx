import React, { useMemo, useRef, useState } from 'react';
import {
	Linking,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
	useWindowDimensions,
} from 'react-native';
import { BarChart3, Check, HandCoins, LockKeyhole, Mail, MapPin, Minus, Phone, Plus, Search, ShieldCheck, WalletCards } from 'lucide-react-native';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MduaraBrand } from '../../components/brand/MduaraBrand';
import { ChamaPreviewBox } from '../../features/chama/components/ChamaPreviewBox';
import { publicChamas, type PublicChama, type SavingGoal } from '../../shared/prototype';
import { LandingTop, type LandingAnchor } from '../../features/landing/LandingTop';
import { GoalMarketplaceSection } from '../../features/landing/GoalMarketplaceSection';
import { GoalMatchingFlow } from '../../features/landing/GoalMatchingFlow';
import { PublicChamaDetail } from '../../features/landing/PublicChamaDetail';
import { brand } from '../../theme/brand';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

interface GuestNavigatorProps {
	onApply: (chama: PublicChama) => void;
	onCreateAccount: () => void;
	onSignIn: () => void;
	onSignInToApply: (chama: PublicChama) => void;
}

const steps = [
	{
		title: 'Discover',
		copy: 'Explore public Chamas and compare goals, contribution plans, membership and progress.',
	},
	{
		title: 'Join',
		copy: 'Apply to the right group and complete onboarding through one guided flow.',
	},
	{
		title: 'Contribute',
		copy: 'Track contributions and payment history with M-Pesa-friendly workflows.',
	},
	{
		title: 'Grow together',
		copy: 'Manage savings, loans, meetings and shared financial goals transparently.',
	},
];

const tools = [
	{
		icon: WalletCards,
		title: 'Contribution tracking',
		copy: 'See expected contributions, payment history and completion progress in one place.',
	},
	{
		icon: HandCoins,
		title: 'Loan management',
		copy: 'Keep lending records organised with clear balances, schedules and accountability.',
	},
	{
		icon: BarChart3,
		title: 'Group analytics',
		copy: 'Understand capital growth, liquidity and member participation using simple visual insights.',
	},
];

const pricingPlans = [
	{
		tag: 'Member',
		title: 'Explore & Join',
		description: 'Discover Chamas, compare rules and apply to a group that fits your goal.',
		price: 'KSh 0',
		priceNote: 'to browse',
		features: ['Goal-based Chama discovery', 'Constitution & rules preview', 'Join fee shown before payment', 'KSh 500 refundable commitment where applicable*'],
		action: 'explore' as const,
		cta: 'Explore Chamas',
	},
	{
		tag: 'Most useful',
		title: 'Premium Chama',
		description: 'For active groups that need richer reporting, higher limits and more automation.',
		price: 'KSh 999',
		priceNote: '/ month',
		features: ['Higher member & feature limits', 'Advanced reports & exports', 'Expanded notification quotas', 'Priority group-management tools'],
		action: 'register' as const,
		cta: 'See Premium',
		featured: true,
	},
	{
		tag: 'Founder',
		title: 'Start a Chama',
		description: 'Create the Chama, set recruitment, rules and invite the first members.',
		price: 'KSh 3,000',
		priceNote: 'one-time setup',
		features: ['Chama creation & dashboard', 'Member management & recruitment', 'Digital Constitution & acceptance', 'Contribution tracking & notifications'],
		action: 'register' as const,
		cta: 'Start a Chama',
	},
];

const faqItems = [
	{ question: 'What is the KSh 500 commitment deposit?', answer: 'It is a commitment amount attached to the rules of the Chama you join. It is not treated as ordinary M-Duara platform revenue, and the member is shown when it is refundable and when it may be forfeited.' },
	{ question: 'Can I join a Chama with people I do not know?', answer: 'Yes. The discovery flow is designed for goal-based matching. Before joining, you see the Chama’s goal, contribution amount, duration, rules, recruitment status, Constitution and commitment requirements.' },
	{ question: 'Does M-Duara directly hold the Chama’s money?', answer: 'The intended architecture keeps M-Duara as the software and coordination layer. Payments, custody and payouts are designed around the appropriate authorised payment or financial-service provider structure rather than a general M-Duara bank account.' },
	{ question: 'What happens if I miss a contribution?', answer: 'The Chama’s accepted rules define the grace period, reminders, penalties and repeated-default consequences. The member should see the escalation clearly instead of waiting until a third missed contribution to discover the consequence.' },
	{ question: 'Can a Chama change its rules after I join?', answer: 'Amendments should be recorded with the date, the change, the approval process and the Constitution version. Members are notified, and the platform retains a record of the version each member accepted.' },
];
const landingContact = {
	email: 'support@mduara.co.ke',
	location: 'Nairobi, Kenya',
	phone: '+254 700 000 000',
};

const webAnchorStyle = Platform.OS === 'web' ? ({ scrollMarginTop: 96 } as any) : undefined;

export function GuestNavigator({ onApply, onCreateAccount, onSignIn, onSignInToApply }: GuestNavigatorProps) {
	const { width } = useWindowDimensions();
	const isCompact = width < 760;
	const isWide = width >= 1040;
	const scrollRef = useRef<ScrollView>(null);
	const sectionOffsets = useRef<Partial<Record<LandingAnchor, number>>>({});
	const [isScrolled, setIsScrolled] = useState(false);
	const [query, setQuery] = useState('');
	const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
	const [selectedChama, setSelectedChama] = useState<PublicChama | null>(null);
	const [matchingGoal, setMatchingGoal] = useState<SavingGoal | null>(null);

	const filteredChamas = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return publicChamas;
		return publicChamas.filter((chama) =>
			`${chama.name} ${chama.type} ${chama.description}`.toLowerCase().includes(normalizedQuery),
		);
	}, [query]);

	const featuredChamas = filteredChamas.slice(0, isWide ? 3 : 4);

	if (selectedChama) {
		return (
			<PublicChamaDetail
				chama={selectedChama}
				onBack={() => setSelectedChama(null)}
				onCreateAccount={(chama) => {
					setSelectedChama(null);
					onApply(chama);
				}}
				onSignIn={(chama) => {
					setSelectedChama(null);
					onSignInToApply(chama);
				}}
			/>
		);
	}

	if (matchingGoal) {
		return (
			<GoalMatchingFlow
				goal={matchingGoal}
				onBack={() => setMatchingGoal(null)}
				onViewChama={(chama) => {
					setMatchingGoal(null);
					setSelectedChama(chama);
				}}
			/>
		);
	}

	const rememberSection = (target: LandingAnchor, y: number) => {
		sectionOffsets.current[target] = y;
	};

	const navigateToSection = (target: LandingAnchor) => {
		if (Platform.OS === 'web') {
			const targetElement = document.getElementById(`landing-${target}`);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
				return;
			}
		}

		const y = sectionOffsets.current[target];
		if (typeof y === 'number') {
			scrollRef.current?.scrollTo({ y: Math.max(0, y - 78), animated: true });
		}
	};

	return (
		<>
			<ScrollView
				ref={scrollRef}
				style={styles.page}
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
				onScroll={({ nativeEvent }) => setIsScrolled(nativeEvent.contentOffset.y > 12)}
				scrollEventThrottle={16}
			>
				<LandingTop
					isScrolled={isScrolled}
					onCreateAccount={onCreateAccount}
					onHome={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
					onJoin={() => navigateToSection('explore')}
					onLogin={onSignIn}
					onNavigate={navigateToSection}
					onStart={onCreateAccount}
				/>

				<View nativeID="landing-explore" style={[styles.section, webAnchorStyle]} onLayout={(event) => rememberSection('explore', event.nativeEvent.layout.y)}>
					<View style={[styles.sectionHeaderRow, isCompact && styles.stack]}>
						<View style={styles.sectionCopy}>
							<Text style={styles.sectionEyebrow}>Explore Chamas</Text>
							<Text style={styles.sectionTitle}>Find a Chama that fits your goal.</Text>
							<Text style={styles.sectionText}>Compare contribution, membership, frequency and available spaces before you open a Chama's full details.</Text>
						</View>
						<View style={styles.searchRow}>
							<Search color={colors.textMuted} size={18} />
							<TextInput
								placeholder="Search Chamas"
								placeholderTextColor={colors.textMuted}
								style={styles.searchInput}
								value={query}
								onChangeText={setQuery}
							/>
						</View>
					</View>
					<View style={[styles.chamaGrid, isCompact && styles.chamaGridCompact]}>
						{featuredChamas.map((chama) => (
							<ChamaPreviewBox key={chama.id} chama={chama} onViewDetails={setSelectedChama} />
						))}
					</View>
				</View>

				<GoalMarketplaceSection onStartMatching={setMatchingGoal} />
				<View nativeID="landing-how" style={[styles.darkSection, webAnchorStyle]} onLayout={(event) => rememberSection('how', event.nativeEvent.layout.y)}>
					<View style={styles.sectionIntroDark}>
						<Text style={styles.sectionEyebrowDark}>How it works</Text>
						<Text style={styles.sectionTitleDark}>From discovery to shared financial progress.</Text>
						<Text style={styles.sectionTextDark}>A simple digital journey designed around how real Chamas operate.</Text>
					</View>
					<View style={[styles.stepGrid, isWide && styles.rowGrid]}>
						{steps.map((step, index) => (
							<View key={step.title} style={[styles.stepCard, isWide && styles.flexCard]}>
								<View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View>
								<Text style={styles.stepTitle}>{step.title}</Text>
								<Text style={styles.stepText}>{step.copy}</Text>
							</View>
						))}
					</View>
				</View>

				<View nativeID="landing-features" style={[styles.section, styles.softSection, webAnchorStyle]} onLayout={(event) => rememberSection('features', event.nativeEvent.layout.y)}>
					<View style={styles.sectionCentered}>
						<Text style={styles.sectionEyebrow}>Everything in one place</Text>
						<Text style={styles.sectionTitle}>Tools built around Chama operations.</Text>
						<Text style={styles.sectionText}>Manage the day-to-day work without losing the simplicity that makes group saving powerful.</Text>
					</View>
					<View style={[styles.toolGrid, isWide && styles.rowGrid]}>
						{tools.map(({ icon: Icon, title, copy }) => (
							<Card key={title} variant="outlined" style={[styles.toolCard, isWide && styles.flexCard]}>
								<View style={styles.toolIcon}><Icon color={colors.primary} size={23} /></View>
								<Text style={styles.toolTitle}>{title}</Text>
								<Text style={styles.toolText}>{copy}</Text>
							</Card>
						))}
					</View>
				</View>

				<View nativeID="landing-trust" style={[styles.trustSection, isWide && styles.trustWide, webAnchorStyle]} onLayout={(event) => rememberSection('trust', event.nativeEvent.layout.y)}>
					<View style={styles.trustVisual}>
						<View style={styles.flowNode}><LockKeyhole size={20} color="#CDBFFF" /><View><Text style={styles.flowTitle}>Secure access</Text><Text style={styles.flowText}>Authenticated accounts and controlled permissions</Text></View></View>
						<Text style={styles.flowArrow}>↓</Text>
						<View style={styles.flowNode}><WalletCards size={20} color="#CDBFFF" /><View><Text style={styles.flowTitle}>Recorded transactions</Text><Text style={styles.flowText}>Contributions and loan activity remain visible</Text></View></View>
						<Text style={styles.flowArrow}>↓</Text>
						<View style={styles.flowNode}><ShieldCheck size={20} color="#CDBFFF" /><View><Text style={styles.flowTitle}>Transparent accountability</Text><Text style={styles.flowText}>Members can trust shared financial records</Text></View></View>
					</View>
					<View style={[styles.trustCopy, isWide && styles.trustCopyWide]}>
						<Text style={styles.sectionEyebrow}>Trust by design</Text>
						<Text style={styles.sectionTitle}>Built to make group finances easier to understand.</Text>
						<Text style={styles.sectionText}>M-Duara keeps key financial and membership activity organised so Chamas can operate with clearer accountability.</Text>
						<View style={styles.trustList}>
							{['Role-based permissions', 'Structured contribution history', 'Clear loan and meeting records'].map((item) => (
								<View key={item} style={styles.trustItem}><View style={styles.trustCheck}><Check size={14} color="#15935D" /></View><Text style={styles.trustItemText}>{item}</Text></View>
							))}
						</View>
					</View>
				</View>

				<View nativeID="landing-pricing" style={[styles.section, styles.pricingSection, webAnchorStyle]} onLayout={(event) => rememberSection('pricing', event.nativeEvent.layout.y)}>
					<View style={styles.sectionCentered}>
						<Text style={styles.sectionEyebrow}>Simple pricing</Text>
						<Text style={styles.sectionTitle}>Start small. Upgrade when the Chama needs more.</Text>
						<Text style={styles.sectionText}>A clean MVP pricing presentation for members and Chama founders.</Text>
					</View>
					<View style={styles.priceNote}>
						<Text style={styles.priceNoteText}>Premium figures below are prototype sample pricing. Final recurring and join-fee amounts are still configurable business decisions.</Text>
					</View>
					<View style={[styles.pricingGrid, isWide && styles.rowGrid]}>
						{pricingPlans.map((plan) => (
							<View key={plan.title} style={[styles.priceCard, isWide && styles.flexCard, plan.featured && styles.priceCardFeatured]}>
								<View style={[styles.priceTag, plan.featured && styles.priceTagFeatured]}><Text style={[styles.priceTagText, plan.featured && styles.priceTagTextFeatured]}>{plan.tag}</Text></View>
								<Text style={[styles.priceTitle, plan.featured && styles.priceTextFeatured]}>{plan.title}</Text>
								<Text style={[styles.priceDescription, plan.featured && styles.priceDescriptionFeatured]}>{plan.description}</Text>
								<View style={styles.priceMainRow}><Text style={[styles.priceMain, plan.featured && styles.priceTextFeatured]}>{plan.price}</Text><Text style={[styles.priceMainNote, plan.featured && styles.priceDescriptionFeatured]}>{plan.priceNote}</Text></View>
								{plan.featured ? <Text style={styles.prototypePrice}>Sample prototype price — editable before launch</Text> : null}
								<View style={styles.priceFeatureList}>
									{plan.features.map((feature) => <View key={feature} style={styles.priceFeature}><Check size={14} color={plan.featured ? colors.brandInversePurple : colors.success} /><Text style={[styles.priceFeatureText, plan.featured && styles.priceDescriptionFeatured]}>{feature}</Text></View>)}
								</View>
								<Button variant={plan.featured ? 'primary' : 'secondary'} onPress={() => plan.action === 'explore' ? navigateToSection('explore') : onCreateAccount}>{plan.cta}</Button>
							</View>
						))}
					</View>
					<Text style={styles.commitmentFootnote}>* The KSh 500 commitment amount is presented separately from M-Duara revenue. In the intended model it is held through the appropriate payment/custody arrangement and is refundable or forfeitable according to the Chama rules the member accepted.</Text>
				</View>

				<View nativeID="landing-faq" style={[styles.faqSection, webAnchorStyle]} onLayout={(event) => rememberSection('faq', event.nativeEvent.layout.y)}>
					<View style={styles.faqIntro}>
						<Text style={styles.sectionEyebrow}>FAQs</Text>
						<Text style={styles.sectionTitle}>Know what you are joining.</Text>
						<Text style={styles.sectionText}>Clear answers matter when people are saving together — especially when members may not already know each other personally.</Text>
						<Button variant="secondary" onPress={onSignIn}>Visit Help & Support</Button>
					</View>
					<View style={styles.faqList}>
						{faqItems.map((item, index) => {
							const open = openFaqIndex === index;
							return (
								<Pressable key={item.question} accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpenFaqIndex(open ? null : index)} style={({ pressed }) => [styles.faqItem, pressed && styles.faqItemPressed]}>
									<View style={styles.faqQuestionRow}><Text style={styles.faqQuestion}>{item.question}</Text>{open ? <Minus size={18} color={colors.primary} /> : <Plus size={18} color={colors.primary} />}</View>
									{open ? <Text style={styles.faqAnswer}>{item.answer}</Text> : null}
								</Pressable>
							);
						})}
					</View>
				</View>

				<View style={[styles.cta, isCompact && styles.ctaCompact]}>
					<View style={styles.ctaCopy}>
						<Text style={styles.ctaTitle}>Ready to grow with your Chama?</Text>
						<Text style={styles.ctaText}>Discover a group, register securely and start managing your savings journey with confidence.</Text>
					</View>
					<View style={[styles.ctaActions, isCompact && styles.heroActionsCompact]}>
						<Button onPress={onCreateAccount}>Get Started</Button>
						<Button variant="secondary" onPress={onSignIn}>Sign In</Button>
					</View>
				</View>

				<View style={styles.footer}>
					<View style={[styles.footerInner, isWide && styles.footerInnerWide]}>
						<View style={[styles.footerIntro, isWide && styles.footerIntroWide]}>
							<MduaraBrand tone="dark" variant="full" width={isCompact ? 180 : 220} />
							<Text style={styles.footerText}>{brand.tagline}</Text>
							<Text style={styles.footerMeta}>A mobile-first Chama marketplace and management platform built around shared goals, clear rules and transparent progress.</Text>
						</View>

						<View style={styles.footerColumns}>
							<View style={styles.footerColumn}>
								<Text style={styles.footerHeading}>Explore</Text>
								<Pressable accessibilityRole="link" onPress={() => navigateToSection('explore')} style={styles.footerLink}><Text style={styles.footerLinkText}>Browse Chamas</Text></Pressable>
								<Pressable accessibilityRole="link" onPress={() => navigateToSection('how')} style={styles.footerLink}><Text style={styles.footerLinkText}>How it works</Text></Pressable>
								<Pressable accessibilityRole="link" onPress={onCreateAccount} style={styles.footerLink}><Text style={styles.footerLinkText}>Start a Chama</Text></Pressable>
							</View>

							<View style={styles.footerColumn}>
								<Text style={styles.footerHeading}>Learn</Text>
								<Pressable accessibilityRole="link" onPress={() => navigateToSection('features')} style={styles.footerLink}><Text style={styles.footerLinkText}>Features</Text></Pressable>
								<Pressable accessibilityRole="link" onPress={() => navigateToSection('trust')} style={styles.footerLink}><Text style={styles.footerLinkText}>Safety and trust</Text></Pressable>
								<Pressable accessibilityRole="link" onPress={() => navigateToSection('faq')} style={styles.footerLink}><Text style={styles.footerLinkText}>Help and FAQs</Text></Pressable>
							</View>

							<View style={styles.footerColumn}>
								<Text style={styles.footerHeading}>Contact and find us</Text>
								<Pressable accessibilityLabel={`Email ${landingContact.email}`} accessibilityRole="link" onPress={() => void Linking.openURL(`mailto:${landingContact.email}`)} style={styles.footerContactLink}>
									<Mail color="#AEB6CB" size={15} />
									<Text style={styles.footerLinkText}>{landingContact.email}</Text>
								</Pressable>
								<Pressable accessibilityLabel={`Call ${landingContact.phone}`} accessibilityRole="link" onPress={() => void Linking.openURL(`tel:${landingContact.phone.replace(/\s/g, '')}`)} style={styles.footerContactLink}>
									<Phone color="#AEB6CB" size={15} />
									<Text style={styles.footerLinkText}>{landingContact.phone}</Text>
								</Pressable>
								<Pressable accessibilityLabel={`Find M-Duara in ${landingContact.location}`} accessibilityRole="link" onPress={() => void Linking.openURL('https://www.google.com/maps/search/?api=1&query=Nairobi%2C%20Kenya')} style={styles.footerContactLink}>
									<MapPin color="#AEB6CB" size={15} />
									<Text style={styles.footerLinkText}>{landingContact.location}</Text>
								</Pressable>
							</View>
						</View>
					</View>

					<View style={[styles.footerBottom, isCompact && styles.footerBottomCompact]}>
						<Text style={styles.footerBottomText}>Copyright 2026 M-Duara. All rights reserved.</Text>
						<Text style={styles.footerBottomText}>{brand.shortTagline}</Text>
					</View>
				</View>
			</ScrollView>

		</>
	);
}

const styles = StyleSheet.create({
	page: { backgroundColor: '#FFFFFF' },
	content: { backgroundColor: '#FFFFFF', paddingBottom: 28 },
	nav: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 14, paddingVertical: 12 },
	navCompact: { gap: 12 },
	brandWrap: { alignItems: 'center', flexDirection: 'row', gap: 10 },
	brandMark: { alignItems: 'center', backgroundColor: '#6338D4', borderRadius: 11, height: 38, justifyContent: 'center', width: 38 },
	brandMarkText: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
	brand: { color: '#101629', fontSize: 17, fontWeight: '900' },
	brandSub: { color: '#7B8190', fontSize: 9, marginTop: 1 },
	navActions: { alignItems: 'center', flexDirection: 'row', gap: 14 },
	navLink: { color: '#4E5567', fontSize: 12, fontWeight: '700' },
	hero: { backgroundColor: '#FBFAFF', gap: 30, marginTop: 8, overflow: 'hidden', paddingHorizontal: 22, paddingVertical: 50 },
	heroWide: { alignItems: 'center', flexDirection: 'row', minHeight: 610, paddingHorizontal: 54, paddingVertical: 64 },
	heroCopy: { gap: 18 },
	heroCopyWide: { flex: 1.05, paddingRight: 24 },
	eyebrow: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#F0EBFF', borderColor: '#DCD1FF', borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 7, paddingHorizontal: 11, paddingVertical: 7 },
	eyebrowText: { color: '#4D29B4', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
	heading: { color: '#101629', fontSize: 52, fontWeight: '900', letterSpacing: -2.1, lineHeight: 55, maxWidth: 700 },
	headingCompact: { fontSize: 42, letterSpacing: -1.7, lineHeight: 45 },
	headingAccent: { color: '#6338D4' },
	description: { color: '#6E7483', fontSize: 16, lineHeight: 26, maxWidth: 620 },
	heroActions: { flexDirection: 'row', gap: 10 },
	heroActionsCompact: { alignItems: 'stretch', flexDirection: 'column' },
	heroMicro: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
	microItem: { alignItems: 'center', flexDirection: 'row', gap: 6 },
	microText: { color: '#707684', fontSize: 11, fontWeight: '600' },
	heroVisual: { minHeight: 440, position: 'relative' },
	heroVisualWide: { flex: 0.95, minHeight: 500 },
	device: { backgroundColor: '#101629', borderRadius: 26, padding: 12, transform: [{ rotate: '-2deg' }] },
	deviceTop: { alignItems: 'center', backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, flexDirection: 'row', gap: 8, padding: 14 },
	deviceBrandMark: { backgroundColor: '#6338D4', borderRadius: 7, height: 24, width: 24 },
	deviceBrand: { color: '#101629', fontSize: 11, fontWeight: '900' },
	deviceAvatar: { alignItems: 'center', backgroundColor: '#F0EBFF', borderRadius: 999, height: 28, justifyContent: 'center', marginLeft: 'auto', width: 28 },
	deviceAvatarText: { color: '#6338D4', fontSize: 8, fontWeight: '900' },
	deviceBody: { backgroundColor: '#F7F8FB', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: 18 },
	deviceLabel: { color: '#8B91A0', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
	deviceTitle: { color: '#101629', fontSize: 20, fontWeight: '900', marginTop: 5 },
	progressTrack: { backgroundColor: '#E5E8EF', borderRadius: 99, height: 7, marginTop: 18, overflow: 'hidden' },
	progressFill: { backgroundColor: '#6338D4', borderRadius: 99, height: 7, width: '62%' },
	deviceStats: { flexDirection: 'row', gap: 8, marginTop: 16 },
	deviceStat: { backgroundColor: '#FFFFFF', borderColor: '#ECEEF3', borderRadius: 11, borderWidth: 1, flex: 1, padding: 10 },
	deviceStatLabel: { color: '#8B91A0', fontSize: 8 },
	deviceStatValue: { color: '#101629', fontSize: 11, fontWeight: '900', marginTop: 4 },
	quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
	quickCard: { backgroundColor: '#FFFFFF', borderColor: '#ECEEF3', borderRadius: 12, borderWidth: 1, flexBasis: '47%', flexGrow: 1, gap: 7, padding: 12 },
	quickCardText: { color: '#101629', fontSize: 10, fontWeight: '800' },
	floatCardOne: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#DCD1FF', borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 9, padding: 11, position: 'absolute', right: 2, top: 36 },
	floatCardTwo: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#DCD1FF', borderRadius: 14, borderWidth: 1, bottom: 22, flexDirection: 'row', gap: 9, left: 2, padding: 11, position: 'absolute' },
	floatTitle: { color: '#101629', fontSize: 10, fontWeight: '900' },
	floatText: { color: '#7D8392', fontSize: 8, marginTop: 2 },
	goalStrip: { backgroundColor: '#FFFFFF', borderColor: '#E7EAF0', borderRadius: 18, borderWidth: 1, gap: 12, marginHorizontal: 20, marginTop: 24, padding: 16 },
	goalLabel: { color: '#101629', fontSize: 11, fontWeight: '900' },
	goalChipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	goalChip: { backgroundColor: '#FAFAFE', borderColor: '#EEEEF5', borderRadius: 11, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 },
	goalChipText: { color: '#555C6C', fontSize: 10, fontWeight: '700' },
	darkSection: { backgroundColor: '#101629', marginTop: 58, paddingHorizontal: 22, paddingVertical: 64 },
	sectionIntroDark: { gap: 10, maxWidth: 760 },
	sectionEyebrowDark: { color: '#BBAAF4', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
	sectionTitleDark: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -1.2, lineHeight: 39 },
	sectionTextDark: { color: '#AEB6CB', fontSize: 14, lineHeight: 22 },
	stepGrid: { gap: 12, marginTop: 28 },
	rowGrid: { flexDirection: 'row' },
	stepCard: { backgroundColor: '#181F36', borderColor: '#2A334F', borderRadius: 17, borderWidth: 1, gap: 10, minHeight: 190, padding: 20 },
	flexCard: { flex: 1 },
	stepNumber: { alignItems: 'center', backgroundColor: '#6338D4', borderRadius: 12, height: 40, justifyContent: 'center', width: 40 },
	stepNumberText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
	stepTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
	stepText: { color: '#AEB6CB', fontSize: 12, lineHeight: 19 },
	section: { paddingHorizontal: 22, paddingVertical: 64 },
	softSection: { backgroundColor: '#FBFAFF' },
	sectionHeaderRow: { alignItems: 'flex-end', flexDirection: 'row', gap: 20, justifyContent: 'space-between' },
	stack: { alignItems: 'stretch', flexDirection: 'column' },
	sectionCopy: { flex: 1, maxWidth: 720 },
	sectionCentered: { alignItems: 'center', marginBottom: 28 },
	sectionEyebrow: { color: '#4D29B4', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
	sectionTitle: { color: '#101629', fontSize: 32, fontWeight: '900', letterSpacing: -1.1, lineHeight: 38, marginTop: 8 },
	sectionText: { color: '#6E7483', fontSize: 14, lineHeight: 22, marginTop: 8, maxWidth: 720 },
	searchRow: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E7EAF0', borderRadius: 13, borderWidth: 1, flexDirection: 'row', gap: 8, minWidth: 260, paddingHorizontal: 14 },
	searchInput: { color: '#171A27', flex: 1, minHeight: 46 },
	chamaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 26 },
	chamaGridCompact: { flexDirection: 'column' },
	toolGrid: { gap: 12 },
	toolCard: { gap: 11, minHeight: 185, padding: 20 },
	toolIcon: { alignItems: 'center', backgroundColor: '#F0EBFF', borderRadius: 12, height: 44, justifyContent: 'center', width: 44 },
	toolTitle: { color: '#101629', fontSize: 16, fontWeight: '900' },
	toolText: { color: '#6E7483', fontSize: 12, lineHeight: 19 },
	trustSection: { gap: 28, paddingHorizontal: 22, paddingVertical: 70 },
	trustWide: { alignItems: 'center', flexDirection: 'row' },
	trustVisual: { backgroundColor: '#101629', borderRadius: 24, flex: 0.9, padding: 24 },
	flowNode: { alignItems: 'center', backgroundColor: '#181F36', borderColor: '#2A334F', borderRadius: 13, borderWidth: 1, flexDirection: 'row', gap: 11, padding: 14 },
	flowTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
	flowText: { color: '#AEB6CB', fontSize: 9, marginTop: 3 },
	flowArrow: { color: '#A68CF2', fontSize: 18, fontWeight: '900', paddingVertical: 5, textAlign: 'center' },
	trustCopy: { flex: 1.1 },
	trustCopyWide: { paddingLeft: 20 },
	trustList: { gap: 10, marginTop: 18 },
	trustItem: { alignItems: 'center', flexDirection: 'row', gap: 10 },
	trustCheck: { alignItems: 'center', backgroundColor: '#EAF8F1', borderRadius: 9, height: 28, justifyContent: 'center', width: 28 },
	trustItemText: { color: '#3F4655', fontSize: 12, fontWeight: '700' },
	pricingSection: { backgroundColor: colors.background },
	priceNote: { alignSelf: 'center', backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: 12, borderWidth: 1, marginTop: 18, maxWidth: 820, paddingHorizontal: 16, paddingVertical: 12 },
	priceNoteText: { color: colors.primaryDark, fontSize: 11, fontWeight: '700', lineHeight: 17, textAlign: 'center' },
	pricingGrid: { gap: 14, marginTop: 22 },
	priceCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, gap: 13, padding: 22 },
	priceCardFeatured: { backgroundColor: colors.navy, borderColor: colors.navySoft },
	priceTag: { alignSelf: 'flex-start', backgroundColor: colors.primaryLight, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
	priceTagFeatured: { backgroundColor: colors.primary },
	priceTagText: { color: colors.primaryDark, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
	priceTagTextFeatured: { color: colors.white },
	priceTitle: { color: colors.navy, fontSize: 21, fontWeight: '900' },
	priceTextFeatured: { color: colors.white },
	priceDescription: { color: colors.textMuted, fontSize: 12, lineHeight: 19 },
	priceDescriptionFeatured: { color: '#C6CCDB' },
	priceMainRow: { alignItems: 'baseline', flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	priceMain: { color: colors.navy, fontSize: 28, fontWeight: '900' },
	priceMainNote: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
	prototypePrice: { color: colors.brandInversePurple, fontSize: 9, fontWeight: '700' },
	priceFeatureList: { gap: 9 },
	priceFeature: { alignItems: 'flex-start', flexDirection: 'row', gap: 8 },
	priceFeatureText: { color: colors.text, flex: 1, fontSize: 11, lineHeight: 17 },
	commitmentFootnote: { color: colors.textMuted, fontSize: 9, lineHeight: 15, marginTop: 16 },
	faqSection: { gap: 28, paddingHorizontal: 22, paddingVertical: 70 },
	faqIntro: { alignItems: 'flex-start', gap: 12, maxWidth: 740 },
	faqList: { gap: 10 },
	faqItem: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 15 },
	faqItemPressed: { opacity: 0.86 },
	faqQuestionRow: { alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
	faqQuestion: { color: colors.navy, flex: 1, fontSize: 13, fontWeight: '800' },
	faqAnswer: { color: colors.textMuted, fontSize: 11, lineHeight: 18, marginTop: 12, maxWidth: 920 },
	cta: { alignItems: 'center', backgroundColor: '#101629', borderRadius: 26, flexDirection: 'row', gap: 24, justifyContent: 'space-between', marginHorizontal: 20, marginTop: 12, padding: 34 },
	ctaCompact: { alignItems: 'stretch', flexDirection: 'column' },
	ctaCopy: { flex: 1 },
	ctaTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', letterSpacing: -1, lineHeight: 35 },
	ctaText: { color: '#BFC6D8', fontSize: 13, lineHeight: 20, marginTop: 8, maxWidth: 650 },
	ctaActions: { flexDirection: 'row', gap: 8 },
	footer: { backgroundColor: colors.navy, gap: 34, marginTop: 48, paddingHorizontal: 22, paddingTop: 52 },
	footerInner: { alignSelf: 'center', gap: 36, maxWidth: 1180, width: '100%' },
	footerInnerWide: { flexDirection: 'row', justifyContent: 'space-between' },
	footerIntro: { gap: 12 },
	footerIntroWide: { flex: 1.15, maxWidth: 370 },
	footerText: { color: colors.white, fontSize: 12, fontWeight: '800' },
	footerMeta: { color: '#AEB6CB', fontSize: 11, lineHeight: 18, maxWidth: 340 },
	footerColumns: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 26, justifyContent: 'space-between' },
	footerColumn: { flexBasis: 142, flexGrow: 1, gap: 10 },
	footerHeading: { color: colors.white, fontSize: 11, fontWeight: '900', letterSpacing: 0.45, marginBottom: 3, textTransform: 'uppercase' },
	footerLink: { alignSelf: 'flex-start', minHeight: 24, justifyContent: 'center' },
	footerLinkText: { color: '#AEB6CB', fontSize: 11, fontWeight: '600' },
	footerContactLink: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 8, minHeight: 24 },
	footerBottom: { alignItems: 'center', alignSelf: 'center', borderTopColor: 'rgba(255,255,255,.1)', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', maxWidth: 1180, paddingBottom: 24, paddingTop: 20, width: '100%' },
	footerBottomCompact: { alignItems: 'flex-start', flexDirection: 'column', gap: 7 },
	footerBottomText: { color: '#8993AC', fontSize: 9, fontWeight: '600' },
	modalDescription: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 21 },
});
