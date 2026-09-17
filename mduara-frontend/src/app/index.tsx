import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import { AppNavigator } from './navigation/AppNavigator';
import { GuestNavigator } from './navigation/GuestNavigator';
import { AuthProvider, useAuth } from './providers/AuthContext';
import { AppStateProvider, useAppState } from './providers/AppStateContext';
import { SplashScreen } from '../features/landing/SplashScreen';
import { AuthOverlayScreen, type AuthIntentSource } from '../features/auth/screens/AuthOverlayScreen';
import { ChamaApplicationFlow } from '../features/landing/ChamaApplicationFlow';
import type { PublicChama } from '../shared/mockData';
import { colors } from '../theme/colors';

function AppEntry() {
	const { isAuthenticated, isHydrated: isAuthHydrated } = useAuth();
    const [authVisible, setAuthVisible] = useState(false);
    const [authMode, setAuthMode] = useState<'signIn' | 'register'>('signIn');
    const [selectedChama, setSelectedChama] = useState<PublicChama | null>(null);
    const [applicationChama, setApplicationChama] = useState<PublicChama | null>(null);
    const [applicationSource, setApplicationSource] = useState<AuthIntentSource>('signedIn');

    if (!isAuthHydrated) return <SplashScreen />;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            {isAuthenticated ? (
				<AppNavigator />
			) : (
				<GuestNavigator
					onApply={(chama) => {
						setSelectedChama(chama);
						setAuthMode('register');
						setAuthVisible(true);
					}}
					onCreateAccount={() => {
						setSelectedChama(null);
						setAuthMode('register');
						setAuthVisible(true);
					}}
					onSignIn={() => {
						setSelectedChama(null);
						setAuthMode('signIn');
						setAuthVisible(true);
					}}
					onSignInToApply={(chama) => {
						setSelectedChama(chama);
						setAuthMode('signIn');
						setAuthVisible(true);
					}}
				/>
			)}
            <AuthOverlayScreen
                defaultMode={authMode}
                onClose={() => setAuthVisible(false)}
                onIntentReady={(source) => {
                    if (!selectedChama) return;
                    setApplicationSource(source);
                    setApplicationChama(selectedChama);
                }}
                selectedChama={selectedChama}
                visible={authVisible}
            />
            <ChamaApplicationFlow
                accountContext={applicationSource}
                chama={applicationChama}
                onClose={() => {
                    setApplicationChama(null);
                    setSelectedChama(null);
                }}
                onComplete={() => {
                    setApplicationChama(null);
                    setSelectedChama(null);
                }}
                visible={!!applicationChama}
            />
            <Toast />
        </SafeAreaView>
    );
}


function Bootstrap() {
    const { isHydrated } = useAppState();
    const [minimumSplashElapsed, setMinimumSplashElapsed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMinimumSplashElapsed(true), 1450);
        return () => clearTimeout(timer);
    }, []);

    if (!isHydrated || !minimumSplashElapsed) {
        return <SplashScreen />;
    }

    return (
        <AuthProvider>
            <AppEntry />
        </AuthProvider>
    );
}

export default function IndexScreen() {
    return (
        <AppStateProvider>
            <Bootstrap />
        </AppStateProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.background,
        flex: 1,
    },
});
