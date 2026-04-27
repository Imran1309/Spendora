import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ShoppingBag, Coffee, Car, Lightning, House, Monitor, Trash, DotsThree } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { GradientButton } from '../../components/GradientButton';
import { useCurrency } from '../../context/CurrencyContext';
import { API_URL } from '../../config';


const CATEGORIES = [
  { id: 'food', icon: Coffee, color: '#F59E0B' },
  { id: 'shopping', icon: ShoppingBag, color: '#EC4899' },
  { id: 'transport', icon: Car, color: '#3B82F6' },
  { id: 'bills', icon: Lightning, color: '#8B5CF6' },
  { id: 'home', icon: House, color: '#10B981' },
  { id: 'subscriptions', icon: Monitor, color: '#EF4444' },
  { id: 'others', icon: DotsThree, color: '#9CA3AF' },
];

export default function EditExpenseScreen({ route, navigation }) {
  const { currency } = useCurrency();
  const expense = route.params?.expense || {};

  const [amount, setAmount] = useState(String(expense.amount || ''));
  const [category, setCategory] = useState(expense.category || 'food');
  const [note, setNote] = useState(expense.note || '');
  const [type, setType] = useState(expense.type || 'expense');

  const handleUpdate = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/expenses/${expense._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount), category, note, type }),
      });

      const text = await response.text();
      if (response.ok) {
        alert('Transaction updated!');
        navigation.goBack();
      } else {
        try {
          const data = JSON.parse(text);
          alert(data.message || 'Update failed');
        } catch (err) {
          console.error('Update expense error parse failed:', err, text);
          alert('Update failed. Server returned an invalid response.');
        }
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/expenses/${expense._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const text = await response.text();
      if (response.ok) {
        alert('Transaction deleted!');
        navigation.goBack();
      } else {
        try {
          const data = JSON.parse(text);
          alert(data.message || 'Delete failed');
        } catch (err) {
          console.error('Delete expense error parse failed:', err, text);
          alert('Delete failed. Server returned an invalid response.');
        }
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Trash color="#FFF" size={22} weight="fill" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Transaction</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <X color={colors.textPrimary} size={24} />
          </TouchableOpacity>
        </View>

        {/* Income / Expense Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, type === 'expense' && styles.toggleBtnActiveExpense]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.toggleText, type === 'expense' && styles.toggleTextActive]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, type === 'income' && styles.toggleBtnActiveIncome]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.toggleText, type === 'income' && styles.toggleTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>{currency.symbol}</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor="rgba(255,255,255,0.3)"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categories}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryBtn, isSelected && { borderColor: cat.color, backgroundColor: `${cat.color}20` }]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Icon color={isSelected ? cat.color : colors.textSecondary} size={24} weight={isSelected ? 'fill' : 'regular'} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="What was this for?"
            placeholderTextColor={colors.textSecondary}
            value={note}
            onChangeText={setNote}
          />
        </View>

        <View style={styles.spacer} />

        <GradientButton title="Update Transaction" onPress={handleUpdate} style={styles.button} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  title: { ...typography.h2, color: colors.textPrimary, fontWeight: '600' },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
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
  toggleBtnActiveExpense: { backgroundColor: '#EC4899' },
  toggleBtnActiveIncome: { backgroundColor: '#10B981' },
  toggleText: { ...typography.body, color: colors.textSecondary, fontWeight: '600' },
  toggleTextActive: { color: '#FFF' },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  currencySymbol: { fontSize: 40, color: colors.textSecondary, fontWeight: '600', marginRight: 8 },
  amountInput: { fontSize: 56, color: colors.textPrimary, fontWeight: '600', minWidth: 150 },
  section: { marginBottom: 24 },
  sectionTitle: { ...typography.body, color: colors.textSecondary, marginBottom: 12 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  categoryBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  noteInput: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  spacer: { flex: 1 },
  button: { marginBottom: Platform.OS === 'ios' ? 0 : 24 },
});
