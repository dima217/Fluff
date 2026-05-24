import { AppColors } from "@/constants/design-tokens";
import { CircleSizes } from "@/constants/components/CIrcle";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { getAppLocale } from "@/utils/locale";
import { StyleSheet, Text, View } from "react-native";
import Circle from "../ui/Circle";

function getDayOfWeekLetter(date: Date, locale: string): string {
  return date
    .toLocaleString(locale, { weekday: "narrow" })
    .replace(".", "")
    .charAt(0)
    .toUpperCase();
}

function getStatusColor(
  colors: AppColors,
  status:
    | "cheatMeal"
    | "notTracked"
    | "strongExcess"
    | "insufficientIntake"
    | null
): string {
  switch (status) {
    case "cheatMeal":
      return colors.cheatMeal;
    case "notTracked":
      return colors.notTracked;
    case "strongExcess":
      return colors.strongExcess;
    case "insufficientIntake":
      return colors.insufficientIntake;
    default:
      return colors.green;
  }
}

interface DateItemData {
  isMarked?: boolean;
  isToday: boolean;
  isSelected?: boolean;
  dayStatus?:
    | "cheatMeal"
    | "notTracked"
    | "strongExcess"
    | "insufficientIntake"
    | null;
}

interface DateWheelItemContentProps {
  date?: Date;
  data?: DateItemData;
  size?: number;
  isSelected?: boolean;
}

export function DateWheelItem({ date, data, size }: DateWheelItemContentProps) {
  const colors = useColors();
  const styles = useThemedStyles(createDateWheelItemStyles);
  const { language } = useTranslation();

  if (!date || !data) return null;

  const { isToday, isSelected, dayStatus } = data;
  const dayOfWeekLetter = getDayOfWeekLetter(date, getAppLocale(language));
  const shouldShowCircle = isSelected || isToday;
  const circleColor = shouldShowCircle
    ? getStatusColor(colors, dayStatus || null)
    : colors.green;

  const toggleStyle = [
    styles.toggleBase,
    (isSelected || isToday) && styles.toggleActive,
    !isSelected && !isToday && styles.toggleInactive,
  ];

  return (
    <View style={[styles.container, { width: size }]}>
      <View style={styles.topMarker}>
        <Text style={styles.dayOfWeekText}>{dayOfWeekLetter}</Text>
      </View>

      <View style={styles.toggleContainer}>
        <View style={toggleStyle}>
          {shouldShowCircle && (
            <Circle size={CircleSizes.XS} color={circleColor} />
          )}
        </View>
      </View>
    </View>
  );
}

const createDateWheelItemStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: 10,
    },
    topMarker: {
      height: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    dayOfWeekText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "500",
    },
    toggleContainer: {
      width: "80%",
      paddingVertical: 10,
      backgroundColor: colors.inactive,
      justifyContent: "flex-start",
      borderRadius: 30,
      height: 100,
      alignItems: "center",
    },
    toggleBase: {
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    toggleInactive: {
      backgroundColor: colors.overlaySubtle,
      borderWidth: 1,
      borderColor: colors.overlayMedium,
    },
    toggleActive: {
      backgroundColor: colors.text,
    },
  });
