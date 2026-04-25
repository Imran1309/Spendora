import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingBag, Coffee, Car, Plus, SignOut, CaretUp, CaretDown, Lightning, House, DotsThree, Monitor, CurrencyDollar, Wallet } from 'phosphor-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { TransactionItem } from '../../components/TransactionItem';
import { useCurrency } from '../../context/CurrencyContext';
import { API_URL } from '../../config';

export default function DashboardScreen({ navigation }) {
  const { currency } = useCurrency();
  const isFocused = useIsFocused();
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null); // null = All
  const [timeFilter, setTimeFilter] = useState('all'); // 'daily' | 'weekly' | 'monthly' | 'all'
  const [userName, setUserName] = useState('');

  const balance = totalIncome - totalExpense;
  const isNegative = balance < 0;

  // Filter transactions by time + category
  const getFilteredTransactions = () => {
    const now = new Date();
    return transactions.filter(item => {
      const itemDate = new Date(item.date);
      let passesTime = true;
      if (timeFilter === 'daily') {
        passesTime = itemDate.toDateString() === now.toDateString();
      } else if (timeFilter === 'weekly') {
        const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
        passesTime = itemDate >= weekAgo;
      } else if (timeFilter === 'monthly') {
        passesTime = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      const passesCategory = !selectedCategory || item.category === selectedCategory || (item.type === 'income' && selectedCategory === 'income');
      return passesTime && passesCategory;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      }
      
      const response = await fetch(`${API_URL}/expenses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        
        // Offline Cache: Save fetched data to AsyncStorage
        await AsyncStorage.setItem('cached_transactions', JSON.stringify(data));
        
        updateTotals(data);
      } else {
        throw new Error('Server returned an error');
      }
    } catch (e) {
      console.log('Network error, loading from cache:', e);
      // Fallback: Load from cache
      const cachedData = await AsyncStorage.getItem('cached_transactions');
      if (cachedData) {
        const data = JSON.parse(cachedData);
        setTransactions(data);
        updateTotals(data);
      }
    }
  };

  const updateTotals = (data) => {
    let inc = 0;
    let exp = 0;
    data.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    setTotalIncome(inc);
    setTotalExpense(exp);
  };

  const categories = [
    { id: 'food', name: 'Food', icon: <Coffee color="#F59E0B" weight="fill" />, color: '#F59E0B' },
    { id: 'transport', name: 'Transport', icon: <Car color="#3B82F6" weight="fill" />, color: '#3B82F6' },
    { id: 'shopping', name: 'Shopping', icon: <ShoppingBag color="#EC4899" weight="fill" />, color: '#EC4899' },
    { id: 'bills', name: 'Bills', icon: <Lightning color="#8B5CF6" weight="fill" />, color: '#8B5CF6' },
    { id: 'home', name: 'Home', icon: <House color="#10B981" weight="fill" />, color: '#10B981' },
    { id: 'subscriptions', name: 'Subscriptions', icon: <Monitor color="#EF4444" weight="fill" />, color: '#EF4444' },
    { id: 'others', name: 'Others', icon: <DotsThree color="#9CA3AF" weight="fill" />, color: '#9CA3AF' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {userName || 'User'}</Text>
            <Text style={styles.subtitle}>Welcome back!</Text>
          </View>
          {/* Gold Coin Currency Button */}
          <TouchableOpacity 
            style={styles.goldCoinBtn}
            onPress={() => navigation.navigate('Currency')}
            activeOpacity={0.8}
          >
            <View style={styles.goldCoinInner}>
              <Text style={styles.goldCoinSymbol}>{currency.symbol}</Text>
            </View>
          </TouchableOpacity>
          {/* Silver Coin Logout Button */}
          <TouchableOpacity 
            style={styles.silverCoinBtn}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.8}
          >
            <View style={styles.silverCoinInner}>
              <SignOut color="#888" size={20} weight="bold" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Balance Card - Tap to Add Transaction */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            {/* Top row: label + add hint */}
            <View style={styles.balanceCardTop}>
              <View>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                {isNegative && (
                  <Text style={styles.negativeWarning}>⚠ Expenses exceed income!</Text>
                )}
              </View>
              <View style={styles.addHintBadge}>
                <Plus color="#FFF" size={14} weight="bold" />
                <Text style={styles.addHintText}>Add</Text>
              </View>
            </View>

            <Text style={[styles.balanceAmount, isNegative && { color: '#FF6B6B' }]}>
              {isNegative ? '-' : ''}{currency.symbol}{Math.abs(balance).toFixed(2)}
            </Text>
            
            <View style={styles.balanceFooter}>
              <View style={styles.balanceStat}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <CaretUp color="#FFF" size={16} />
                </View>
                <View>
                  <Text style={styles.statLabel}>Income</Text>
                  <Text style={styles.statAmount}>{currency.symbol}{totalIncome.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.balanceStat}>
                <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <CaretDown color="#FFF" size={16} />
                </View>
                <View>
                  <Text style={styles.statLabel}>Expense</Text>
                  <Text style={styles.statAmount}>{currency.symbol}{totalExpense.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Category Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={[styles.seeAll, { color: '#EF4444' }]}>✕ Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCard}
                onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
              >
                <View style={[
                  styles.categoryIconBg,
                  { backgroundColor: `${cat.color}20` },
                  isSelected && { borderColor: cat.color, borderWidth: 2 }
                ]}>
                  {cat.icon}
                </View>
                <Text style={[styles.categoryName, isSelected && { color: cat.color, fontWeight: '700' }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time Filter Tabs */}
        <View style={styles.timeFilterRow}>
          {['all', 'daily', 'weekly', 'monthly'].map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.timeFilterBtn, timeFilter === f && styles.timeFilterBtnActive]}
              onPress={() => setTimeFilter(f)}
            >
              <Text style={[styles.timeFilterText, timeFilter === f && styles.timeFilterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? `${categories.find(c => c.id === selectedCategory)?.name || 'Income'} Transactions`
              : 'Recent Activity'}
          </Text>
          <Text style={{ ...typography.caption, color: colors.textSecondary }}>
            {filteredTransactions.length} items
          </Text>
        </View>

        <View style={styles.transactions}>
          {filteredTransactions.length === 0 ? (
            <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 24, ...typography.body }}>
              {selectedCategory || timeFilter !== 'all' ? 'No transactions for this filter.' : 'No transactions yet. Start adding!'}
            </Text>
          ) : (
            filteredTransactions.map(item => {
              const categoryObj = categories.find(c => c.id === item.category) || categories[categories.length - 1];
              const icon = item.type === 'income'
                ? <Wallet color="#10B981" weight="fill" size={24} />
                : categoryObj.icon;
              const title = item.note || (item.type === 'income' ? 'Income' : categoryObj.name);
              return (
                <TransactionItem
                  key={item._id}
                  title={title}
                  date={new Date(item.date).toLocaleDateString() + ' ' + new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  amount={item.amount.toFixed(2)}
                  currencySymbol={currency.symbol}
                  type={item.type}
                  icon={icon}
                  onPress={() => navigation.navigate('EditExpense', { expense: item })}
                />
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fabContainer} 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryEnd]}
          style={styles.fab}
        >
          <Plus color="#FFF" size={24} weight="bold" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // For FAB
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  goldCoinBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#B8860B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  goldCoinInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DAA520',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF8DC',
  },
  goldCoinSymbol: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF8DC',
    textShadowColor: '#8B6914',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  silverCoinBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#AAA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#AAA',
  },
  silverCoinInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD',
  },
  balanceCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
  },
  balanceCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addHintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addHintText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  balanceLabel: {
    ...typography.body,
    color: 'rgba(255,255,255,0.8)',
  },
  negativeWarning: {
    fontSize: 11,
    color: '#FF6B6B',
    fontWeight: '600',
    marginTop: 2,
  },
  balanceAmount: {
    ...typography.h1,
    fontSize: 36,
    color: '#FFF',
    marginBottom: 32,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  statAmount: {
    ...typography.body,
    color: '#FFF',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  seeAll: {
    ...typography.caption,
    color: colors.primary,
  },
  transactions: {
    marginTop: 8,
  },
  timeFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    marginTop: 4,
  },
  timeFilterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeFilterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeFilterText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  timeFilterTextActive: {
    color: '#FFF',
  },
  categoryScroll: {
    marginBottom: 32,
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 24,
  },
  categoryIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryName: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
