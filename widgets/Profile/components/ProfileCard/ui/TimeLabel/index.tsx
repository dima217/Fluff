
import { useColors } from "@/contexts/ThemeContext";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/ui/ThemedText";
import { getAppLocale } from "@/utils/locale";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface TimeLabelProps {
  localText?: string;
}

const TimeLabel = ({ localText }: TimeLabelProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createstyles);
  const { t, language } = useTranslation();
  const locale = getAppLocale(language);
  const label = localText ?? t("profile.localTime");
  const [time, setTime] = useState(() => formatCurrentTime(locale));

  useEffect(() => {
    setTime(formatCurrentTime(locale));

    const interval = setInterval(() => {
      setTime(formatCurrentTime(locale));
    }, 60000);

    return () => clearInterval(interval);
  }, [locale]);

  return (
    <View style={styles.container}>
      <Ionicons
        name="time-outline"
        size={12}
        color={colors.iconMuted}
        style={styles.icon}
      />
      <ThemedText type="xs">{`${time}, ${label}`}</ThemedText>
    </View>
  );
};

function formatCurrentTime(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

const createstyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 6,
  },
});

export default TimeLabel;
