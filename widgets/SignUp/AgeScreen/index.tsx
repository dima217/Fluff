import { useTranslation } from "@/hooks/useTranslation";
import {
  AnimatedWheelPicker,
  WheelItemData,
  WheelItemValue,
} from "@/shared/AnimatedWheelPicker";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const agesData: WheelItemData<string>[] = Array.from(
  { length: 100 },
  (_, i) => {
    const ageValue = (i + 1).toString();
    return {
      key: ageValue,
      value: ageValue,
      content: "",
      dataForContent: {},
    };
  }
);

const Age = () => {
  const { control } = useFormContext();
  const { t } = useTranslation();

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("signUp.howOldAreYou")}
      </ThemedText>
      <Controller
        control={control}
        name="age"
        render={({ field: { value, onChange } }) => {
          const selectedAge = value || "18";
          const handleAgeChange = (val: WheelItemValue<string>) => {
            onChange(String(val));
          };
          const initialIndex = parseInt(selectedAge, 10) - 1;

          return (
            <>
              <ThemedText style={styles.currentAgeText}>
                {t("signUp.selected")}: {selectedAge}
              </ThemedText>
              <AnimatedWheelPicker
                data={agesData}
                itemSize={56}
                visibleCount={3}
                orientation="vertical"
                initialIndex={initialIndex}
                onValueChange={handleAgeChange}
                containerStyle={styles.animatedWheelPicker}
                animationType="lens"
                selectStyle={styles.selectorContainer}
              />
            </>
          );
        }}
      />
    </View>
  );
};

export default Age;

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
  currentAgeText: {
    fontSize: 16,
    color: "#aaa",
  },
});
