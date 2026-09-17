import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { MduaraBrand } from '../../components/brand/MduaraBrand';
import { brand } from '../../theme/brand';
import { colors } from '../../theme/colors';

function webStyle<T extends object>(style: T): T | undefined {
  return Platform.OS === 'web' ? style : undefined;
}

export function SplashScreen() {
  const { width } = useWindowDimensions();
  const orbitSize = Math.min(480, width * 0.85);
  const logoWidth = Math.min(340, width * 0.74);
  const orbitRotation = useRef(new Animated.Value(0)).current;
  const orbitBreath = useRef(new Animated.Value(0)).current;
  const contentRise = useRef(new Animated.Value(0)).current;
  const tagFade = useRef(new Animated.Value(0)).current;
  const loader = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(orbitRotation, {
        toValue: 1,
        duration: 2700,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const breath = Animated.loop(
      Animated.sequence([
        Animated.timing(orbitBreath, { toValue: 1, duration: 1150, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(orbitBreath, { toValue: 0, duration: 1150, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );

    spin.start();
    breath.start();
    Animated.sequence([
      Animated.delay(180),
      Animated.timing(contentRise, { toValue: 1, duration: 750, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(720),
      Animated.timing(tagFade, { toValue: 1, duration: 550, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(250),
      Animated.timing(loader, { toValue: 1, duration: 1650, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();

    return () => {
      spin.stop();
      breath.stop();
    };
  }, [contentRise, loader, orbitBreath, orbitRotation, tagFade]);

  const spin = useMemo(
    () => orbitRotation.interpolate({ inputRange: [0, 1], outputRange: ['40deg', '400deg'] }),
    [orbitRotation],
  );
  const scale = useMemo(
    () => orbitBreath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.025] }),
    [orbitBreath],
  );
  const translateY = useMemo(
    () => contentRise.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }),
    [contentRise],
  );
  const progressWidth = useMemo(
    () => loader.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
    [loader],
  );

  return (
    <View
      style={[
        styles.root,
        webStyle({
          backgroundImage: 'radial-gradient(circle at 50% 40%,rgba(119,84,232,.18),transparent 26%),linear-gradient(150deg,#fff 0%,#faf8ff 46%,#f0ebff 100%)',
        } as any),
      ]}
      accessibilityLabel="M-Duara opening splash"
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.brandCanvas} />

      <Animated.View
        style={[
          styles.orbit,
          { width: orbitSize, height: orbitSize, transform: [{ scale }] },
        ]}
      >
        <Animated.View
          style={[
            styles.orbitArc,
            webStyle({
              backgroundImage: 'conic-gradient(from 40deg,transparent 0 58%,rgba(99,56,212,.72) 69%,transparent 81%)',
              WebkitMask: 'radial-gradient(circle,transparent 69%,#000 70%,#000 70.8%,transparent 71.7%)',
              mask: 'radial-gradient(circle,transparent 69%,#000 70%,#000 70.8%,transparent 71.7%)',
            } as any),
            { transform: [{ rotate: spin }] },
          ]}
        />
      </Animated.View>

      <View pointerEvents="none" style={[styles.orbitEcho, { width: orbitSize + 96, height: orbitSize + 96 }]} />
      <View pointerEvents="none" style={[styles.orbitEcho, styles.orbitEchoOuter, { width: orbitSize + 192, height: orbitSize + 192 }]} />

      <View style={styles.inner}>
        <Animated.View style={{ opacity: contentRise, transform: [{ translateY }] }}>
          <MduaraBrand
            variant="wordmark"
            width={logoWidth}
            style={[styles.logo, webStyle({ filter: 'drop-shadow(0 10px 20px rgba(99,56,212,.10))' } as any)]}
          />
        </Animated.View>

        <Animated.View style={{ opacity: tagFade }}>
          <Text style={[styles.tagline, { fontSize: width < 480 ? 17 : Math.min(22, Math.max(17, width * 0.025)) }]}>
            {brand.tagline}
          </Text>
        </Animated.View>

        <View style={styles.loaderTrack}>
          <Animated.View
            style={[
              styles.loaderFill,
              { width: progressWidth },
              webStyle({ backgroundImage: 'linear-gradient(90deg,#4D29B4,#8c6af0)' } as any),
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.brandCanvas,
  },
  orbit: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(99,56,212,.12)',
  },
  orbitArc: {
    position: 'absolute',
    top: -1,
    right: -1,
    bottom: -1,
    left: -1,
    borderRadius: 999,
    borderWidth: Platform.OS === 'web' ? 0 : 2,
    borderTopColor: colors.primary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  orbitEcho: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(99,56,212,.022)',
  },
  orbitEchoOuter: { borderColor: 'rgba(99,56,212,.012)' },
  inner: { position: 'relative', zIndex: 2, padding: 24, alignItems: 'center' },
  logo: { marginBottom: 24 },
  tagline: { fontWeight: '800', color: colors.navy, textAlign: 'center' },
  loaderTrack: { width: 180, height: 3, backgroundColor: colors.primaryLine, borderRadius: 99, marginTop: 24, overflow: 'hidden' },
  loaderFill: { height: 3, borderRadius: 99, backgroundColor: colors.primaryDark },
});
