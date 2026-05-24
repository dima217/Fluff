import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { StyleSheet, View } from "react-native";
import Marker from "../Marker";

const MarkerContainer = () => {
  const colors = useColors();
  const styles = useThemedStyles(createMarkerContainerStyles);
  const { t } = useTranslation();

  const markerData = [
    { text: t("health.markers.cheatMeal"), color: colors.cheatMeal },
    { text: t("health.markers.notTracked"), color: colors.notTracked },
    { text: t("health.markers.strongExcess"), color: colors.strongExcess },
    {
      text: t("health.markers.insufficientIntake"),
      color: colors.insufficientIntake,
    },
  ];

  const firstRow = markerData.slice(0, 2);
  const secondRow = markerData.slice(2, 4);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {firstRow.map((item, index) => (
          <View key={item.text + index} style={styles.markerColumn}>
            <Marker text={item.text} color={item.color} />
            <Marker
              text={secondRow[index]?.text || ""}
              color={secondRow[index]?.color}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default MarkerContainer;

const createMarkerContainerStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "column",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      gap: 24,
    },
    markerColumn: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      alignItems: "flex-start",
    },
  });
