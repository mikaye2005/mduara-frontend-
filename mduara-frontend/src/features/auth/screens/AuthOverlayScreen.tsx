import React, { useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Check, LockKeyhole, ShieldCheck, UsersRound, X } from 'lucide-react-native';

import { AppFormField, AppFormSubmitButton } from '../../../components/ui/FormFields';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { MduaraBrand } from '../../../components/brand/MduaraBrand';
import { useAuth } from '../../../app/providers/AuthContext';
import { OtpVerificationScreen } from './OtpVerificationScreen';
import { authInitialValues, type PublicChama } from '../../../shared/mockData';
import { showErrorToast, showSuccessToast } from '../../../shared/toast';
import { registerSchema, signInSchema } from '../../../shared/validation';
import { brand } from '../../../theme/brand';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type AuthMode = 'signIn' | 'register';
type AuthStep = AuthMode | 'registerOtp' | 'forgotPhone' | 'forgotOtp' | 'resetPin' | 'success';
export type AuthIntentSource = 'signedIn' | 'verifiedRegistration';

interface AuthOverlayScreenProps {
  visible: boolean;
  defaultMode?: AuthMode;
  selectedChama?: PublicChama | null;
  onClose: () => void;
  onIntentReady?: (source: AuthIntentSource) => void;
}

const kenyaPhoneRegex = /^(?:\+254|0)[71]\d{8}$/;

export function AuthOverlayScreen({ defaultMode = 'signIn', onClose, onIntentReady, selectedChama, visible }: AuthOverlayScreenProps) {
  const { width } = useWindowDimensions();
  const desktop = width >= 900;
  const { signIn } = useAuth();
  const [step, setStep] = useState<AuthStep>(defaultMode);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [pendingPhone, setPendingPhone] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!visible) return;
    setStep(defaultMode);
    setTermsAccepted(false);
    setTermsError(null);
    setRememberMe(false);
    setPendingPhone('');
    setPendingName('');
    setRecoveryPhone('');
    setRecoveryError(null);
    setNewPin('');
    setConfirmPin('');
    setPinError(null);
    setSuccessMessage('');
  }, [defaultMode, visible]);

  const selectedChamaName = useMemo(() => selectedChama?.name ?? null, [selectedChama]);
  const showTabs = step === 'signIn' || step === 'register';

  const finishOtpRegistration = () => {
    if (selectedChamaName && onIntentReady) {
      showSuccessToast({
        title: 'Verification complete',
        message: `Your ${selectedChamaName} application intent is ready to continue.`,
      });
      onIntentReady('verifiedRegistration');
      onClose();
      return;
    }

    setSuccessMessage(
      `Phone verification is complete for ${pendingName || 'your account'}. The production backend will create the account and session after successful verification.`,
    );
    setStep('success');
  };

  const submitRecoveryPhone = () => {
    const normalized = recoveryPhone.trim();
    if (!kenyaPhoneRegex.test(normalized)) {
      setRecoveryError('Use a valid Kenyan phone number, for example +254712345678.');
      return;
    }
    setRecoveryError(null);
    setPendingPhone(normalized);
    setStep('forgotOtp');
  };

  const submitNewPin = () => {
    if (!/^\d{4}$/.test(newPin)) {
      setPinError('PIN must contain exactly 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('The two PIN entries do not match.');
      return;
    }
    setPinError(null);
    setSuccessMessage('Your new PIN has passed frontend validation. The production backend will persist the reset after OTP verification.');
    setStep('success');
  };

  const renderForm = () => {
    if (step === 'registerOtp') {
      return (
        <OtpVerificationScreen
          phone={pendingPhone}
          purpose="register"
          onBack={() => setStep('register')}
          onResend={() => showSuccessToast({ title: 'Code resent', message: `A new prototype code was requested for ${pendingPhone}.` })}
          onVerified={finishOtpRegistration}
        />
      );
    }

    if (step === 'forgotOtp') {
      return (
        <OtpVerificationScreen
          phone={pendingPhone}
          purpose="pinReset"
          onBack={() => setStep('forgotPhone')}
          onResend={() => showSuccessToast({ title: 'Code resent', message: `A new prototype code was requested for ${pendingPhone}.` })}
          onVerified={() => setStep('resetPin')}
        />
      );
    }

    if (step === 'forgotPhone') {
      return (
        <View style={styles.formBlock}>
          <Text style={styles.formTitle}>Forgot your PIN?</Text>
          <Text style={styles.formSubtitle}>Enter the phone number attached to your M-Duara account. We will verify it before a PIN can be changed.</Text>
          <Input
            error={recoveryError ?? undefined}
            keyboardType="phone-pad"
            label="Phone Number"
            onChangeText={(value) => { setRecoveryPhone(value); setRecoveryError(null); }}
            placeholder="e.g. +254712345678"
            value={recoveryPhone}
          />
          <Button fullWidth onPress={submitRecoveryPhone}>Send verification code</Button>
          <Button fullWidth variant="ghost" onPress={() => setStep('signIn')}>Back to sign in</Button>
        </View>
      );
    }

    if (step === 'resetPin') {
      return (
        <View style={styles.formBlock}>
          <Text style={styles.formTitle}>Create a new PIN</Text>
          <Text style={styles.formSubtitle}>Choose a new 4-digit PIN for {pendingPhone}.</Text>
          <Input keyboardType="number-pad" label="New PIN" maxLength={4} onChangeText={(value) => { setNewPin(value.replace(/\D/g, '')); setPinError(null); }} secureTextEntry value={newPin} />
          <Input error={pinError ?? undefined} keyboardType="number-pad" label="Confirm PIN" maxLength={4} onChangeText={(value) => { setConfirmPin(value.replace(/\D/g, '')); setPinError(null); }} secureTextEntry value={confirmPin} />
          <Button fullWidth onPress={submitNewPin}>Save new PIN</Button>
        </View>
      );
    }

    if (step === 'success') {
      return (
        <View style={styles.successBlock}>
          <View style={styles.successIcon}><Check size={26} color={colors.success} /></View>
          <Text style={styles.formTitle}>Verification complete</Text>
          <Text style={styles.formSubtitle}>{successMessage}</Text>
          <Button fullWidth onPress={onClose}>Continue</Button>
          <Button fullWidth variant="ghost" onPress={() => setStep('signIn')}>Go to sign in</Button>
        </View>
      );
    }

    if (step === 'register') {
      return (
        <Formik
          initialValues={authInitialValues.register}
          validationSchema={registerSchema}
          onSubmit={(values, helpers) => {
            if (!termsAccepted) {
              setTermsError('Accept the Terms and Privacy Notice before continuing.');
              helpers.setSubmitting(false);
              return;
            }
            setTermsError(null);
            setPendingPhone(values.phone.trim());
            setPendingName(values.fullName.trim());
            helpers.setSubmitting(false);
            setStep('registerOtp');
          }}
        >
          {({ isSubmitting }) => (
            <View style={styles.formBlock}>
              <Text style={styles.formTitle}>Create your account</Text>
              <Text style={styles.formSubtitle}>One account can later belong to multiple Chamas. Official responsibilities are assigned from the Chama membership record, not chosen here.</Text>
              {selectedChamaName ? (
                <View style={styles.intentBanner}>
                  <ShieldCheck size={17} color={colors.primaryDark} />
                  <Text style={styles.intentText}>You are creating an account to continue with <Text style={styles.intentStrong}>{selectedChamaName}</Text>.</Text>
                </View>
              ) : null}
              <AppFormField label="Full Name" name="fullName" placeholder="e.g. Mary Wanjiku" />
              <AppFormField keyboardType="phone-pad" label="Phone Number" name="phone" placeholder="e.g. +254712345678" />
              <AppFormField keyboardType="email-address" label="Email Address" name="email" placeholder="e.g. mary@example.com" />
              <AppFormField keyboardType="number-pad" label="4-digit PIN" name="pin" placeholder="••••" secureTextEntry />

              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: termsAccepted }}
                onPress={() => { setTermsAccepted((value) => !value); setTermsError(null); }}
                style={styles.checkRow}
              >
                <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>{termsAccepted ? <Check size={13} color={colors.white} /> : null}</View>
                <Text style={styles.checkText}>I agree to the M-Duara Terms of Use and Privacy Notice.</Text>
              </Pressable>
              {termsError ? <Text style={styles.inlineError}>{termsError}</Text> : null}

              <AppFormSubmitButton loading={isSubmitting} title="Continue to verification" />
            </View>
          )}
        </Formik>
      );
    }

    return (
      <Formik
        initialValues={authInitialValues.signIn}
        validationSchema={signInSchema}
        onSubmit={(values, helpers) => {
          const isVerified = signIn(values.phone, values.pin);
          if (!isVerified) {
            showErrorToast({ message: 'No verified mock/backend session was found for that phone number.', title: 'Sign in blocked' });
            helpers.setSubmitting(false);
            return;
          }
          showSuccessToast({ message: rememberMe ? 'Signed in. Remember-me is represented locally in this frontend prototype.' : 'Signed in successfully.', title: 'Welcome back' });
          helpers.setSubmitting(false);
          if (selectedChamaName && onIntentReady) {
            onIntentReady('signedIn');
          }
          onClose();
        }}
      >
        {({ isSubmitting }) => (
          <View style={styles.formBlock}>
            <Text style={styles.formTitle}>Welcome back</Text>
            <Text style={styles.formSubtitle}>Sign in once. M-Duara will load the Chamas and official workspace permissions attached to your account.</Text>
            {selectedChamaName ? (
              <View style={styles.intentBanner}>
                <ShieldCheck size={17} color={colors.primaryDark} />
                <Text style={styles.intentText}>Sign in to continue your application to <Text style={styles.intentStrong}>{selectedChamaName}</Text>.</Text>
              </View>
            ) : null}
            <AppFormField keyboardType="phone-pad" label="Phone Number" name="phone" placeholder="e.g. +254712345678" />
            <AppFormField keyboardType="number-pad" label="PIN" name="pin" placeholder="4-digit PIN" secureTextEntry />
            <View style={styles.signInOptions}>
              <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: rememberMe }} onPress={() => setRememberMe((value) => !value)} style={styles.checkRowCompact}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>{rememberMe ? <Check size={13} color={colors.white} /> : null}</View>
                <Text style={styles.checkText}>Remember me</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => setStep('forgotPhone')}><Text style={styles.linkText}>Forgot PIN?</Text></Pressable>
            </View>
            <AppFormSubmitButton loading={isSubmitting} title="Sign In" />
          </View>
        )}
      </Formik>
    );
  };

  return (
    <Modal visible={visible} onClose={onClose} contentStyle={styles.modalContent}>
      <View style={[styles.layout, !desktop && styles.layoutMobile]}>
        {desktop ? (
          <View style={styles.brandPanel}>
            <MduaraBrand tone="dark" variant="full" width={300} />
            <Text style={styles.brandHeadline}>Save with clarity. Grow with people you trust.</Text>
            <Text style={styles.brandCopy}>One identity for your personal savings journey, multiple Chamas, and only the official workspaces you have actually been assigned.</Text>
            <View style={styles.brandBenefits}>
              <View style={styles.brandBenefit}><UsersRound size={18} color={colors.brandInversePurple} /><Text style={styles.brandBenefitText}>One account across multiple Chamas</Text></View>
              <View style={styles.brandBenefit}><ShieldCheck size={18} color={colors.brandInversePurple} /><Text style={styles.brandBenefitText}>Chama-scoped roles and permissions</Text></View>
              <View style={styles.brandBenefit}><LockKeyhole size={18} color={colors.brandInversePurple} /><Text style={styles.brandBenefitText}>Verification before sensitive actions</Text></View>
            </View>
            <Text style={styles.brandFoot}>{brand.tagline}</Text>
          </View>
        ) : null}

        <View style={styles.formPanel}>
          <Pressable accessibilityLabel="Close authentication" accessibilityRole="button" onPress={onClose} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
            <X size={20} color={colors.textMuted} />
          </Pressable>

          <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {!desktop ? (
              <View style={styles.mobileBrand}>
                <MduaraBrand variant="wordmark" width={174} />
                <Text style={styles.mobileTagline}>{brand.tagline}</Text>
              </View>
            ) : null}

            {showTabs ? (
              <View style={styles.tabs}>
                <Pressable accessibilityRole="tab" accessibilityState={{ selected: step === 'signIn' }} onPress={() => setStep('signIn')} style={[styles.tab, step === 'signIn' && styles.tabActive]}>
                  <Text style={[styles.tabText, step === 'signIn' && styles.tabTextActive]}>Sign In</Text>
                </Pressable>
                <Pressable accessibilityRole="tab" accessibilityState={{ selected: step === 'register' }} onPress={() => setStep('register')} style={[styles.tab, step === 'register' && styles.tabActive]}>
                  <Text style={[styles.tabText, step === 'register' && styles.tabTextActive]}>Create account</Text>
                </Pressable>
              </View>
            ) : null}

            {renderForm()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: { maxWidth: 1080, overflow: 'hidden', padding: 0 },
  layout: { flexDirection: 'row', minHeight: 650, width: '100%' },
  layoutMobile: { minHeight: 0 },
  brandPanel: { backgroundColor: colors.navy, flex: 0.9, justifyContent: 'center', paddingHorizontal: 44, paddingVertical: 48 },
  brandHeadline: { color: colors.white, fontSize: 30, fontWeight: '900', letterSpacing: -1, lineHeight: 36, marginTop: 34, maxWidth: 420 },
  brandCopy: { color: '#BFC6D8', fontSize: 13, lineHeight: 21, marginTop: 12, maxWidth: 430 },
  brandBenefits: { gap: 13, marginTop: 28 },
  brandBenefit: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  brandBenefitText: { color: '#D6DBE8', fontSize: 11, fontWeight: '700' },
  brandFoot: { color: colors.brandInversePurple, fontSize: 11, fontWeight: '800', marginTop: 42 },
  formPanel: { backgroundColor: colors.surface, flex: 1.1, minWidth: 0, position: 'relative' },
  closeButton: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: 999, height: 38, justifyContent: 'center', position: 'absolute', right: 18, top: 18, width: 38, zIndex: 5 },
  pressed: { opacity: 0.7 },
  formScroll: { flexGrow: 1, justifyContent: 'center', paddingBottom: 36, paddingHorizontal: 36, paddingTop: 54 },
  mobileBrand: { alignItems: 'center', marginBottom: 26 },
  mobileTagline: { color: colors.textMuted, fontSize: 10, fontWeight: '700', marginTop: 4 },
  tabs: { backgroundColor: colors.surfaceMuted, borderRadius: radii.md, flexDirection: 'row', gap: 4, marginBottom: 24, padding: 4 },
  tab: { alignItems: 'center', borderRadius: radii.sm, flex: 1, paddingHorizontal: 12, paddingVertical: 10 },
  tabActive: { backgroundColor: colors.surface },
  tabText: { color: colors.textMuted, fontSize: 11, fontWeight: '800' },
  tabTextActive: { color: colors.primaryDark },
  formBlock: { alignSelf: 'center', gap: spacing.md, maxWidth: 520, width: '100%' },
  formTitle: { color: colors.navy, fontSize: 27, fontWeight: '900', letterSpacing: -0.7, lineHeight: 32 },
  formSubtitle: { color: colors.textMuted, fontSize: 12, lineHeight: 19, marginBottom: 3 },
  intentBanner: { alignItems: 'flex-start', backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: 9, padding: 12 },
  intentText: { color: colors.text, flex: 1, fontSize: 10, lineHeight: 16 },
  intentStrong: { color: colors.primaryDark, fontWeight: '900' },
  checkRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 9 },
  checkRowCompact: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  checkbox: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 5, borderWidth: 1, height: 19, justifyContent: 'center', marginTop: 1, width: 19 },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkText: { color: colors.textMuted, flexShrink: 1, fontSize: 10, lineHeight: 16 },
  inlineError: { color: colors.danger, fontSize: 10, fontWeight: '700', marginTop: -6 },
  signInOptions: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  linkText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  successBlock: { alignSelf: 'center', gap: spacing.md, maxWidth: 520, width: '100%' },
  successIcon: { alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: 18, height: 58, justifyContent: 'center', width: 58 },
});
