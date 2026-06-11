import React, { useContext } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SettingsContext } from '../../state/ThemeContext';
import { ExpensesContext } from '../../state/ExpensesContext';
import { CategoriesContext } from '../../state/CategoriesContext';
import { useTheme } from '../../theme/useTheme';
import { clearAll } from '../../storage';
import { Theme } from '../../types';
import Constants from 'expo-constants';
import { LANGUAGES } from '../../i18n';

const CURRENCIES = ['$', '€', '£', '¥', '₹'];
const THEMES: Theme[] = ['light', 'dark', 'system'];

export default function SettingsScreen({ navigation }: any) {
  const { settings, dispatch } = useContext(SettingsContext);
  const { dispatch: expDispatch } = useContext(ExpensesContext);
  const { dispatch: catDispatch } = useContext(CategoriesContext);
  const theme = useTheme();
  const { t } = useTranslation();

  function handleClearData() {
    Alert.alert(t('settings.clearTitle'), t('settings.clearMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'), style: 'destructive', onPress: () => {
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

  const Row = ({ icon, label, onPress, danger }: { icon: string; label: string; onPress?: () => void; danger?: boolean }) => (
    <Pressable onPress={onPress} style={[styles.row, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: danger ? theme.danger + '20' : theme.primaryLight }]}>
        <Ionicons name={icon as any} size={18} color={danger ? theme.danger : theme.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: danger ? theme.danger : theme.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('settings.title')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Section title={t('settings.profile')} />
        <View style={[styles.profileCard, { backgroundColor: theme.primary }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{settings.username?.[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{settings.username}</Text>
            <Text style={styles.profileSub}>{t('settings.profileSub')}</Text>
          </View>
        </View>

        <Section title={t('settings.appearance')} />
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>{t('settings.themeLabel')}</Text>
          <View style={styles.pills}>
            {THEMES.map(th => (
              <Pressable key={th} onPress={() => dispatch({ type: 'UPDATE', payload: { theme: th } })}
                style={[styles.pill, { backgroundColor: settings.theme === th ? theme.primary : theme.surface }]}>
                <Text style={[styles.pillText, { color: settings.theme === th ? '#fff' : theme.textSecondary }]}>
                  {t(`settings.theme${th.charAt(0).toUpperCase() + th.slice(1)}` as any)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Section title={t('settings.currency')} />
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.pills}>
            {CURRENCIES.map(c => (
              <Pressable key={c} onPress={() => dispatch({ type: 'UPDATE', payload: { currency: c } })}
                style={[styles.pill, { backgroundColor: settings.currency === c ? theme.primary : theme.surface }]}>
                <Text style={[styles.pillText, { color: settings.currency === c ? '#fff' : theme.textSecondary }]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Language Picker */}
        <Section title={t('settings.language')} />
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.pills}>
            {LANGUAGES.map(lang => (
              <Pressable
                key={lang.code}
                onPress={() => dispatch({ type: 'UPDATE', payload: { language: lang.code } })}
                style={[styles.langPill, { backgroundColor: settings.language === lang.code ? theme.primary : theme.surface }]}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.pillText, { color: settings.language === lang.code ? '#fff' : theme.textSecondary }]}>
                  {lang.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Section title={t('settings.data')} />
        <Row icon="list" label={t('settings.manageCategories')} onPress={() => navigation.navigate('ManageCategories')} />

        <Section title={t('settings.dangerZone')} />
        <Row icon="trash-outline" label={t('settings.clearData')} onPress={handleClearData} danger />

        <Section title={t('settings.about')} />
        <Row icon="information-circle-outline" label={t('about.title')} onPress={() => navigation.navigate('About')} />

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
  langPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  langFlag: { fontSize: 16 },
  pillText: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 14 },
  rowIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  version: { fontSize: 12, textAlign: 'center', marginTop: 16 },
});
