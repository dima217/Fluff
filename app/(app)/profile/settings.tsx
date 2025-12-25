import { Colors } from "@/constants/design-tokens";
import { Language } from "@/contexts/LocalizationContext";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import { ThemedText } from "@/shared/ui/ThemedText";
import View from "@/shared/View";
import { StyleSheet, TouchableOpacity } from "react-native";

const Settings = () => {
  const { t, language, setLanguage } = useTranslation();

  const languages: { code: Language; label: string }[] = [
    { code: "ru", label: t("profile.russian") },
    { code: "be", label: t("profile.belarusian") },
    { code: "en", label: t("profile.english") },
  ];

  return (
    <View>
      <Header title={t("profile.settings")} />
      <View style={styles.content}>
        <ThemedText type="s" style={styles.label}>
          {t("profile.selectLanguage")}
        </ThemedText>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageOption,
              language === lang.code && styles.languageOptionActive,
            ]}
            onPress={() => setLanguage(lang.code)}
          >
            <ThemedText
              style={[
                styles.languageText,
                language === lang.code && styles.languageTextActive,
              ]}
            >
              {lang.label}
            </ThemedText>
            {language === lang.code && (
              <ThemedText style={styles.checkmark}>✓</ThemedText>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 20,
    color: Colors.text,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: Colors.inactive,
  },
  languageOptionActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: Colors.primary,
  },
  languageText: {
    fontSize: 16,
    color: Colors.text,
  },
  languageTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: "bold",
  },
});

export default Settings;
