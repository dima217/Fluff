import { useTranslation } from "@/hooks/useTranslation";
import SexPicker from "@/shared/ui/SexPicker";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

type Gender = "male" | "female" | null;

const Sex = () => {
  const { control } = useFormContext();
  const { t } = useTranslation();

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle">{t("signUp.iAm")}</ThemedText>
      <Controller
        control={control}
        name="sex"
        render={({ field: { value, onChange } }) => (
          <SexPicker
            selectedSex={value as Gender}
            onSelect={(sex) => onChange(sex)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    paddingTop: 80,

    flex: 1,
    gap: "8%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default Sex;
