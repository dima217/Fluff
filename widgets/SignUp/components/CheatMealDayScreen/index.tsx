import { useTranslation } from "@/hooks/useTranslation";
import {
  AnimatedWheelPicker,
  WheelItemData
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
  const { control, formState: { errors } } = useFormContext();
  const { t } = useTranslation();

  console.log(errors);

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("signUp.cheatMealDay")}
      </ThemedText>
      <Controller
        control={control}
        name="cheatMealDay"
        render={({ field: { value, onChange } }) => {
          const selectedDay = Number(value || today);
          
          const initialIndex = selectedDay - today;

          return (
            <>
              <ThemedText style={styles.currentValueText}>
                {t("signUp.selected")}: {selectedDay} day
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
            </>
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
            <>
              <ThemedText style={styles.currentValueText}>
                {t("signUp.periodOfDays")}
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
            </>
          );
        }}
      />
      <TransparentButton title="Skip" onPress={() => {}} />
    </View>
  );
};

export default CheatMealDay;

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    gap: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
  },
  animatedWheelPicker: {
    width: "60%",
  },
  selectorContainer: {
    height: 56,
  },
  title: {
    marginBottom: 20,
  },
  currentValueText: {
    fontSize: 16,
    color: "#aaa",
  },
});
