import React, { useContext } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CategoriesContext } from '../../state/CategoriesContext';
import { useTheme } from '../../theme/useTheme';

type Props = {
  visible: boolean;
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  onAddNew: () => void;
};

export default function CategoryPickerModal({ visible, selected, onSelect, onClose, onAddNew }: Props) {
  const { categories } = useContext(CategoriesContext);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{t('categoryPicker.title')}</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close-circle" size={28} color={theme.textMuted} />
          </Pressable>
        </View>
        <FlatList
          data={categories}
          numColumns={3}
          keyExtractor={c => c.id}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelect(item.id)}
              style={[styles.cell, { backgroundColor: theme.bgCard, borderColor: item.id === selected ? item.color : theme.border }]}
            >
              <View style={[styles.iconWrap, { backgroundColor: item.color + '22' }]}>
                <Ionicons name={item.icon as any} size={26} color={item.color} />
              </View>
              <Text style={[styles.cellLabel, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
              {item.id === selected && <Ionicons name="checkmark-circle" size={16} color={item.color} style={styles.check} />}
            </Pressable>
          )}
          ListFooterComponent={
            <Pressable onPress={onAddNew} style={[styles.addNew, { borderColor: theme.border }]}>
              <Ionicons name="add-circle-outline" size={20} color={theme.primary} />
              <Text style={[styles.addNewLabel, { color: theme.primary }]}>{t('categoryPicker.addNew')}</Text>
            </Pressable>
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  grid: { paddingHorizontal: 12, paddingBottom: 40, gap: 10 },
  cell: { flex: 1, margin: 4, borderRadius: 16, borderWidth: 2, alignItems: 'center', padding: 12, gap: 6 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  cellLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  check: { position: 'absolute', top: 6, right: 6 },
  addNew: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 4, padding: 16, borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed' },
  addNewLabel: { fontSize: 14, fontWeight: '600' },
});
