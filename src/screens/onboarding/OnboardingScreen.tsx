import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, Pressable, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { SettingsContext } from '../../state/ThemeContext';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../../components/Button';
import { LANGUAGES } from '../../i18n';

export default function OnboardingScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const { dispatch } = useContext(SettingsContext);
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  function handleSelectLang(code: string) {
    setSelectedLang(code);
    i18n.changeLanguage(code);
  }

  function handleStart() {
    if (name.trim().length < 2) return;
    dispatch({ type: 'UPDATE', payload: { username: name.trim(), language: selectedLang } });
    navigation.replace('Tabs');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Background blob */}
          <View style={[styles.blob, { backgroundColor: theme.primary }]} />

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.emoji}>💸</Text>
            <Text style={[styles.title, { color: theme.text }]}>{t('onboarding.title')}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('onboarding.subtitle')}</Text>
          </View>

          {/* Language Picker */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              {t('settings.language')}
            </Text>
            <View style={styles.langGrid}>
              {LANGUAGES.map(lang => {
                const isSelected = selectedLang === lang.code;
                return (
                  <Pressable
                    key={lang.code}
                    onPress={() => handleSelectLang(lang.code)}
                    style={({ pressed }) => [
                      styles.langCard,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.surface,
                        borderColor: isSelected ? theme.primary : theme.border,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.langFlag}>{lang.flag}</Text>
                    <Text style={[styles.langLabel, { color: isSelected ? '#fff' : theme.text }]}>
                      {lang.label}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkDot, { backgroundColor: '#fff' }]} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Name form */}
          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>{t('onboarding.nameLabel')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder={t('onboarding.namePlaceholder')}
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
              maxLength={30}
              returnKeyType="done"
              onSubmitEditing={handleStart}
            />
            <Button
              label={t('onboarding.getStarted')}
              onPress={handleStart}
              disabled={name.trim().length < 2}
              style={styles.btn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: {
    flexGrow: 1, paddingHorizontal: 28,
    paddingTop: 40, paddingBottom: 40, gap: 32,
  },
  blob: {
    position: 'absolute', top: -80, right: -80,
    width: 280, height: 280, borderRadius: 140, opacity: 0.25,
  },
  hero: { gap: 8 },
  emoji: { fontSize: 56 },
  title: { fontSize: 42, fontWeight: '800', letterSpacing: -1 },
  subtitle: { fontSize: 20, lineHeight: 30, fontWeight: '400' },
  section: { gap: 12 },
  sectionLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.8 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  langCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 16, borderWidth: 1.5,
    minWidth: '45%', flex: 1,
  },
  langFlag: { fontSize: 22 },
  langLabel: { fontSize: 14, fontWeight: '600', flex: 1 },
  checkDot: {
    width: 8, height: 8, borderRadius: 4,
  },
  form: { gap: 12 },
  label: { fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
  input: {
    borderRadius: 16, borderWidth: 1.5,
    paddingHorizontal: 18, paddingVertical: 14,
    fontSize: 17, fontWeight: '500',
  },
  btn: { marginTop: 4 },
});
