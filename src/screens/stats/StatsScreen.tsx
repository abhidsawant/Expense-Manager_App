import React, { useContext, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { ExpensesContext } from '../../state/ExpensesContext';
import { CategoriesContext } from '../../state/CategoriesContext';
import { SettingsContext } from '../../state/ThemeContext';
import { useTheme } from '../../theme/useTheme';
import { EmptyState } from '../../components/EmptyState';

export default function StatsScreen() {
  const { state } = useContext(ExpensesContext);
  const { categories } = useContext(CategoriesContext);
  const { settings } = useContext(SettingsContext);
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());

  function shiftMonth(dir: 1 | -1) {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  }

  const { total, byCat } = useMemo(() => {
    const start = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
    const end = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
    const filtered = state.expenses.filter(e => e.spent_on >= start && e.spent_on <= end);
    const total = filtered.reduce((s, e) => s + e.amount_cents, 0);
    const map: Record<string, number> = {};
    filtered.forEach(e => { map[e.category_id] = (map[e.category_id] ?? 0) + e.amount_cents; });
    const byCat = Object.entries(map).map(([id, amount]) => ({
      cat: categories.find(c => c.id === id),
      amount,
      percent: total > 0 ? (amount / total) * 100 : 0,
    })).sort((a, b) => b.amount - a.amount);
    return { total, byCat };
  }, [state.expenses, categories, selectedDate]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Stats</Text>
      </View>

      {/* Month switcher */}
      <View style={[styles.monthRow, { backgroundColor: theme.surface }]}>
        <Pressable onPress={() => shiftMonth(-1)} style={styles.arrowBtn}>
          <Ionicons name="chevron-back" size={22} color={theme.primary} />
        </Pressable>
        <Text style={[styles.monthLabel, { color: theme.text }]}>
          {format(selectedDate, 'MMMM yyyy')}
        </Text>
        <Pressable onPress={() => shiftMonth(1)} style={styles.arrowBtn} disabled={format(selectedDate, 'yyyy-MM') >= format(new Date(), 'yyyy-MM')}>
          <Ionicons name="chevron-forward" size={22} color={theme.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.content, byCat.length === 0 && styles.emptyContent]} showsVerticalScrollIndicator={false}>
        {byCat.length === 0 ? (
          <EmptyState message="No expenses this month" />
        ) : (
          <>
            {/* Total */}
            <View style={[styles.totalCard, { backgroundColor: theme.primary }]}>
              <Text style={styles.totalLabel}>Total spent</Text>
              <Text style={styles.totalAmount}>{settings.currency}{(total / 100).toFixed(2)}</Text>
            </View>

            {/* Bars */}
            <View style={styles.barsSection}>
              {byCat.map(({ cat, amount, percent }) => (
                <View key={cat?.id ?? 'unknown'} style={styles.barRow}>
                  <View style={styles.barMeta}>
                    <View style={[styles.catDot, { backgroundColor: cat?.color ?? theme.primary }]} />
                    <Text style={[styles.barCatName, { color: theme.text }]}>{cat?.name ?? 'Unknown'}</Text>
                    <Text style={[styles.barAmount, { color: theme.textSecondary }]}>
                      {settings.currency}{(amount / 100).toFixed(2)}
                    </Text>
                  </View>
                  <View style={[styles.barTrack, { backgroundColor: theme.surface }]}>
                    <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: cat?.color ?? theme.primary }]} />
                  </View>
                  <Text style={[styles.barPercent, { color: theme.textMuted }]}>{percent.toFixed(0)}%</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, borderRadius: 16, padding: 4, marginBottom: 16 },
  arrowBtn: { padding: 10 },
  monthLabel: { fontSize: 16, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  emptyContent: { flex: 1 },
  totalCard: { borderRadius: 24, padding: 24, gap: 4 },
  totalLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  totalAmount: { color: '#fff', fontSize: 42, fontWeight: '800' },
  barsSection: { gap: 16 },
  barRow: { gap: 6 },
  barMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  barCatName: { flex: 1, fontSize: 14, fontWeight: '600' },
  barAmount: { fontSize: 14, fontWeight: '500' },
  barTrack: { height: 10, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barPercent: { fontSize: 11, fontWeight: '500', textAlign: 'right' },
});
