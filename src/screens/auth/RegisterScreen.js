import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { EnvelopeSimple, LockKey, User } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Input } from '../../components/Input';
import { GradientButton } from '../../components/GradientButton';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://10.25.198.38:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        if (data.user && data.user.name) {
          await AsyncStorage.setItem('userName', data.user.name);
        }
        alert('Account created successfully!');
        navigation.replace('Main');
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Could not connect to server. Ensure backend is running.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start tracking your expenses today</Text>
        </View>

        <View style={styles.form}>
          <Input
            icon={<User color={colors.textSecondary} size={24} />}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <Input
            icon={<EnvelopeSimple color={colors.textSecondary} size={24} />}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            icon={<LockKey color={colors.textSecondary} size={24} />}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <GradientButton 
            title="Get Started" 
            onPress={handleRegister} 
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: 48,
  },
  button: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    ...typography.body,
  },
  loginText: {
    color: colors.primary,
    ...typography.body,
    fontWeight: '600',
  },
});
