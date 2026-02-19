import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import { notesStorage } from "@/utils/notesStorage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";

const NoteCreate = () => {
  const router = useRouter();
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

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (isEdit && id) {
      notesStorage.update(id, { title: trimmedTitle, content: content.trim() });
    } else {
      notesStorage.add({ title: trimmedTitle, content: content.trim() });
    }
    router.back();
  };

  const canSave = title.trim().length > 0;

  return (
    <View>
      <Header title={isEdit ? "Edit note" : "New note"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        <TextInput
          label="Title"
          placeholder="Note title..."
          placeholderTextColor={Colors.border}
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <LongTextInput
          label="Content"
          placeholder={
            canEditContent ? "Write your note..." : "Enter title first"
          }
          placeholderTextColor={Colors.border}
          value={content}
          onChangeText={setContent}
          editable={canEditContent}
          style={styles.input}
          height={200}
        />
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
        >
          <ThemedText type="s">Save</ThemedText>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    paddingTop: 20,
    flex: 1,
  },
  input: {
    marginBottom: 16,
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

export default NoteCreate;
