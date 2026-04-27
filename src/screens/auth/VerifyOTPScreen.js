import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { ArrowLeft, LockKey } from 'phosphor-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Input } from '../../components/Input';
import { GradientButton } from '../../components/GradientButton';
import { API_URL } from '../../config';

export default function VerifyOTPScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('otp'); // 'otp' | 'reset'
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleOTPChange = (val, idx) => {
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
    if (!val && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const otpString = otp.join('');

  const handleVerify = async () => {
    if (otpString.length < 6) { alert('Please enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/forgot-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Verify OTP parse error:', err, text);
        alert('Server returned an invalid response. Please try again.');
        setLoading(false);
        return;
      }
      if (res.ok) {
        setStep('reset');
      } else {
        alert(data.message || 'Invalid OTP');
      }
    } catch (e) {
      alert('Network error');
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/forgot-password/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString, newPassword }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Reset password parse error:', err, text);
        alert('Server returned an invalid response. Please try again.');
        setLoading(false);
        return;
      }
      if (res.ok) {
        alert('Password reset successfully! Please login.');
        navigation.navigate('Login');
      } else {
        alert(data.message || 'Reset failed');
      }
    } catch (e) {
      alert('Network error');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>

        {step === 'otp' ? (
          <>
            <View style={styles.header}>
              <Text style={styles.emoji}>📩</Text>
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>
                We sent a 6-digit OTP to{'\n'}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>{email}</Text>
              </Text>
            </View>

            {/* OTP Boxes */}
            <View style={styles.otpRow}>
              {otp.map((val, idx) => (
                <TextInput
                  key={idx}
                  ref={r => inputs.current[idx] = r}
                  style={[styles.otpBox, val && styles.otpBoxFilled]}
                  value={val}
                  onChangeText={v => handleOTPChange(v.replace(/[^0-9]/g, ''), idx)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>

            <GradientButton
              title={loading ? 'Verifying...' : 'Verify OTP'}
              onPress={handleVerify}
              style={styles.button}
            />

            <TouchableOpacity
              style={styles.resendBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.resendText}>Didn't receive? Resend OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.emoji}>🔑</Text>
              <Text style={styles.title}>Set New Password</Text>
              <Text style={styles.subtitle}>OTP verified! Choose a strong new password.</Text>
            </View>

            <Input
              icon={<LockKey color={colors.textSecondary} size={24} />}
              placeholder="New Password (min 6 chars)"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <GradientButton
              title={loading ? 'Resetting...' : 'Reset Password'}
              onPress={handleResetPassword}
              style={styles.button}
            />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 24 },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 16, marginBottom: 32,
  },
  header: { marginBottom: 40 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: 12 },
  subtitle: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 10,
  },
  otpBox: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  button: { marginTop: 8 },
  resendBtn: { alignItems: 'center', marginTop: 24 },
  resendText: { ...typography.body, color: colors.primary, fontWeight: '600' },
});
