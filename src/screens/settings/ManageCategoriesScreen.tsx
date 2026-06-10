import React, { useContext, useState } from 'react';
import {
  View, Text, FlatList, Pressable, StyleSheet, Alert, Modal,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CategoriesContext } from '../../state/CategoriesContext';
import { ExpensesContext } from '../../state/ExpensesContext';
import { useTheme } from '../../theme/useTheme';
import { Category } from '../../types';

const COLORS = ['#A855F7', '#22D3EE', '#EC4899', '#4ADE80', '#FACC15', '#F87171', '#60A5FA', '#FB923C', '#9CA3AF'];
const ICONS = ['restaurant', 'car', 'bag-handle', 'medkit', 'game-controller', 'receipt', 'home', 'airplane', 'school'];

function uuid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export default function ManageCategoriesScreen({ navigation }: any) {
  const { categories, dispatch } = useContext(CategoriesContext);
  const { state: expState } = useContext(ExpensesContext);
  const theme = useTheme();
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [isNew, setIsNew] = useState(false);

  function openAdd() { setEditing({ name: '', color: COLORS[0], icon: ICONS[0] }); setIsNew(true); }
  function openEdit(cat: Category) { setEditing({ ...cat }); setIsNew(false); }

  function handleSave() {
    if (!editing?.name?.trim()) return;
    if (isNew) {
      dispatch({ type: 'ADD', payload: { id: uuid(), name: editing.name!, color: editing.color!, icon: editing.icon!, is_default: false } });
    } else {
      dispatch({ type: 'UPDATE', payload: editing as Category });
    }
    setEditing(null);
  }

  function handleDelete(cat: Category) {
    const inUse = expState.expenses.some(e => e.category_id === cat.id);
    if (inUse) {
      Alert.alert('Cannot delete', `"${cat.name}" is used by existing expenses.`);
      return;
    }
    Alert.alert('Delete category?', `Delete "${cat.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch({ type: 'DELETE', payload: cat.id }) },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Categories</Text>
        <Pressable onPress={openAdd} style={[styles.addBtn, { backgroundColor: theme.primary }]}>
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={categories}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openEdit(item)}
            onLongPress={() => handleDelete(item)}
            style={[styles.row, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          >
            <View style={[styles.iconBadge, { backgroundColor: item.color + '22' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text style={[styles.catName, { color: theme.text }]}>{item.name}</Text>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </Pressable>
        )}
      />

      {/* Edit / Add Modal */}
      <Modal visible={editing !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditing(null)}>
        <KeyboardAvoidingView style={[styles.modal, { backgroundColor: theme.bg }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalHandle} />
          <Text style={[styles.modalTitle, { color: theme.text }]}>{isNew ? 'New Category' : 'Edit Category'}</Text>

          <TextInput
            style={[styles.nameInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="Category name"
            placeholderTextColor={theme.textMuted}
            value={editing?.name ?? ''}
            onChangeText={t => setEditing(prev => ({ ...prev, name: t }))}
          />

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Color</Text>
          <View style={styles.colorRow}>
            {COLORS.map(c => (
              <Pressable key={c} onPress={() => setEditing(prev => ({ ...prev, color: c }))}
                style={[styles.colorSwatch, { backgroundColor: c, borderWidth: editing?.color === c ? 3 : 0, borderColor: '#fff' }]} />
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Icon</Text>
          <View style={styles.iconRow}>
            {ICONS.map(ic => (
              <Pressable key={ic} onPress={() => setEditing(prev => ({ ...prev, icon: ic }))}
                style={[styles.iconOpt, { backgroundColor: editing?.icon === ic ? theme.primary : theme.surface }]}>
                <Ionicons name={ic as any} size={22} color={editing?.icon === ic ? '#fff' : theme.textSecondary} />
              </Pressable>
            ))}
          </View>

          <View style={styles.modalActions}>
            <Pressable onPress={() => setEditing(null)} style={[styles.modalBtn, { backgroundColor: theme.surface }]}>
              <Text style={[styles.modalBtnText, { color: theme.text }]}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={[styles.modalBtn, { backgroundColor: theme.primary }]}>
              <Text style={[styles.modalBtnText, { color: '#fff' }]}>Save</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  addBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 16, gap: 8, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 14 },
  iconBadge: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  catName: { flex: 1, fontSize: 15, fontWeight: '600' },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  modal: { flex: 1, padding: 24, gap: 12 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  nameInput: { borderRadius: 14, borderWidth: 1.5, padding: 14, fontSize: 16, fontWeight: '500' },
  sectionLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 0.8 },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorSwatch: { width: 36, height: 36, borderRadius: 18 },
  iconRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconOpt: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtn: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
  modalBtnText: { fontSize: 16, fontWeight: '700' },
});
