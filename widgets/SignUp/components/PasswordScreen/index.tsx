import { useTranslation } from "@/hooks/useTranslation";
import PasswordInput from "@/shared/Inputs/PasswordInput";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const PasswordScreen = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();

  const getErrorMessage = (field: string): string | undefined => {
    const error = errors[field];
    if (error && error.message) {
      return String(error.message);
    }
    return undefined;
  };

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        {t("auth.createPassword")}
      </ThemedText>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <PasswordInput
              value={value}
              errorMessage={getErrorMessage("password")}
              onChangeText={onChange}
              placeholder={t("auth.passwordPlaceholder")}
            />
          )}
        />
      </View>
    </View>
  );
};

export default PasswordScreen;

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    gap: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
  },
  title: {
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
  },
});

