import { useAppSelector } from "@/api/hooks";
import { RootState } from "@/api/store";
import { useFormContext as useMultiStepFormContext } from "@/contexts/FormContext/FormContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  AnimatedWheelPicker,
  WheelItemData,
  WheelItemValue,
} from "@/shared/AnimatedWheelPicker";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const weightsData: WheelItemData<string>[] = Array.from(
  { length: 121 },
  (_, i) => {
    const weightValue = (i + 30).toString();
    return {
      key: weightValue,
      value: weightValue,
      content: "",
      dataForContent: {},
    };
  }
);

const Weight = () => {
  const styles = useThemedStyles(() =>
    StyleSheet.create({
      stepContainer: {
        flex: 1,
        gap: 30,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 80,
      },
      animatedWheelPicker: { width: "60%" },
      selectorContainer: { height: 56 },
      title: { marginBottom: 20 },
    })
  );
  const { control } = useFormContext();
  const { t } = useTranslation();
  const { formData } = useMultiStepFormContext<{ weight?: string }>();
  const profile = useAppSelector((state: RootState) => state.user.profile);
  const defaultWeight =
    formData.weight ||
    (profile?.weight != null ? String(Math.round(profile.weight)) : "70");

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("signUp.whatsYourWeight")}
      </ThemedText>
      <Controller
        control={control}
        name="weight"
        render={({ field: { value, onChange } }) => {
          const selectedWeight = value || defaultWeight;
          const handleWeightChange = (val: WheelItemValue<string>) => {
            onChange(String(val));
          };
          const initialIndex = Math.max(0, parseInt(selectedWeight, 10) - 30);

          return (
            <AnimatedWheelPicker
              key={`weight-${selectedWeight}`}
              data={weightsData}
              itemSize={56}
              visibleCount={3}
              orientation="vertical"
              initialIndex={initialIndex}
              onValueChange={handleWeightChange}
              containerStyle={styles.animatedWheelPicker}
              animationType="lens"
              selectStyle={styles.selectorContainer}
            />
          );
        }}
      />
    </View>
  );
};

export default Weight;
