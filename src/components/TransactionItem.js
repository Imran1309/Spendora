import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const TransactionItem = ({ icon, title, date, amount, type, onPress, currencySymbol = '₹' }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <Text style={[styles.amount, { color: type === 'income' ? colors.success : colors.textPrimary }]}>
        {type === 'income' ? '+' : '-'}{currencySymbol}{amount}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: 4,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  amount: {
    ...typography.body,
    fontWeight: '600',
  },
});
