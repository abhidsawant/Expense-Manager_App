import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from './src/state/ThemeContext';
import { ExpensesProvider } from './src/state/ExpensesContext';
import { CategoriesProvider } from './src/state/CategoriesContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <CategoriesProvider>
          <ExpensesProvider>
            <RootNavigator />
            <StatusBar style="auto" />
          </ExpensesProvider>
        </CategoriesProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
