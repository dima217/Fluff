import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import GradientView from "@/shared/ui/GradientView";
import PatternBackground from "@/shared/ui/PatternBackground";
import RadialGradientBackground from "@/shared/ui/RadialGradientBackground";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, View } from "react-native";

interface PersonalCalculatedIntakeCardProps {
  calories: number | null;
  onRecalculate: () => void;
  onUseAsDailyIntake: () => void;
  isApplying?: boolean;
  useAsDailyIntakeDisabled?: boolean;
}

const PersonalCalculatedIntakeCard = ({
  calories,
  onRecalculate,
  onUseAsDailyIntake,
  isApplying = false,
  useAsDailyIntakeDisabled = false,
}: PersonalCalculatedIntakeCardProps) => {
  const { t } = useTranslation();
  const canUse = calories != null && calories > 0;

  return (
    <GradientView style={styles.container}>
      <PatternBackground style={styles.patternContainer} />
      <RadialGradientBackground style={styles.radialContainer} />

      <ThemedText type="s">{t("profile.personalCalculatedIntake")}</ThemedText>

      <View style={styles.caloriesRow}>
        <ThemedText type="display" color="text" style={styles.caloriesValue}>
          {canUse ? calories : "—"}
        </ThemedText>
        {canUse ? (
          <ThemedText type="body" style={styles.caloriesUnit}>
            {t("health.caloriesUnit").toUpperCase()}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button
          title={t("profile.recalculate")}
          onPress={onRecalculate}
          numberOfLines={2}
          style={styles.actionButton}
          textStyle={styles.buttonText}
        />
        <Button
          title={t("profile.useAsDailyIntake")}
          onPress={onUseAsDailyIntake}
          disabled={!canUse || isApplying || useAsDailyIntakeDisabled}
          loading={isApplying}
          numberOfLines={2}
          buttonColor="transparent"
          textColor="#FFFFFF"
          style={styles.outlineButton}
          textStyle={styles.buttonText}
        />
      </View>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 180,
    padding: 20,
    marginTop: 20,
    borderRadius: 20,
    gap: 22,
  },
  radialContainer: {
    borderRadius: 20,
    ...StyleSheet.absoluteFillObject,
  },
  patternContainer: {
    borderRadius: 20,
    height: 100,
    ...StyleSheet.absoluteFillObject,
  },
  caloriesRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  caloriesValue: {
    includeFontPadding: false,
  },
  caloriesUnit: {
    includeFontPadding: false,
    lineHeight: 16,
  },
  actions: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  buttonText: {
    fontSize: 12,
  },
});

export default PersonalCalculatedIntakeCard;
