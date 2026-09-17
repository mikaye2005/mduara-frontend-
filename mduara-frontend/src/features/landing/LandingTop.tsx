import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Menu, X } from 'lucide-react-native';

import { MduaraBrand } from '../../components/brand/MduaraBrand';
import { colors } from '../../theme/colors';

const COLORS = {
  navy: colors.navy,
  navy2: colors.navyRaised,
  navy3: colors.navySoft,
  purple: colors.primary,
  purple2: colors.primaryBright,
  purpleDark: colors.primaryDark,
  purpleSoft: colors.primaryLight,
  purpleLine: colors.primaryLine,
  ink: colors.text,
  muted: colors.textMuted,
  line: colors.border,
  bg: colors.background,
  white: colors.white,
  green: colors.success,
  greenSoft: colors.successSoft,
};

const goalChips = [
  ['💼', 'Business'],
  ['🏠', 'Home & Land'],
  ['🎓', 'Education'],
  ['✈️', 'Travel'],
  ['🆘', 'Emergency'],
] as const;

const navLinks = [
  ['Explore Chamas', 'explore'],
  ['How it works', 'how'],
  ['Features', 'features'],
  ['Safety & Trust', 'trust'],
  ['Pricing', 'pricing'],
  ['FAQs', 'faq'],
] as const;

export type LandingAnchor = (typeof navLinks)[number][1];

interface LandingTopProps {
  activeAnchor?: LandingAnchor | null;
  isScrolled?: boolean;
  onCreateAccount: () => void;
  onHome?: () => void;
  onJoin: () => void;
  onLogin: () => void;
  onNavigate?: (target: LandingAnchor) => void;
  onStart: () => void;
}

function webStyle<T extends object>(style: T): T | undefined {
  return Platform.OS === 'web' ? style : undefined;
}

function LandingButton({
  children,
  variant = 'primary',
  onPress,
  compact = false,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'dark' | 'outline';
  onPress: () => void;
  compact?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const variantStyle =
    variant === 'primary'
      ? styles.buttonPrimary
      : variant === 'dark'
        ? styles.buttonDark
        : styles.buttonOutline;
  const hoverStyle = hovered
    ? variant === 'primary'
      ? styles.buttonPrimaryHover
      : variant === 'dark'
        ? styles.buttonDarkHover
        : styles.buttonOutlineHover
    : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        variantStyle,
        hoverStyle,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === 'outline' ? styles.buttonTextOutline : styles.buttonTextLight,
          hovered && variant === 'outline' ? styles.buttonTextOutlineHover : undefined,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

function Motion({
  animation,
  children,
  style,
}: {
  animation: Animated.Value;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [26, 0] }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function LandingTop({
  activeAnchor = null,
  isScrolled = false,
  onCreateAccount,
  onHome,
  onJoin,
  onLogin,
  onNavigate,
  onStart,
}: LandingTopProps) {
  const { width } = useWindowDimensions();
  const isTablet = width <= 1140;
  const isMobile = width <= 720;
  const isSmall = width <= 480;
  const [menuOpen, setMenuOpen] = useState(false);

  const motionValues = useRef(Array.from({ length: 8 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    motionValues.forEach((value) => value.setValue(0));
    Animated.stagger(
      90,
      motionValues.map((value) =>
        Animated.timing(value, {
          toValue: 1,
          duration: 620,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [motionValues, width]);

  const containerPadding = isMobile ? 14 : 20;
  const heroTitleSize = isMobile ? Math.min(66, Math.max(46, width * 0.12)) : isTablet ? 62 : Math.min(82, width * 0.062);
  const heroTitleLineHeight = heroTitleSize * 0.98;

  const navWeb = useMemo(
    () => webStyle({
        position: 'sticky',
        top: 0,
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
    } as any),
    [isScrolled],
  );

  const navigate = (target: LandingAnchor) => {
    setMenuOpen(false);
    onNavigate?.(target);
  };

  return (
    <View>
      <View
        style={[
          styles.navShell,
          isScrolled && styles.navShellScrolled,
          navWeb,
          webStyle({ boxShadow: isScrolled ? '0 8px 30px rgba(17,22,41,.045)' : 'none' } as any),
        ]}
      >
        <View style={[styles.container, { paddingHorizontal: containerPadding }, isMobile && styles.navInnerMobile, styles.navInner]}>
          <Pressable accessibilityRole="link" onPress={onHome} style={styles.logoPressable}>
            <MduaraBrand variant="full" width={isMobile ? 156 : 200} />
          </Pressable>

          {!isTablet ? (
            <View style={styles.navLinks} accessibilityLabel="Primary navigation">
              {navLinks.map(([label, target]) => (
                <Pressable
                  key={target}
                  accessibilityRole="link"
                  accessibilityState={{ selected: activeAnchor === target }}
                  onPress={() => navigate(target)}
                  style={styles.navLinkPressable}
                >
                  {({ hovered }: any) => (
                    <Text style={[styles.navLink, activeAnchor === target && styles.navLinkActive, hovered && styles.navLinkHover]}>{label}</Text>
                  )}
                </Pressable>
              ))}
            </View>
          ) : null}

          {!isMobile ? (
            <View style={styles.navActions}>
              <LandingButton variant="outline" compact onPress={onLogin}>Login</LandingButton>
              <LandingButton compact onPress={onCreateAccount}>Create account</LandingButton>
            </View>
          ) : (
            <Pressable
              accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
              accessibilityRole="button"
              onPress={() => setMenuOpen((value) => !value)}
              style={({ pressed }) => [styles.mobileMenuButton, pressed && styles.buttonPressed]}
            >
              {menuOpen ? <X color={COLORS.white} size={20} /> : <Menu color={COLORS.white} size={21} />}
            </Pressable>
          )}
        </View>

        {isMobile && menuOpen ? (
          <View
            style={[
              styles.mobileMenu,
              { left: containerPadding, right: containerPadding },
              webStyle({ boxShadow: '0 24px 70px rgba(21,25,50,.12)' } as any),
            ]}
          >
            {navLinks.map(([label, target]) => (
              <Pressable
                key={target}
                accessibilityRole="link"
                accessibilityState={{ selected: activeAnchor === target }}
                onPress={() => navigate(target)}
                style={({ pressed }) => [styles.mobileMenuLink, activeAnchor === target && styles.mobileMenuLinkActive, pressed && styles.mobileMenuLinkPressed]}
              >
                <Text style={[styles.mobileMenuLinkText, activeAnchor === target && styles.mobileMenuLinkTextActive]}>{label}</Text>
              </Pressable>
            ))}
            <View style={styles.mobileMenuActions}>
              <View style={styles.mobileMenuAction}><LandingButton variant="outline" onPress={onLogin}>Login</LandingButton></View>
              <View style={styles.mobileMenuAction}><LandingButton onPress={onCreateAccount}>Create account</LandingButton></View>
            </View>
          </View>
        ) : null}
      </View>

      <View style={[styles.heroShell, webStyle({ backgroundImage: 'radial-gradient(circle at 83% 17%,rgba(99,56,212,.18),transparent 25%),radial-gradient(circle at 8% 76%,rgba(21,147,93,.07),transparent 20%),linear-gradient(180deg,#fbfaff 0%,#fff 70%)' } as any)]}>
        <View style={styles.heroRingRight} />
        <View style={styles.heroGlowLeft} />

        <View style={[styles.container, { paddingHorizontal: containerPadding }, styles.heroContainer]}>
          <View style={[styles.heroGrid, isTablet && styles.heroGridTablet]}>
            <View style={[styles.heroCopy, isTablet && styles.heroCopyTablet]}>
              <Motion animation={motionValues[0]} style={isTablet && styles.centerOnTablet}>
                <View style={styles.eyebrow}>
                  <View style={styles.eyebrowDot} />
                  <Text style={styles.eyebrowText}>A smarter way to save together</Text>
                </View>
              </Motion>

              <Motion animation={motionValues[1]}>
                <Text
                  style={[
                    styles.heroTitle,
                    { fontSize: heroTitleSize, lineHeight: heroTitleLineHeight },
                    isTablet && styles.heroTitleTablet,
                  ]}
                >
                  Your goal.{"\n"}Your people.{"\n"}<Text style={styles.heroTitleAccent}>Your Chama.</Text>
                </Text>
              </Motion>

              <Motion animation={motionValues[2]}>
                <Text style={[styles.heroDescription, isTablet && styles.heroDescriptionTablet]}>
                  Find people saving toward the same goal, or bring your own Chama into one clear digital space for contributions, rules, progress, decisions and records.
                </Text>
              </Motion>

              <Motion animation={motionValues[3]}>
                <View style={[styles.heroActions, isMobile && styles.heroActionsMobile, isTablet && styles.heroActionsTablet]}>
                  <LandingButton onPress={onJoin}>Join a Chama  →</LandingButton>
                  <LandingButton variant="dark" onPress={onStart}>Start a Chama</LandingButton>
                  <LandingButton variant="outline" onPress={() => navigate('explore')}>Explore first</LandingButton>
                </View>
              </Motion>

              <Motion animation={motionValues[4]}>
                <View style={[styles.heroMicro, isTablet && styles.heroMicroTablet]}>
                  {['Goal-based matching', 'Transparent Chama rules', 'M-Pesa-ready flows'].map((label) => (
                    <View key={label} style={styles.heroMicroItem}>
                      <View style={styles.tick}><Text style={styles.tickText}>✓</Text></View>
                      <Text style={styles.heroMicroText}>{label}</Text>
                    </View>
                  ))}
                </View>
              </Motion>
            </View>

            <View style={[styles.heroVisual, isTablet && styles.heroVisualTablet, isMobile && styles.heroVisualMobile, isSmall && styles.heroVisualSmall]}>
              <Animated.View
                style={[
                  styles.device,
                  isTablet && styles.deviceTablet,
                  isMobile && styles.deviceMobile,
                  isSmall && styles.deviceSmall,
                  webStyle({ boxShadow: '0 36px 90px rgba(16,22,41,.22)' } as any),
                  {
                    opacity: motionValues[2],
                    transform: [
                      { rotate: '-2.5deg' },
                      { translateX: motionValues[2].interpolate({ inputRange: [0, 1], outputRange: [36, 0] }) },
                    ],
                  },
                ]}
              >
                <View style={styles.deviceScreen}>
                  <View style={styles.appTop}>
                    <View style={[styles.appMark, webStyle({ backgroundImage: 'linear-gradient(140deg,#6338D4,#8d6af1)' } as any)]}>
                      <View style={styles.appMarkInner} />
                    </View>
                    <Text style={styles.appTitle}>M-Duara</Text>
                    <View style={styles.avatar}><Text style={styles.avatarText}>MW</Text></View>
                  </View>
                  <View style={styles.appBody}>
                    <Text style={styles.appGreet}>Good morning, Mumbi 👋</Text>
                    <Text style={styles.appHeading}>Your savings at a glance</Text>

                    <View style={[styles.activeCard, webStyle({ backgroundImage: 'linear-gradient(145deg,#101629,#1e2948)' } as any)]}>
                      <Text style={styles.activeSmall}>ACTIVE CHAMA</Text>
                      <Text style={styles.activeTitle}>🎯 Emergency Fund Chama</Text>
                      <View style={styles.progressRow}>
                        <Text style={styles.progressText}>KSh 20,000 saved</Text>
                        <Text style={styles.progressText}>KSh 60,000 target</Text>
                      </View>
                      <View style={styles.progressTrack}><View style={[styles.progressFill, webStyle({ backgroundImage: 'linear-gradient(90deg,#9578ed,#b7a4ff)' } as any)]} /></View>
                      <View style={[styles.activeMeta, isSmall && styles.activeMetaSmall]}>
                        <View style={styles.miniCard}><Text style={styles.miniLabel}>Next contribution</Text><Text style={styles.miniValue}>KSh 10,000</Text></View>
                        <View style={styles.miniCard}><Text style={styles.miniLabel}>Due</Text><Text style={styles.miniValue}>15 Sep</Text></View>
                        {!isSmall ? <View style={styles.miniCard}><Text style={styles.miniLabel}>Status</Text><Text style={styles.miniValueGreen}>● On track</Text></View> : null}
                      </View>
                    </View>

                    <View style={styles.quickGrid}>
                      {['Make contribution', 'View my Chama', 'View Constitution', 'Notifications'].map((label) => (
                        <View key={label} style={styles.quickCard}>
                          <View style={styles.quickIcon}><View style={styles.quickIconInner} /></View>
                          <Text style={styles.quickCardText}>{label}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.floatCard,
                  styles.floatMatch,
                  isMobile && styles.floatMatchMobile,
                  isSmall && styles.floatMatchSmall,
                  webStyle({ boxShadow: '0 12px 32px rgba(21,25,50,.09)', backdropFilter: 'blur(14px)' } as any),
                  {
                    opacity: motionValues[5],
                    transform: [{ scale: motionValues[5].interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
                  },
                ]}
              >
                <View style={styles.floatHead}><View style={styles.floatIcon}><Text style={styles.floatIconText}>◎</Text></View><Text style={styles.floatHeadText}>SMART MATCHING</Text></View>
                <Text style={styles.floatTitle}>6 matching Chamas</Text>
                <Text style={styles.floatCopy}>Matched to your goal, contribution capacity and timeline.</Text>
                <View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>Matches ready</Text></View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.floatCard,
                  styles.floatPay,
                  isMobile && styles.floatPayMobile,
                  isSmall && styles.floatPaySmall,
                  webStyle({ boxShadow: '0 12px 32px rgba(21,25,50,.09)', backdropFilter: 'blur(14px)' } as any),
                  {
                    opacity: motionValues[6],
                    transform: [{ scale: motionValues[6].interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
                  },
                ]}
              >
                <View style={styles.floatHead}><View style={[styles.floatIcon, styles.floatIconGreen]}><Text style={styles.floatIconGreenText}>M</Text></View><Text style={styles.floatHeadText}>CONTRIBUTION</Text></View>
                <Text style={styles.floatTitle}>KSh 5,000 received</Text>
                <Text style={styles.floatCopy}>Transaction MPX123456 recorded successfully.</Text>
                <View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>Verified</Text></View>
              </Animated.View>
            </View>
          </View>

          <Motion animation={motionValues[7]}>
            <View
              style={[
                styles.goalStrip,
                isTablet && styles.goalStripTablet,
                isMobile && styles.goalStripMobile,
                webStyle({ boxShadow: '0 12px 32px rgba(21,25,50,.07)' } as any),
              ]}
            >
              <Text style={[styles.goalLabel, isTablet && styles.goalLabelTablet]}>Popular goals</Text>
              <View style={[styles.goalChipGrid, isTablet && styles.goalChipGridTablet, isMobile && styles.goalChipGridMobile]}>
                {goalChips.map(([emoji, label]) => (
                  <View key={label} style={styles.goalChip}>
                    <Text style={styles.goalChipText}>{emoji} {label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Motion>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 1220, alignSelf: 'center' },
  navShell: { zIndex: 1000, borderBottomWidth: 1, borderBottomColor: 'transparent', backgroundColor: 'transparent' },
  navShellScrolled: { backgroundColor: 'rgba(255,255,255,0.94)', borderBottomColor: 'rgba(231,234,240,0.9)' },
  navInner: { height: 84, alignItems: 'center', flexDirection: 'row', gap: 24 },
  navInnerMobile: { height: 70 },
  logoPressable: { flexShrink: 0 },
  navLinks: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 28 },
  navLinkPressable: { minHeight: 38, justifyContent: 'center' },
  navLink: { color: '#454B5B', fontSize: 13, fontWeight: '800' },
  navLinkHover: { color: COLORS.purple },
  navLinkActive: { color: COLORS.purple, fontWeight: '900' },
  navActions: { flexDirection: 'row', gap: 9, marginLeft: 10 },
  button: { minHeight: 50, borderRadius: 13, borderWidth: 1, borderColor: 'transparent', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  buttonCompact: { minHeight: 42, paddingHorizontal: 16 },
  buttonPrimary: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  buttonPrimaryHover: { backgroundColor: COLORS.purpleDark, borderColor: COLORS.purpleDark },
  buttonDark: { backgroundColor: COLORS.navy, borderColor: COLORS.navy },
  buttonDarkHover: { backgroundColor: '#080D1C', borderColor: '#080D1C' },
  buttonOutline: { backgroundColor: COLORS.white, borderColor: '#D8DCE6' },
  buttonOutlineHover: { backgroundColor: '#FBFAFF', borderColor: COLORS.purpleLine },
  buttonPressed: { opacity: 0.86, transform: [{ scale: 0.985 }] },
  buttonText: { fontSize: 14, fontWeight: '900' },
  buttonTextLight: { color: COLORS.white },
  buttonTextOutline: { color: COLORS.navy },
  buttonTextOutlineHover: { color: COLORS.purple },
  mobileMenuButton: { marginLeft: 'auto', width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.navy, alignItems: 'center', justifyContent: 'center' },
  mobileMenu: { position: 'absolute', zIndex: 1200, top: 70, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 16, padding: 12 },
  mobileMenuLink: { minHeight: 42, paddingHorizontal: 10, justifyContent: 'center', borderRadius: 9 },
  mobileMenuLinkActive: { backgroundColor: COLORS.purpleSoft },
  mobileMenuLinkPressed: { backgroundColor: COLORS.purpleSoft },
  mobileMenuLinkText: { fontSize: 12, fontWeight: '800', color: COLORS.navy },
  mobileMenuLinkTextActive: { color: COLORS.purpleDark, fontWeight: '900' },
  mobileMenuActions: { flexDirection: 'row', gap: 8, marginTop: 7 },
  mobileMenuAction: { flex: 1 },

  heroShell: { minHeight: 840, paddingTop: 66, paddingBottom: 82, overflow: 'hidden', position: 'relative', backgroundColor: '#FBFAFF' },
  heroRingRight: { position: 'absolute', right: -260, top: 70, width: 700, height: 700, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(99,56,212,.10)' },
  heroGlowLeft: { position: 'absolute', left: -180, bottom: -150, width: 420, height: 420, borderRadius: 999, backgroundColor: 'rgba(99,56,212,.06)' },
  heroContainer: { position: 'relative', zIndex: 2 },
  heroGrid: { flexDirection: 'row', gap: 66, alignItems: 'center' },
  heroGridTablet: { flexDirection: 'column', gap: 40 },
  heroCopy: { flex: 1.02 },
  heroCopyTablet: { width: '100%', alignItems: 'center' },
  centerOnTablet: { alignItems: 'center' },
  eyebrow: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.purpleSoft, borderColor: COLORS.purpleLine, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  eyebrowDot: { width: 7, height: 7, borderRadius: 99, backgroundColor: COLORS.purple },
  eyebrowText: { color: COLORS.purpleDark, fontSize: 12, fontWeight: '900', letterSpacing: 0.54, textTransform: 'uppercase' },
  heroTitle: { color: COLORS.navy, fontWeight: '900', letterSpacing: -4.6, marginTop: 20, marginBottom: 24, maxWidth: 760 },
  heroTitleTablet: { textAlign: 'center', letterSpacing: -3.6 },
  heroTitleAccent: { color: COLORS.purple },
  heroDescription: { color: COLORS.muted, fontSize: 18, lineHeight: 31.5, maxWidth: 610, marginBottom: 28 },
  heroDescriptionTablet: { textAlign: 'center' },
  heroActions: { flexDirection: 'row', gap: 11, flexWrap: 'wrap' },
  heroActionsTablet: { justifyContent: 'center' },
  heroActionsMobile: { width: '100%' },
  heroMicro: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 23 },
  heroMicroTablet: { justifyContent: 'center' },
  heroMicroItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  tick: { width: 18, height: 18, borderRadius: 99, backgroundColor: COLORS.greenSoft, alignItems: 'center', justifyContent: 'center' },
  tickText: { color: COLORS.green, fontSize: 11, fontWeight: '900' },
  heroMicroText: { color: '#727887', fontSize: 12, fontWeight: '700' },

  heroVisual: { flex: 0.98, minHeight: 540, position: 'relative', width: '100%' },
  heroVisualTablet: { minHeight: 520, maxWidth: 650, alignSelf: 'center' },
  heroVisualMobile: { minHeight: 470 },
  heroVisualSmall: { minHeight: 430 },
  device: { position: 'absolute', left: '7%', top: '3%', width: '78%', backgroundColor: COLORS.navy, borderRadius: 30, padding: 13 },
  deviceTablet: { left: '7%', width: '78%' },
  deviceMobile: { width: '88%', left: '6%' },
  deviceSmall: { width: '94%', left: '3%' },
  deviceScreen: { backgroundColor: COLORS.bg, borderRadius: 20, overflow: 'hidden', minHeight: 450 },
  appTop: { height: 56, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, gap: 10 },
  appMark: { width: 27, height: 27, borderRadius: 8, backgroundColor: COLORS.purple, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  appMarkInner: { width: 13, height: 13, borderWidth: 2, borderColor: COLORS.white, borderRadius: 99 },
  appTitle: { fontSize: 10, fontWeight: '900', color: COLORS.navy },
  avatar: { width: 28, height: 28, borderRadius: 99, backgroundColor: COLORS.purpleSoft, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
  avatarText: { color: COLORS.purple, fontSize: 9, fontWeight: '900' },
  appBody: { padding: 17 },
  appGreet: { fontSize: 11, color: COLORS.muted, marginBottom: 4 },
  appHeading: { fontSize: 18, fontWeight: '900', color: COLORS.navy, marginBottom: 14 },
  activeCard: { borderRadius: 17, padding: 18, backgroundColor: COLORS.navy },
  activeSmall: { fontSize: 9, color: '#B9C1D4', fontWeight: '800', letterSpacing: 0.72 },
  activeTitle: { fontSize: 17, marginTop: 6, marginBottom: 16, fontWeight: '900', color: COLORS.white },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 6 },
  progressText: { fontSize: 9, color: '#DCE0EA' },
  progressTrack: { height: 7, backgroundColor: 'rgba(255,255,255,.13)', borderRadius: 99, overflow: 'hidden' },
  progressFill: { width: '33%', height: 7, borderRadius: 99, backgroundColor: '#9578ED' },
  activeMeta: { flexDirection: 'row', gap: 8, marginTop: 16 },
  activeMetaSmall: { flexWrap: 'wrap' },
  miniCard: { flex: 1, backgroundColor: 'rgba(255,255,255,.075)', borderWidth: 1, borderColor: 'rgba(255,255,255,.08)', padding: 9, borderRadius: 10 },
  miniLabel: { fontSize: 8, color: '#B7BFD3' },
  miniValue: { fontSize: 11, color: COLORS.white, fontWeight: '900', marginTop: 3 },
  miniValueGreen: { fontSize: 11, color: '#79E4B3', fontWeight: '900', marginTop: 3 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 12 },
  quickCard: { width: '48%', flexGrow: 1, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 12, padding: 12 },
  quickIcon: { width: 28, height: 28, backgroundColor: COLORS.purpleSoft, borderRadius: 8, marginBottom: 7, alignItems: 'center', justifyContent: 'center' },
  quickIconInner: { width: 12, height: 12, borderWidth: 2, borderColor: COLORS.purple, borderRadius: 4 },
  quickCardText: { fontSize: 9, fontWeight: '800', color: COLORS.navy },

  floatCard: { position: 'absolute', backgroundColor: 'rgba(255,255,255,.96)', borderWidth: 1, borderColor: 'rgba(220,209,255,.8)', borderRadius: 16, paddingHorizontal: 15, paddingVertical: 14, width: 190 },
  floatMatch: { right: 0, top: 72 },
  floatPay: { left: 0, bottom: 48 },
  floatMatchMobile: { right: '-2%', top: 55, width: 160 },
  floatPayMobile: { left: '-2%', bottom: 24, width: 160 },
  floatMatchSmall: { right: '-4%', top: 42 },
  floatPaySmall: { left: '-4%', bottom: 18 },
  floatHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  floatHeadText: { fontSize: 9, color: COLORS.muted, fontWeight: '800', letterSpacing: 0.54 },
  floatIcon: { width: 29, height: 29, borderRadius: 9, backgroundColor: COLORS.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  floatIconText: { color: COLORS.purple, fontWeight: '900' },
  floatIconGreen: { backgroundColor: COLORS.greenSoft },
  floatIconGreenText: { color: COLORS.green, fontWeight: '900' },
  floatTitle: { fontSize: 13, fontWeight: '900', marginTop: 9, marginBottom: 4, color: COLORS.navy },
  floatCopy: { fontSize: 10, lineHeight: 14.5, color: COLORS.muted },
  livePill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8, backgroundColor: COLORS.greenSoft, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 99 },
  liveDot: { width: 5, height: 5, borderRadius: 99, backgroundColor: COLORS.green },
  liveText: { color: COLORS.green, fontSize: 8, fontWeight: '900' },

  goalStrip: { marginTop: 52, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 8 },
  goalStripTablet: { flexDirection: 'column', alignItems: 'stretch' },
  goalStripMobile: { marginTop: 30, padding: 13 },
  goalLabel: { fontSize: 11, fontWeight: '900', color: COLORS.navy, paddingHorizontal: 8, flexShrink: 0 },
  goalLabelTablet: { textAlign: 'center', marginBottom: 4 },
  goalChipGrid: { flex: 1, flexDirection: 'row', gap: 8 },
  goalChipGridTablet: { flexWrap: 'wrap' },
  goalChipGridMobile: { flexWrap: 'wrap' },
  goalChip: { flex: 1, minWidth: 110, paddingHorizontal: 9, paddingVertical: 10, borderRadius: 11, backgroundColor: '#FAFAFE', borderWidth: 1, borderColor: '#EEEEF5', alignItems: 'center' },
  goalChipText: { fontSize: 10, fontWeight: '800', color: '#555C6C' },
});
