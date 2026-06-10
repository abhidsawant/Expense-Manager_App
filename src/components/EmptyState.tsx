import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';

export function EmptyState({ message }: { message: string }) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Ionicons name="wallet-outline" size={64} color={theme.textMuted} />
      <Text style={[styles.text, { color: theme.textMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  text: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
});
