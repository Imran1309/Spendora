import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

export const GlassCard = ({ children, style }) => {
  if (Platform.OS === 'android') {
    // Android doesn't support expo-blur as nicely without experimental features sometimes,
    // so we use a semi-transparent background as a fallback.
    return (
      <View style={[styles.container, styles.androidFallback, style]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView intensity={40} tint="dark" style={[styles.container, style]}>
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 29, 36, 0.4)',
  },
  androidFallback: {
    backgroundColor: colors.surface,
  },
});
