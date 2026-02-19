import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import { notesStorage, type Note } from "@/utils/notesStorage";
import NoteList from "@/widgets/Notes/components/NoteList";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, View as RNView, StyleSheet } from "react-native";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Notes = () => {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  useFocusEffect(
    useCallback(() => {
      setNotes(notesStorage.getAll());
    }, [])
  );

  const handleCreate = () => {
    router.push("/(app)/library/note-create");
  };

  const handleNotePress = (note: Note) => {
    router.push({
      pathname: "/(app)/library/note-create",
      params: { id: note.id },
    });
  };

  const handleDelete = (id: string) => {
    notesStorage.remove(id);
    setNotes(notesStorage.getAll());
  };

  const noteItems = notes.map((n) => ({
    id: n.id,
    title: n.title,
    createdAt: formatDate(n.createdAt),
    onPress: () => handleNotePress(n),
    onDelete: () => handleDelete(n.id),
  }));

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

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
  },
  createBtn: {
    width: "30%",
    backgroundColor: Colors.primary,
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

export default Notes;
