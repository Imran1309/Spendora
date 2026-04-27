import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, Image } from 'react-native';
import { EnvelopeSimple, LockKey, User } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Input } from '../../components/Input';
import { GradientButton } from '../../components/GradientButton';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../config';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Register response parse error:', e, 'Raw:', text.substring(0, 100));
        alert('Server returned an invalid response. Please try again later.');
        return;
      }

      if (response.ok) {
        await login({
          token: data.token,
          name: data.user.name,
          email: data.user.email,
          id: data.user.id
        });
        alert('Account created successfully!');
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
          <Image 
            source={require('../../../assets/spendora.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Spendora</Text>
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
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 20,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
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
