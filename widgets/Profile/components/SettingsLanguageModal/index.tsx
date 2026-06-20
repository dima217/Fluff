import { Language } from "@/contexts/LocalizationContext";
import { useTranslation } from "@/hooks/useTranslation";
import BaseModal from "@/shared/Modals/BaseModal";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface SettingsLanguageModalProps {
  isVisible: boolean;
  language: Language;
  onSelect: (language: Language) => void;
  onClose: () => void;
}

const SettingsLanguageModal = ({
  isVisible,
  language,
  onSelect,
  onClose,
}: SettingsLanguageModalProps) => {
  const { t } = useTranslation();

  const languages: { code: Language; label: string }[] = [
    { code: "ru", label: t("profile.russian") },
    { code: "be", label: t("profile.belarusian") },
    { code: "en", label: t("profile.english") },
  ];

  return (
    <BaseModal isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>
        <ThemedText type="heading" style={styles.title}>
          {t("profile.selectLanguage")}
        </ThemedText>

        {languages.map((lang, index) => {
          const isSelected = language === lang.code;

          return (
            <Pressable
              key={lang.code}
              style={[
                styles.option,
                index < languages.length - 1 && styles.optionBorder,
              ]}
              onPress={() => {
                onSelect(lang.code);
                onClose();
              }}
            >
              <ThemedText type="body">{lang.label}</ThemedText>
              {isSelected ? (
                <Ionicons name="checkmark" size={22} color="#E95285" />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  optionBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
});

export default SettingsLanguageModal;
