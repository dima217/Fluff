import { useTranslation } from "@/hooks/useTranslation";
import EmailInput from "@/shared/Inputs/EmailInput";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const EmailScreen = () => {
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
        {t("auth.email")}
      </ThemedText>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <EmailInput
              value={value}
              errorMessage={getErrorMessage("email")}
              onChangeText={onChange}
            />
          )}
        />
      </View>
    </View>
  );
};

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

export default EmailScreen;
