
import { useColors } from "@/contexts/ThemeContext";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Header from "@/shared/Header";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import { notesStorage, type Note } from "@/utils/notesStorage";
import NoteList from "@/widgets/Notes/components/NoteList";
import { getNoteItems } from "@/widgets/Notes/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, View as RNView, StyleSheet } from "react-native";

const Notes = () => {
  const styles = useThemedStyles(createstyles);
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  useFocusEffect(
    useCallback(() => {
      setNotes(notesStorage.getAll());
    }, [])
  );

  const handleCreate = useCallback(() => {
    router.push("/(app)/library/note-create");
  }, [router]);

  const handleNotePress = useCallback(
    (note: Note) => {
      router.push({
        pathname: "/(app)/library/note-create",
        params: { id: note.id },
      });
    },
    [router]
  );

  const handleDelete = useCallback((id: string) => {
    notesStorage.remove(id);
    setNotes(notesStorage.getAll());
  }, []);

  const noteItems = useMemo(
    () =>
      getNoteItems(notes, {
        onPress: handleNotePress,
        onDelete: handleDelete,
      }),
    [notes, handleNotePress, handleDelete]
  );

  return (
    <View>
      <Header title="Notes" />

      <RNView style={styles.container}>
        <NoteList notes={noteItems} />

        <RNView style={styles.createBtnContainer}>
          <Pressable onPress={handleCreate} style={styles.createBtn}>
            <ThemedText type="s">New note</ThemedText>
          </Pressable>
        </RNView>
      </RNView>
    </View>
  );
};

export default Notes;

const createstyles = (colors: AppColors) => StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
  },
  createBtn: {
    width: "30%",
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 29,
    alignItems: "center",
    marginBottom: 30,
  },
  createBtnContainer: {
    alignSelf: "center",
    width: "100%",
    alignItems: "flex-end",
  },
});
