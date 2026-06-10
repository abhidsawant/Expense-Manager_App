import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, Pressable, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsContext } from '../../state/ThemeContext';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../../components/Button';

export default function OnboardingScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const { dispatch } = useContext(SettingsContext);
  const theme = useTheme();

  function handleStart() {
    if (name.trim().length < 2) return;
    dispatch({ type: 'UPDATE', payload: { username: name.trim() } });
    navigation.replace('Tabs');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Hero gradient blob */}
          <View style={[styles.blob, { backgroundColor: theme.primary }]} />

          <View style={styles.hero}>
            <Text style={[styles.emoji]}>💸</Text>
            <Text style={[styles.title, { color: theme.text }]}>ExpenseFlow</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Track spend.{'\n'}Stay in control.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>What should we call you?</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="Your name"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
              maxLength={30}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleStart}
            />
            <Button
              label="Get started →"
              onPress={handleStart}
              disabled={name.trim().length < 2}
              style={styles.btn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 28, justifyContent: 'space-between', paddingBottom: 40 },
  blob: {
    position: 'absolute', top: -80, right: -80,
    width: 280, height: 280, borderRadius: 140, opacity: 0.25,
  },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', gap: 8 },
  emoji: { fontSize: 56 },
  title: { fontSize: 42, fontWeight: '800', letterSpacing: -1 },
  subtitle: { fontSize: 20, lineHeight: 30, fontWeight: '400' },
  form: { gap: 12 },
  label: { fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
  input: {
    borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 18, paddingVertical: 14,
    fontSize: 17, fontWeight: '500',
  },
  btn: { marginTop: 4 },
});
