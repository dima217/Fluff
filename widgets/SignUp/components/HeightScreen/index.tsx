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
  const { formData } = useMultiStepFormContext<{ height?: string }>();
  const profile = useAppSelector((state: RootState) => state.user.profile);
  const defaultHeight =
    formData.height ||
    (profile?.height != null ? String(Math.round(profile.height)) : "170");

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("signUp.whatsYourHeight")}
      </ThemedText>
      <Controller
        control={control}
        name="height"
        render={({ field: { value, onChange } }) => {
          const selectedHeight = value || defaultHeight;
          const handleHeightChange = (val: WheelItemValue<string>) => {
            onChange(String(val));
          };
          const initialIndex = Math.max(0, parseInt(selectedHeight, 10) - 100);

          return (
            <AnimatedWheelPicker
              key={`height-${selectedHeight}`}
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
          );
        }}
      />
    </View>
  );
};

export default Height;
