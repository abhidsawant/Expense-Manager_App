import React, { useContext } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ExpensesContext } from '../../state/ExpensesContext';
import { CategoriesContext } from '../../state/CategoriesContext';
import { SettingsContext } from '../../state/ThemeContext';
import { useTheme } from '../../theme/useTheme';

export default function ExpenseDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { state, dispatch } = useContext(ExpensesContext);
  const { categories } = useContext(CategoriesContext);
  const { settings } = useContext(SettingsContext);
  const theme = useTheme();

  const expense = state.expenses.find(e => e.id === id);
  if (!expense) return null;

  const cat = categories.find(c => c.id === expense.category_id);

  function handleDelete() {
    Alert.alert('Delete expense?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          dispatch({ type: 'DELETE', payload: id });
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Detail</Text>
        <Pressable onPress={() => navigation.navigate('AddExpense', { expenseId: id })} style={styles.backBtn}>
          <Ionicons name="pencil" size={22} color={theme.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount hero */}
        <View style={[styles.amountCard, { backgroundColor: cat?.color ?? theme.primary }]}>
          <View style={styles.amountRow}>
            <Ionicons name={(cat?.icon ?? 'ellipsis-horizontal') as any} size={32} color="#fff" />
            <Text style={styles.amountText}>
              {settings.currency}{(expense.amount_cents / 100).toFixed(2)}
            </Text>
          </View>
          <Text style={styles.amountCat}>{cat?.name}</Text>
          <Text style={styles.amountDate}>{format(parseISO(expense.spent_on), 'EEEE, MMMM d yyyy')}</Text>
        </View>

        {/* Note */}
        {expense.note && (
          <View style={[styles.noteCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <Ionicons name="chatbubble-outline" size={18} color={theme.textSecondary} />
            <Text style={[styles.noteText, { color: theme.text }]}>{expense.note}</Text>
          </View>
        )}

        {/* Receipt */}
        {expense.receipt_uri && (
          <Image source={{ uri: expense.receipt_uri }} style={styles.receipt} contentFit="cover" />
        )}

        <Pressable
          onPress={handleDelete}
          style={[styles.deleteBtn, { backgroundColor: theme.danger + '15', borderColor: theme.danger }]}
        >
          <Ionicons name="trash-outline" size={20} color={theme.danger} />
          <Text style={[styles.deleteLabel, { color: theme.danger }]}>Delete expense</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, gap: 16, paddingBottom: 40 },
  amountCard: { borderRadius: 24, padding: 24, gap: 6 },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  amountText: { fontSize: 42, fontWeight: '800', color: '#fff' },
  amountCat: { fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  amountDate: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  noteCard: { flexDirection: 'row', gap: 10, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'flex-start' },
  noteText: { flex: 1, fontSize: 15, lineHeight: 22 },
  receipt: { width: '100%', height: 220, borderRadius: 16 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, borderWidth: 1.5 },
  deleteLabel: { fontSize: 15, fontWeight: '600' },
});
