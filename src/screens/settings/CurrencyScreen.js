import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, MagnifyingGlass } from 'phosphor-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useCurrency, CURRENCIES } from '../../context/CurrencyContext';

export default function CurrencyScreen({ navigation }) {
  const { currency, changeCurrency } = useCurrency();
  const [search, setSearch] = useState('');

  const filtered = CURRENCIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (selected) => {
    changeCurrency(selected);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Currency</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MagnifyingGlass color={colors.textSecondary} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search currency..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = currency.code === item.code;
          return (
            <TouchableOpacity
              style={[styles.item, isSelected && styles.itemSelected]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{item.flag}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCode}>{item.code}</Text>
              </View>
              <Text style={[styles.itemSymbol, isSelected && { color: colors.primary }]}>
                {item.symbol}
              </Text>
              {isSelected && (
                <CheckCircle color={colors.primary} size={22} weight="fill" style={styles.check} />
              )}
            </TouchableOpacity>
          );
        }}
      />
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
    paddingBottom: 16,
  },
  backBtn: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  itemSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  flag: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  itemCode: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemSymbol: {
    ...typography.h2,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  check: {
    marginLeft: 4,
  },
});
