import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, Pressable,
  KeyboardAvoidingView, Platform, Alert, ActionSheetIOS, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ExpensesContext } from '../../state/ExpensesContext';
import { CategoriesContext } from '../../state/CategoriesContext';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../../components/Button';
import { Expense } from '../../types';
import CategoryPickerModal from './CategoryPickerModal';

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function AddExpenseScreen({ route, navigation }: any) {
  const expenseId: string | undefined = route.params?.expenseId;
  const { state, dispatch } = useContext(ExpensesContext);
  const existing = expenseId ? state.expenses.find(e => e.id === expenseId) : undefined;

  const [amount, setAmount] = useState(existing ? (existing.amount_cents / 100).toFixed(2) : '');
  const [categoryId, setCategoryId] = useState(existing?.category_id ?? '');
  const [date, setDate] = useState(existing ? parseISO(existing.spent_on) : new Date());
  const [note, setNote] = useState(existing?.note ?? '');
  const [receiptUri, setReceiptUri] = useState<string | null>(existing?.receipt_uri ?? null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);
  const theme = useTheme();
  const { categories } = useContext(CategoriesContext);

  const selectedCat = categories.find(c => c.id === categoryId);
  const isValid = parseFloat(amount) > 0 && categoryId.length > 0;

  async function pickReceipt() {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({ options, cancelButtonIndex: 2 }, async idx => {
        if (idx === 0) await capturePhoto();
        if (idx === 1) await libraryPick();
      });
    } else {
      Alert.alert('Receipt', 'Choose source', [
        { text: 'Camera', onPress: capturePhoto },
        { text: 'Library', onPress: libraryPick },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }

  async function capturePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera access needed', 'Please enable camera access in Settings to capture receipts.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) compressAndSet(result.assets[0].uri);
  }

  async function libraryPick() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!result.canceled) compressAndSet(result.assets[0].uri);
  }

  async function compressAndSet(uri: string) {
    const compressed = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], { compress: 0.7 });
    setReceiptUri(compressed.uri);
  }

  function handleSave() {
    if (!isValid) return;
    const cents = Math.round(parseFloat(amount) * 100);
    if (existing) {
      dispatch({ type: 'UPDATE', payload: { ...existing, amount_cents: cents, category_id: categoryId, spent_on: format(date, 'yyyy-MM-dd'), note: note || null, receipt_uri: receiptUri } });
    } else {
      const expense: Expense = {
        id: uuid(), amount_cents: cents, category_id: categoryId,
        spent_on: format(date, 'yyyy-MM-dd'), note: note || null,
        receipt_uri: receiptUri, created_at: new Date().toISOString(),
      };
      dispatch({ type: 'ADD', payload: expense });
    }
    navigation.goBack();
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.title, { color: theme.text }]}>{existing ? 'Edit Expense' : 'New Expense'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Amount */}
          <View style={[styles.amountBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.currencySymbol, { color: theme.primary }]}>$</Text>
            <TextInput
              style={[styles.amountInput, { color: theme.text }]}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              autoFocus={!existing}
            />
          </View>

          {/* Category */}
          <Pressable
            onPress={() => setShowCatPicker(true)}
            style={[styles.row, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          >
            <View style={[styles.rowIcon, { backgroundColor: (selectedCat?.color ?? theme.primary) + '22' }]}>
              <Ionicons name={(selectedCat?.icon ?? 'grid-outline') as any} size={20} color={selectedCat?.color ?? theme.primary} />
            </View>
            <Text style={[styles.rowText, { color: selectedCat ? theme.text : theme.textMuted }]}>
              {selectedCat?.name ?? 'Select category'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </Pressable>

          {/* Date */}
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={[styles.row, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          >
            <View style={[styles.rowIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="calendar-outline" size={20} color={theme.primary} />
            </View>
            <Text style={[styles.rowText, { color: theme.text }]}>{format(date, 'MMM d, yyyy')}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(_, d) => { setShowDatePicker(Platform.OS === 'ios'); if (d) setDate(d); }}
            />
          )}

          {/* Note */}
          <TextInput
            style={[styles.noteInput, { backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.text }]}
            placeholder="Add a note (optional)"
            placeholderTextColor={theme.textMuted}
            value={note}
            onChangeText={t => setNote(t.slice(0, 200))}
            multiline
            maxLength={200}
          />

          {/* Receipt */}
          <Pressable
            onPress={pickReceipt}
            style={[styles.receiptBtn, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          >
            {receiptUri ? (
              <Image source={{ uri: receiptUri }} style={styles.receiptThumb} contentFit="cover" />
            ) : (
              <>
                <Ionicons name="camera-outline" size={24} color={theme.primary} />
                <Text style={[styles.receiptLabel, { color: theme.textSecondary }]}>Add receipt photo</Text>
              </>
            )}
          </Pressable>

          <Button label={existing ? 'Save changes' : 'Add expense'} onPress={handleSave} disabled={!isValid} style={styles.saveBtn} />
        </ScrollView>
      </KeyboardAvoidingView>

      <CategoryPickerModal
        visible={showCatPicker}
        selected={categoryId}
        onSelect={id => { setCategoryId(id); setShowCatPicker(false); }}
        onClose={() => setShowCatPicker(false)}
        onAddNew={() => { setShowCatPicker(false); navigation.navigate('ManageCategories'); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  form: { paddingHorizontal: 20, gap: 12, paddingBottom: 40 },
  amountBox: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 20, borderWidth: 1.5,
    paddingHorizontal: 20, paddingVertical: 8,
  },
  currencySymbol: { fontSize: 28, fontWeight: '700', marginRight: 4 },
  amountInput: { flex: 1, fontSize: 40, fontWeight: '700' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, borderWidth: 1, padding: 14,
  },
  rowIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, fontSize: 16, fontWeight: '500' },
  noteInput: {
    borderRadius: 16, borderWidth: 1, padding: 14, fontSize: 15,
    minHeight: 80, textAlignVertical: 'top',
  },
  receiptBtn: {
    borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', padding: 20,
    alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 80,
  },
  receiptLabel: { fontSize: 14, fontWeight: '500' },
  receiptThumb: { width: '100%', height: 160, borderRadius: 12 },
  saveBtn: { marginTop: 8 },
});
