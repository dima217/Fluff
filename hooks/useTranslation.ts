import { useLocalization } from "@/contexts/LocalizationContext";

/**
 * Hook for translations
 * Usage: const { t } = useTranslation();
 * Then: t('profile.myProfile') or t('tabs.home')
 */
export const useTranslation = () => {
  const { t, language, setLanguage } = useLocalization();
  return { t, language, setLanguage };
};
