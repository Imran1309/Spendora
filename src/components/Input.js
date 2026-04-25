import React, { useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { colors } from '../theme/colors';

export const Input = ({ icon, secureTextEntry, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        {...props}
      />
      {secureTextEntry && (
        <TouchableOpacity 
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.eyeIcon}
        >
          {isPasswordVisible ? (
            <EyeSlash color={colors.textSecondary} size={24} />
          ) : (
            <Eye color={colors.textSecondary} size={24} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
  },
  eyeIcon: {
    marginLeft: 12,
    padding: 4,
  },
});
