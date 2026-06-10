import React, { useContext } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SettingsContext } from '../../state/ThemeContext';
import { ExpensesContext } from '../../state/ExpensesContext';
import { CategoriesContext } from '../../state/CategoriesContext';
import { useTheme } from '../../theme/useTheme';
import { clearAll, DEFAULT_CATEGORIES } from '../../storage';
import { Theme } from '../../types';
import Constants from 'expo-constants';

const CURRENCIES = ['$', '€', '£', '¥', '₹'];
const THEMES: Theme[] = ['light', 'dark', 'system'];

export default function SettingsScreen({ navigation }: any) {
  const { settings, dispatch } = useContext(SettingsContext);
  const { dispatch: expDispatch } = useContext(ExpensesContext);
  const { dispatch: catDispatch } = useContext(CategoriesContext);
  const theme = useTheme();

  function handleClearData() {
    Alert.alert('Clear all data?', 'This will delete ALL expenses and categories.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive', onPress: () => {
          clearAll().then(() => {
            expDispatch({ type: 'CLEAR' });
            catDispatch({ type: 'RESET' });
          });
        },
      },
    ]);
  }

  const Section = ({ title }: { title: string }) => (
    <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>{title}</Text>
  );

  const Row = ({ icon, label, right, onPress, danger }: { icon: string; label: string; right?: React.ReactNode; onPress?: () => void; danger?: boolean }) => (
    <Pressable
      onPress={onPress}
      style={[styles.row, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: danger ? theme.danger + '20' : theme.primaryLight }]}>
        <Ionicons name={icon as any} size={18} color={danger ? theme.danger : theme.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: danger ? theme.danger : theme.text }]}>{label}</Text>
      {right ?? <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />}
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Section title="PROFILE" />
        <View style={[styles.profileCard, { backgroundColor: theme.primary }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{settings.username?.[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{settings.username}</Text>
            <Text style={styles.profileSub}>ExpenseFlow user</Text>
          </View>
        </View>

        <Section title="APPEARANCE" />
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Theme</Text>
          <View style={styles.pills}>
            {THEMES.map(t => (
              <Pressable
                key={t}
                onPress={() => dispatch({ type: 'UPDATE', payload: { theme: t } })}
                style={[styles.pill, { backgroundColor: settings.theme === t ? theme.primary : theme.surface }]}
              >
                <Text style={[styles.pillText, { color: settings.theme === t ? '#fff' : theme.textSecondary }]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Section title="CURRENCY" />
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.pills}>
            {CURRENCIES.map(c => (
              <Pressable
                key={c}
                onPress={() => dispatch({ type: 'UPDATE', payload: { currency: c } })}
                style={[styles.pill, { backgroundColor: settings.currency === c ? theme.primary : theme.surface }]}
              >
                <Text style={[styles.pillText, { color: settings.currency === c ? '#fff' : theme.textSecondary }]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Section title="DATA" />
        <Row icon="list" label="Manage Categories" onPress={() => navigation.navigate('ManageCategories')} />

        <Section title="DANGER ZONE" />
        <Row icon="trash-outline" label="Clear all data" onPress={handleClearData} danger />

        <Section title="ABOUT" />
        <Row icon="information-circle-outline" label="About" onPress={() => navigation.navigate('About')} />

        <Text style={[styles.version, { color: theme.textMuted }]}>
          v{Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginTop: 12, marginBottom: 4 },
  profileCard: { borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  profileName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  profileSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  cardLabel: { fontSize: 13, fontWeight: '600' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  pillText: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 14 },
  rowIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  version: { fontSize: 12, textAlign: 'center', marginTop: 16 },
});
