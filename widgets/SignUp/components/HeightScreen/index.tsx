import { useTranslation } from "@/hooks/useTranslation";
import {
  AnimatedWheelPicker,
  WheelItemData,
  WheelItemValue,
} from "@/shared/AnimatedWheelPicker";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const heightsData: WheelItemData<string>[] = Array.from(
  { length: 121 },
  (_, i) => {
    const heightValue = (i + 100).toString();
    return {
      key: heightValue,
      value: heightValue,
      content: "",
      dataForContent: {},
    };
  }
);

const Height = () => {
  const { control } = useFormContext();
  const { t } = useTranslation();

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("signUp.whatsYourHeight")}
      </ThemedText>
      <Controller
        control={control}
        name="height"
        render={({ field: { value, onChange } }) => {
          const selectedHeight = value || "170";
          const handleHeightChange = (val: WheelItemValue<string>) => {
            onChange(String(val));
          };
          const initialIndex = parseInt(selectedHeight, 10) - 100;

          return (
            <>
              <ThemedText style={styles.currentValueText}>
                {t("signUp.selected")}: {selectedHeight} cm
              </ThemedText>
              <AnimatedWheelPicker
                data={heightsData}
                itemSize={56}
                visibleCount={3}
                orientation="vertical"
                initialIndex={initialIndex}
                onValueChange={handleHeightChange}
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

export default Height;

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
