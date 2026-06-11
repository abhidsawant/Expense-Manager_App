import React, { useContext, useMemo, useCallback, useRef } from 'react';
import {
  View, Text, SectionList, Pressable, StyleSheet,
  RefreshControl, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ExpensesContext } from '../../state/ExpensesContext';
import { CategoriesContext } from '../../state/CategoriesContext';
import { SettingsContext } from '../../state/ThemeContext';
import { useTheme } from '../../theme/useTheme';
import { EmptyState } from '../../components/EmptyState';
import { Expense } from '../../types';

function groupByDay(expenses: Expense[]) {
  const map: Record<string, Expense[]> = {};
  [...expenses].sort((a, b) => b.spent_on.localeCompare(a.spent_on)).forEach(e => {
    if (!map[e.spent_on]) map[e.spent_on] = [];
    map[e.spent_on].push(e);
  });
  return Object.entries(map).map(([date, data]) => ({ title: date, data }));
}

export default function HomeScreen({ navigation }: any) {
  const { state } = useContext(ExpensesContext);
  const { categories } = useContext(CategoriesContext);
  const { settings } = useContext(SettingsContext);
  const theme = useTheme();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);
  const fabAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(useCallback(() => {
    Animated.spring(fabAnim, { toValue: 1, useNativeDriver: true, tension: 80 }).start();
    return () => fabAnim.setValue(0);
  }, []));

  const sections = useMemo(() => groupByDay(state.expenses), [state.expenses]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const renderItem = useCallback(({ item }: { item: Expense }) => {
    const cat = categories.find(c => c.id === item.category_id);
    return (
      <Pressable
        onPress={() => navigation.navigate('ExpenseDetail', { id: item.id })}
        onLongPress={() => navigation.navigate('AddExpense', { expenseId: item.id })}
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: theme.bgCard, borderColor: theme.border, opacity: pressed ? 0.75 : 1 },
        ]}
      >
        <View style={[styles.iconBadge, { backgroundColor: cat?.color + '22' }]}>
          <Ionicons name={(cat?.icon ?? 'ellipsis-horizontal') as any} size={22} color={cat?.color ?? theme.primary} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.catName, { color: theme.text }]}>{cat?.name ?? 'Unknown'}</Text>
          {item.note ? <Text style={[styles.note, { color: theme.textSecondary }]} numberOfLines={1}>{item.note}</Text> : null}
        </View>
        <Text style={[styles.amount, { color: theme.primary }]}>
          {settings.currency}{(item.amount_cents / 100).toFixed(2)}
        </Text>
      </Pressable>
    );
  }, [categories, theme, settings.currency]);

  const renderSectionHeader = useCallback(({ section: { title, data } }: any) => {
    const total = data.reduce((s: number, e: Expense) => s + e.amount_cents, 0);
    return (
      <View style={[styles.sectionHeader, { backgroundColor: theme.bg }]}>
        <Text style={[styles.sectionDate, { color: theme.textSecondary }]}>{format(parseISO(title), 'EEE, MMM d')}</Text>
        <Text style={[styles.sectionTotal, { color: theme.textMuted }]}>{settings.currency}{(total / 100).toFixed(2)}</Text>
      </View>
    );
  }, [theme, settings.currency]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>{t('home.greeting', { name: settings.username })}</Text>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{t('home.title')}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('Stats')} style={[styles.statsBtn, { backgroundColor: theme.surface }]}>
          <Ionicons name="stats-chart" size={20} color={theme.primary} />
        </Pressable>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={[styles.list, sections.length === 0 && styles.listEmpty]}
        ListEmptyComponent={<EmptyState message={t('home.empty')} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      <Animated.View style={[styles.fab, { transform: [{ scale: fabAnim }], shadowColor: theme.primary }]}>
        <Pressable onPress={() => navigation.navigate('AddExpense', {})} style={[styles.fabInner, { backgroundColor: theme.primary }]}>
          <Ionicons name="add" size={32} color="#fff" />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  greeting: { fontSize: 13, fontWeight: '500' },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  statsBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  listEmpty: { flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 4, marginTop: 8 },
  sectionDate: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  sectionTotal: { fontSize: 13, fontWeight: '500' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 8 },
  iconBadge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  catName: { fontSize: 15, fontWeight: '600' },
  note: { fontSize: 12, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 28, right: 24, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12 },
  fabInner: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});
