import { useTranslation } from "@/hooks/useTranslation";
import TextInput from "@/shared/Inputs/TextInput";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const NameScreen = () => {
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
        {t("auth.yourName")}
      </ThemedText>
      <View style={styles.inputsWrapper}>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label={t("auth.firstName")}
              placeholder={t("auth.firstNamePlaceholder")}
              value={value}
              errorMessage={getErrorMessage("firstName")}
              onChangeText={onChange}
              autoCapitalize="words"
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label={t("auth.lastName")}
              placeholder={t("auth.lastNamePlaceholder")}
              value={value}
              errorMessage={getErrorMessage("lastName")}
              onChangeText={onChange}
              autoCapitalize="words"
            />
          )}
        />
      </View>
    </View>
  );
};

export default NameScreen;

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
  inputsWrapper: {
    width: "100%",
    gap: 20,
  },
});

