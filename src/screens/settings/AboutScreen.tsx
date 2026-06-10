import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '../../theme/useTheme';

export default function AboutScreen({ navigation }: any) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>About</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.appIcon, { backgroundColor: theme.primary }]}>
          <Text style={styles.appEmoji}>💸</Text>
        </View>
        <Text style={[styles.appName, { color: theme.text }]}>ExpenseFlow</Text>
        <Text style={[styles.version, { color: theme.textSecondary }]}>
          Version {Constants.expoConfig?.version ?? '1.0.0'}
        </Text>

        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.cardText, { color: theme.textSecondary }]}>
            A React Native fundamentals-first personal finance app. Built with Expo, AsyncStorage, and React Navigation.
          </Text>
        </View>

        <Pressable
          onPress={() => Linking.openURL('https://docs.expo.dev')}
          style={[styles.link, { backgroundColor: theme.surface }]}
        >
          <Ionicons name="open-outline" size={18} color={theme.primary} />
          <Text style={[styles.linkText, { color: theme.primary }]}>Expo Documentation</Text>
        </Pressable>

        <Pressable
          onPress={() => Linking.openURL('https://reactnative.dev')}
          style={[styles.link, { backgroundColor: theme.surface }]}
        >
          <Ionicons name="open-outline" size={18} color={theme.primary} />
          <Text style={[styles.linkText, { color: theme.primary }]}>React Native Docs</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 28, paddingTop: 32, gap: 16 },
  appIcon: { width: 90, height: 90, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  appEmoji: { fontSize: 44 },
  appName: { fontSize: 28, fontWeight: '800' },
  version: { fontSize: 14 },
  card: { borderRadius: 16, borderWidth: 1, padding: 18, width: '100%' },
  cardText: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, width: '100%' },
  linkText: { fontSize: 15, fontWeight: '600' },
});
