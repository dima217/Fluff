import { Language } from "@/contexts/LocalizationContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/services/push/pushNotificationsPreference";
import Header from "@/shared/Header";
import {
  SettingsGroup,
  SettingsRow,
  SettingsSection,
} from "@/shared/ui/Settings";
import View from "@/shared/View";
import { appSettingsStorage } from "@/storage/appSettings/appSettingsStorage";
import { getGmtOffsetLabel } from "@/utils/timezone/getGmtOffsetLabel";
import SettingsLanguageModal from "@/widgets/Profile/components/SettingsLanguageModal";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

const languageLabels: Record<Language, string> = {
  ru: "profile.russian",
  be: "profile.belarusian",
  en: "profile.english",
};

const Settings = () => {
  const { t, language, setLanguage } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => appSettingsStorage.isNotificationsEnabled(),
  );
  const [publishRecipesEnabled, setPublishRecipesEnabled] = useState(
    () => appSettingsStorage.isPublishRecipesEnabled(),
  );
  const [nutrientTrackingEnabled, setNutrientTrackingEnabled] = useState(
    () => appSettingsStorage.isNutrientTrackingEnabled(),
  );
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  const languageLabel = useMemo(
    () => t(languageLabels[language]),
    [language, t],
  );

  const localTimeLabel = useMemo(() => getGmtOffsetLabel(), []);

  const handleNotificationsChange = useCallback(async (value: boolean) => {
    setNotificationsEnabled(value);
    appSettingsStorage.set({ notificationsEnabled: value });

    try {
      if (value) {
        const registered = await registerPushNotifications();
        if (!registered) {
          setNotificationsEnabled(false);
          appSettingsStorage.set({ notificationsEnabled: false });
        }
      } else {
        await unregisterPushNotifications();
      }
    } catch {
      setNotificationsEnabled(!value);
      appSettingsStorage.set({ notificationsEnabled: !value });
    }
  }, []);

  const handlePublishRecipesChange = useCallback((value: boolean) => {
    setPublishRecipesEnabled(value);
    appSettingsStorage.set({ publishRecipesEnabled: value });
  }, []);

  const handleNutrientTrackingChange = useCallback((value: boolean) => {
    setNutrientTrackingEnabled(value);
    appSettingsStorage.set({ nutrientTrackingEnabled: value });
  }, []);

  return (
    <View style={styles.screen}>
      <Header title={t("profile.settings")} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection
          title={t("settings.notificationAccess")}
          footer={t("settings.notificationAccessFooter")}
        >
          <SettingsGroup>
            <SettingsRow
              label={t("settings.turnOnNotifications")}
              switchValue={notificationsEnabled}
              onSwitchChange={handleNotificationsChange}
              isLast
            />
          </SettingsGroup>
        </SettingsSection>

        <SettingsSection title={t("settings.preferences")}>
          <SettingsGroup>
            <SettingsRow
              label={t("profile.language")}
              value={languageLabel}
              showChevron
              onPress={() => setIsLanguageModalVisible(true)}
            />
            <SettingsRow
              label={t("settings.localTime")}
              value={localTimeLabel}
              isLast
            />
          </SettingsGroup>
        </SettingsSection>

        <SettingsSection
          title={t("settings.publicationAccess")}
          footer={t("settings.publicationAccessFooter")}
        >
          <SettingsGroup>
            <SettingsRow
              label={t("settings.publishRecipes")}
              switchValue={publishRecipesEnabled}
              onSwitchChange={handlePublishRecipesChange}
              isLast
            />
          </SettingsGroup>
        </SettingsSection>

        <SettingsSection
          title={t("settings.healthTracking")}
          footer={t("settings.nutrientTrackingFooter")}
        >
          <SettingsGroup>
            <SettingsRow
              label={t("settings.trackNutrients")}
              switchValue={nutrientTrackingEnabled}
              onSwitchChange={handleNutrientTrackingChange}
              isLast
            />
          </SettingsGroup>
        </SettingsSection>
      </ScrollView>

      <SettingsLanguageModal
        isVisible={isLanguageModalVisible}
        language={language}
        onSelect={setLanguage}
        onClose={() => setIsLanguageModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
});

export default Settings;
