
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import KeyboardAwareView from "@/shared/KeyboardAwareView";
import AutoGrowingTextInput from "@/shared/Inputs/AutoGrowingTextInput";
import BorderlessTextInput from "@/shared/Inputs/BorderlessTextInput";
import View from "@/shared/View";
import { notesStorage } from "@/storage/notes/notesData";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  View as RNView,
  StyleSheet,
} from "react-native";

const NoteCreate = () => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createstyles);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const titleRef = useRef(title);
  const contentRef = useRef(content);

  titleRef.current = title;
  contentRef.current = content;

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

  useFocusEffect(
    useCallback(() => {
      return () => {
        const trimmedTitle = titleRef.current.trim();
        const trimmedContent = contentRef.current.trim();

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
    }, [id, isEdit])
  );

  return (
    <View>
      <Header title={isEdit ? t("library.editNote") : t("library.newNote")} />

      <KeyboardAwareView style={styles.keyboard}>
        {/* CARD CONTAINER */}
        <RNView style={styles.card}>
          <BorderlessTextInput
            placeholder={t("library.noteTitlePlaceholder")}
            placeholderTextColor={colors.border}
            value={title}
            onChangeText={setTitle}
          />

          <AutoGrowingTextInput
            placeholder={
              canEditContent
                ? t("library.noteContentPlaceholder")
                : t("library.noteEnterTitleFirst")
            }
            placeholderTextColor={colors.border}
            value={content}
            onChangeText={setContent}
            editable={canEditContent}
            minHeight={120}
          />
        </RNView>
      </KeyboardAwareView>
    </View>
  );
};

export default NoteCreate;

const createstyles = (colors: AppColors) => StyleSheet.create({
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
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 29,
    alignItems: "center",
  },

  saveBtnDisabled: {
    opacity: 0.5,
  },
});
