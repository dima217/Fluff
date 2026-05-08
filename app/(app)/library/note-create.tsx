import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import AutoGrowingTextInput from "@/shared/Inputs/AutoGrowingTextInput";
import BorderlessTextInput from "@/shared/Inputs/BorderlessTextInput";
import View from "@/shared/View";
import { notesStorage } from "@/utils/notesStorage";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View as RNView,
  StyleSheet,
} from "react-native";

const NoteCreate = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (id) {
      const note = notesStorage.getById(id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
    }
  }, [id]);

  const canEditContent = title.trim().length > 0;

  const saveNote = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!isEdit && !trimmedTitle) return;

    if (isEdit && id) {
      const existing = notesStorage.getById(id);

      if (!existing) return;

      notesStorage.update(id, {
        title: trimmedTitle || existing.title,
        content: trimmedContent,
      });
    } else {
      notesStorage.add({
        title: trimmedTitle,
        content: trimmedContent,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        saveNote();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, content])
  );

  return (
    <View>
      <Header title={isEdit ? "Edit note" : "New note"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        {/* CARD CONTAINER */}
        <RNView style={styles.card}>
          <BorderlessTextInput
            placeholder="Note title..."
            placeholderTextColor={Colors.border}
            value={title}
            onChangeText={setTitle}
          />

          <AutoGrowingTextInput
            placeholder={
              canEditContent ? "Write your note..." : "Enter title first"
            }
            placeholderTextColor={Colors.border}
            value={content}
            onChangeText={setContent}
            editable={canEditContent}
            minHeight={120}
          />
        </RNView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default NoteCreate;

const styles = StyleSheet.create({
  keyboard: {
    paddingTop: 20,
    flex: 1,
  },

  card: {
    borderRadius: 16,
    paddingTop: 16,
    gap: 26,
  },

  saveBtn: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 29,
    alignItems: "center",
  },

  saveBtnDisabled: {
    opacity: 0.5,
  },
});
