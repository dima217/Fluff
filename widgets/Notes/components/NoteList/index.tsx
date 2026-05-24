import { useColors } from "@/contexts/ThemeContext";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import SerchLight from "@/assets/images/SearchLight.svg";

import TextInput from "@/shared/Inputs/TextInput";
import Circle from "@/shared/ui/Circle";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/shared/ui/ThemedText";
import NoteCard from "../NoteCard";

export interface NoteListItem {
  id: string;
  createdAt: string;
  title: string;
  onPress: () => void;
  onDelete: () => void;
}

interface NoteListProps {
  notes: NoteListItem[];
}

const NoteList = ({ notes }: NoteListProps) => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createstyles);
  const [search, setSearch] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<NoteListItem[]>(notes);

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  useEffect(() => {
    setFilteredNotes(
      notes.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, notes]);

  return (
    <View style={styles.listContainer}>
      <TextInput
        placeholder={t("common.search")}
        placeholderTextColor={colors.text}
        style={styles.searchInput}
        inputContainerStyle={styles.searchInputContainer}
        right={<Circle onPress={() => {}} svg={<SerchLight />} />}
        onChangeText={handleSearch}
        defaultValue={search}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <View key={note.id} style={styles.noteCardContainer}>
              <NoteCard key={note.id} {...note} />
            </View>
          ))
        ) : (
          <ThemedText type="xs" style={styles.emptyText}>
            {search.trim().length > 0
              ? t("search.noResults")
              : t("library.notesEmpty")}
          </ThemedText>
        )}
      </ScrollView>
    </View>
  );
};

export default NoteList;

const createstyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  noteCardContainer: {
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
    gap: 10,
  },
  searchInput: {
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  searchInputContainer: {
    borderWidth: 0,
    paddingRight: 6,
  },
  emptyText: {
    color: colors.secondary,
    textAlign: "center",
    marginTop: 24,
  },
});
