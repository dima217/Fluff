import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import {
  AnimatedWheelPicker,
  WheelItemData,
} from "@/shared/AnimatedWheelPicker";
import TransparentButton from "@/shared/Buttons/TransparentButton";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();

const today = now.getDate();
const daysInMonth = new Date(year, month + 1, 0).getDate();

const cheatMealDaysData: WheelItemData<string>[] = Array.from(
  { length: daysInMonth - today + 1 },
  (_, i) => {
    const dayValue = (today + i).toString();
    return {
      key: dayValue,
      value: dayValue,
      content: "",
      dataForContent: {},
    };
  }
);

const periodDaysData: WheelItemData<string>[] = Array.from(
  { length: daysInMonth - 7 + 1 },
  (_, i) => {
    const dayValue = (7 + i).toString();
    return {
      key: dayValue,
      value: dayValue,
      content: "",
      dataForContent: {},
    };
  }
);

const CheatMealDay = () => {
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      stepContainer: {
        flex: 1,
        gap: 20,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 80,
      },
      title: {
        marginBottom: 8,
        textAlign: "center",
      },
      description: {
        textAlign: "center",
        color: c.secondary,
        marginBottom: 20,
        paddingHorizontal: 4,
        lineHeight: 22,
      },
      pickersContainer: {
        width: "100%",
        alignItems: "center",
        gap: 28,
      },
      pickerSection: {
        width: "100%",
        alignItems: "center",
        gap: 12,
      },
      pickerLabel: {
        textAlign: "center",
        color: c.secondary,
        fontSize: 14,
        lineHeight: 20,
        paddingHorizontal: 8,
      },
      animatedWheelPicker: { width: "60%" },
      selectorContainer: { height: 56 },
    })
  );
  const { control } = useFormContext();
  const { t } = useTranslation();

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("signUp.cheatMealDay")}
      </ThemedText>

      <ThemedText type="xs" style={styles.description}>
        {t("signUp.cheatMealDayDescription")}
      </ThemedText>

      <View style={styles.pickersContainer}>
        <Controller
          control={control}
          name="cheatMealDay"
          render={({ field: { value, onChange } }) => {
            const selectedDay = Number(value || today);
            const initialIndex = selectedDay - today;

            return (
              <View style={styles.pickerSection}>
                <ThemedText style={styles.pickerLabel}>
                  {t("signUp.cheatMealDayStartLabel")}
                </ThemedText>
                <AnimatedWheelPicker
                  data={cheatMealDaysData}
                  itemSize={56}
                  visibleCount={3}
                  orientation="vertical"
                  initialIndex={initialIndex}
                  onValueChange={(val) => onChange(String(val))}
                  containerStyle={styles.animatedWheelPicker}
                  animationType="lens"
                  selectStyle={styles.selectorContainer}
                />
              </View>
            );
          }}
        />

        <Controller
          control={control}
          name="periodOfDays"
          render={({ field: { value, onChange } }) => {
            const selectedPeriod = Number(value || 14);
            const initialIndex = selectedPeriod - 7;

            return (
              <View style={styles.pickerSection}>
                <ThemedText style={styles.pickerLabel}>
                  {t("signUp.cheatMealPeriodLabel")}
                </ThemedText>
                <AnimatedWheelPicker
                  data={periodDaysData}
                  itemSize={56}
                  visibleCount={3}
                  orientation="vertical"
                  initialIndex={initialIndex}
                  onValueChange={(val) => onChange(String(val))}
                  containerStyle={styles.animatedWheelPicker}
                  animationType="lens"
                  selectStyle={styles.selectorContainer}
                />
              </View>
            );
          }}
        />
      </View>

      <TransparentButton title={t("signUp.skip")} onPress={() => {}} />
    </View>
  );
};

export default CheatMealDay;
