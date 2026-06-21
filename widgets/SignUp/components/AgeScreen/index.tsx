import { useAppSelector } from "@/api/hooks";
import { RootState } from "@/api/store";
import { useFormContext as useMultiStepFormContext } from "@/contexts/FormContext/FormContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { getAge } from "@/services/equation/age";
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
  const { formData } = useMultiStepFormContext<{ age?: string }>();
  const profile = useAppSelector((state: RootState) => state.user.profile);
  const profileAge = getAge(profile?.birthDate);
  const defaultAge =
    formData.age || (profileAge > 0 ? String(profileAge) : "18");

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("signUp.howOldAreYou")}
      </ThemedText>
      <Controller
        control={control}
        name="age"
        render={({ field: { value, onChange } }) => {
          const selectedAge = value || defaultAge;
          const handleAgeChange = (val: WheelItemValue<string>) => {
            onChange(String(val));
          };
          const initialIndex = Math.max(0, parseInt(selectedAge, 10) - 1);

          return (
            <AnimatedWheelPicker
              key={`age-${selectedAge}`}
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
          );
        }}
      />
    </View>
  );
};

export default Age;
