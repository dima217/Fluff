import { useTranslation } from "@/hooks/useTranslation";
import TextInput from "@/shared/Inputs/TextInput";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const CodeScreen = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const { t } = useTranslation();
  const email = watch("email");

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
        {t("auth.verificationCode")}
      </ThemedText>
      <ThemedText type="xs" style={styles.subtitle}>
        {t("auth.codeSentTo")} {email}
      </ThemedText>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="code"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label={t("auth.verificationCode")}
              placeholder={t("auth.enterCode")}
              value={value}
              errorMessage={getErrorMessage("code")}
              onChangeText={onChange}
              keyboardType="numeric"
              maxLength={6}
              autoFocus
            />
          )}
        />
      </View>
    </View>
  );
};

export default CodeScreen;

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    gap: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.7,
  },
  inputWrapper: {
    width: "100%",
  },
});

