import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { EnvelopeSimple, ArrowLeft } from 'phosphor-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Input } from '../../components/Input';
import { GradientButton } from '../../components/GradientButton';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) { alert('Please enter your email'); return; }
    setLoading(true);
    try {
      const res = await fetch('http://10.25.198.38:5000/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('OTP sent! Check your email inbox.');
        navigation.navigate('VerifyOTP', { email });
      } else {
        alert(data.message || 'Failed to send OTP');
      }
    } catch (e) {
      alert('Network error. Is the backend running?');
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

        <View style={styles.header}>
          <Text style={styles.emoji}>🔐</Text>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your registered email address. We'll send a 6-digit OTP to verify you.
          </Text>
        </View>

        <Input
          icon={<EnvelopeSimple color={colors.textSecondary} size={24} />}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <GradientButton
          title={loading ? 'Sending OTP...' : 'Send OTP'}
          onPress={handleSendOTP}
          style={styles.button}
        />
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
  button: { marginTop: 16 },
});
