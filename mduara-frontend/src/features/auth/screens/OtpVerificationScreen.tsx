import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { ArrowLeft, CheckCircle2, MessageSquareText } from 'lucide-react-native';

import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

interface OtpVerificationScreenProps {
  phone: string;
  purpose?: 'register' | 'pinReset';
  onBack: () => void;
  onResend: () => void;
  onVerified: (code: string) => void;
}

const OTP_LENGTH = 6;
const DEMO_OTP = '123456';

export function OtpVerificationScreen({
  phone,
  purpose = 'register',
  onBack,
  onResend,
  onVerified,
}: OtpVerificationScreenProps) {
  const { width } = useWindowDimensions();
  const boxSize = width < 380 ? 40 : width < 520 ? 44 : 48;
  const gap = width < 380 ? 6 : 8;
  const refs = useRef<Array<TextInput | null>>([]);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const code = useMemo(() => digits.join(''), [digits]);
  const complete = code.length === OTP_LENGTH;

  const setAt = (index: number, value: string) => {
    setDigits((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (raw: string, index: number) => {
    const cleaned = raw.replace(/\D/g, '');
    setError(null);

    if (cleaned.length > 1) {
      const incoming = cleaned.slice(0, OTP_LENGTH - index).split('');
      setDigits((current) => {
        const next = [...current];
        incoming.forEach((digit, offset) => {
          next[index + offset] = digit;
        });
        return next;
      });
      const nextIndex = Math.min(OTP_LENGTH - 1, index + incoming.length);
      refs.current[nextIndex]?.focus();
      return;
    }

    setAt(index, cleaned.slice(-1));
    if (cleaned && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (digits[index]) {
      setAt(index, '');
      return;
    }
    if (index > 0) {
      setAt(index - 1, '');
      refs.current[index - 1]?.focus();
    }
  };

  const submit = () => {
    if (!complete) {
      setError('Enter the complete 6-digit verification code.');
      return;
    }
    if (code !== DEMO_OTP) {
      setError('That prototype verification code is not valid. Use 123456 for this frontend demo.');
      return;
    }
    onVerified(code);
  };

  const resend = () => {
    if (seconds > 0) return;
    setDigits(Array(OTP_LENGTH).fill(''));
    setError(null);
    setSeconds(60);
    refs.current[0]?.focus();
    onResend();
  };

  return (
    <View style={styles.wrapper}>
      <Pressable accessibilityRole="button" onPress={onBack} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
        <ArrowLeft size={16} color={colors.primaryDark} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.iconWrap}>
        <MessageSquareText size={24} color={colors.primary} />
      </View>
      <Text style={styles.title}>{purpose === 'pinReset' ? 'Verify before resetting your PIN' : 'Verify your phone number'}</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to</Text>
      <Text style={styles.phone}>{phone}</Text>

      <View style={[styles.otpRow, { gap }]}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(node) => { refs.current[index] = node; }}
            accessibilityLabel={`OTP digit ${index + 1}`}
            autoFocus={index === 0}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') handleBackspace(index);
            }}
            selectTextOnFocus
            style={[
              styles.otpInput,
              { width: boxSize, height: boxSize + 6 },
              digit ? styles.otpInputFilled : null,
              error ? styles.otpInputError : null,
            ]}
            textContentType="oneTimeCode"
            value={digit}
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.demoNotice}>
        <CheckCircle2 size={14} color={colors.primaryDark} />
        <Text style={styles.demoText}>Frontend prototype code: <Text style={styles.demoCode}>123456</Text></Text>
      </View>

      <Button fullWidth disabled={!complete} onPress={submit}>Verify code</Button>

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <Pressable accessibilityRole="button" disabled={seconds > 0} onPress={resend}>
          <Text style={[styles.resendAction, seconds > 0 && styles.resendDisabled]}>
            {seconds > 0 ? `Resend in 0:${String(seconds).padStart(2, '0')}` : 'Resend code'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'center', maxWidth: 520, width: '100%' },
  back: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 6, marginBottom: 28, paddingVertical: 6 },
  backText: { color: colors.primaryDark, fontSize: 11, fontWeight: '800' },
  pressed: { opacity: 0.7 },
  iconWrap: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 16, height: 52, justifyContent: 'center', width: 52 },
  title: { color: colors.navy, fontSize: 25, fontWeight: '900', letterSpacing: -0.6, lineHeight: 30, marginTop: 16 },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, marginTop: 8 },
  phone: { color: colors.navy, fontSize: 14, fontWeight: '900', marginTop: 3 },
  otpRow: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 26 },
  otpInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.navy,
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
  },
  otpInputFilled: { borderColor: colors.primary, backgroundColor: colors.brandCanvas },
  otpInputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 10, fontWeight: '700', lineHeight: 15, marginTop: 10 },
  demoNotice: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.primaryLight, borderRadius: 10, flexDirection: 'row', gap: 7, marginBottom: 18, marginTop: 16, paddingHorizontal: 10, paddingVertical: 8 },
  demoText: { color: colors.primaryDark, fontSize: 9, fontWeight: '700' },
  demoCode: { fontWeight: '900' },
  resendRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: spacing.md },
  resendText: { color: colors.textMuted, fontSize: 10 },
  resendAction: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  resendDisabled: { color: colors.textSubtle },
});
