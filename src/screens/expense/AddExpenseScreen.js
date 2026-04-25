import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ShoppingBag, Coffee, Car, Lightning, House, Monitor, DotsThree } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { GradientButton } from '../../components/GradientButton';
import { useCurrency } from '../../context/CurrencyContext';

const CATEGORIES = [
  { id: 'food', icon: Coffee, color: '#F59E0B' },
  { id: 'shopping', icon: ShoppingBag, color: '#EC4899' },
  { id: 'transport', icon: Car, color: '#3B82F6' },
  { id: 'bills', icon: Lightning, color: '#8B5CF6' },
  { id: 'home', icon: House, color: '#10B981' },
  { id: 'subscriptions', icon: Monitor, color: '#EF4444' },
  { id: 'others', icon: DotsThree, color: '#9CA3AF' },
];

export default function AddExpenseScreen({ navigation }) {
  const { currency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [type, setType] = useState('expense');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleType = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('income'); // income doesn't use expense categories
    } else {
      setCategory(CATEGORIES[0].id);
    }
  };

  const handleSave = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch('http://10.25.198.38:5000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          note,
          type
        }),
      });

      if (response.ok) {
        navigation.goBack();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to save');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <X color={colors.textPrimary} size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>New Transaction</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Income / Expense Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, type === 'expense' && styles.toggleBtnActive]}
            onPress={() => handleToggleType('expense')}
          >
            <Text style={[styles.toggleText, type === 'expense' && styles.toggleTextActive]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, type === 'income' && styles.toggleBtnActiveIncome]}
            onPress={() => handleToggleType('income')}
          >
            <Text style={[styles.toggleText, type === 'income' && styles.toggleTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>{currency.symbol}</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor="rgba(255,255,255,0.3)"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>

        <View style={styles.formContainer}>
          {type === 'expense' && (
            <>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categories}>
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryBtn,
                        isSelected && { borderColor: cat.color, backgroundColor: `${cat.color}15` }
                      ]}
                      onPress={() => setCategory(cat.id)}
                    >
                      <Icon color={isSelected ? cat.color : colors.textSecondary} size={24} weight={isSelected ? "fill" : "regular"} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          <Text style={styles.label}>{type === 'income' ? 'Source (e.g. Salary, Freelance)' : 'Note'}</Text>
          <TextInput
            style={styles.noteInput}
            placeholder={type === 'income' ? 'e.g. Salary, Business, Freelance...' : 'What was this for?'}
            placeholderTextColor={colors.textSecondary}
            value={note}
            onChangeText={setNote}
          />
        </View>

        <View style={styles.footer}>
          <GradientButton title={isLoading ? "Saving..." : "Save Transaction"} onPress={handleSave} disabled={isLoading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleBtnActive: {
    backgroundColor: '#EC4899', // Pinkish for expense
  },
  toggleBtnActiveIncome: {
    backgroundColor: '#10B981', // Green for income
  },
  toggleText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFF',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  currencySymbol: {
    ...typography.h1,
    fontSize: 48,
    color: colors.textSecondary,
    marginRight: 8,
  },
  amountInput: {
    ...typography.h1,
    fontSize: 56,
    color: colors.textPrimary,
    minWidth: 150,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  label: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  categoryBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  noteInput: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    ...typography.body,
    color: colors.textPrimary,
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    backgroundColor: colors.surface,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: 12,
  },
});

