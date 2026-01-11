import { useRecoveryConfirmMutation, useRecoveryInitMutation } from "@/api";
import { useTranslation } from "@/hooks/useTranslation";
import ErrorModal from "@/shared/Modals/ErrorModal";
import VerificationCodeModal from "@/shared/Modals/VerificationCodeModal";
import View from "@/shared/View";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View as RNView, TouchableOpacity } from "react-native";
import * as yup from "yup";
import Button from "@/shared/Buttons/Button";
import EmailInput from "@/shared/Inputs/EmailInput";
import PasswordInput from "@/shared/Inputs/PasswordInput";
import TextInput from "@/shared/Inputs/TextInput";
import { ThemedText } from "@/shared/ui/ThemedText";

interface RecoveryFormData {
  username: string;
  code: string;
  password: string;
  passwordConfirm: string;
}

const recoveryInitSchema = yup.object({
  username: yup
    .string()
    .required("Email обязателен")
    .email("Введите корректный email адрес"),
});

const recoveryConfirmSchema = yup.object({
  username: yup
    .string()
    .required("Email обязателен")
    .email("Введите корректный email адрес"),
  code: yup
    .string()
    .required("Код восстановления обязателен")
    .length(6, "Код должен содержать 6 символов"),
  password: yup
    .string()
    .required("Пароль обязателен")
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(50, "Пароль должен содержать максимум 50 символов"),
  passwordConfirm: yup
    .string()
    .required("Подтверждение пароля обязательно")
    .oneOf([yup.ref("password")], "Пароли должны совпадать"),
});

const RecoveryScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [recoveryInit] = useRecoveryInitMutation();
  const [recoveryConfirm] = useRecoveryConfirmMutation();
  const [step, setStep] = useState<"init" | "confirm">("init");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");

  const {
    control: initControl,
    handleSubmit: handleInitSubmit,
    formState: { errors: initErrors },
    watch: watchInit,
  } = useForm<{ username: string }>({
    resolver: yupResolver(recoveryInitSchema),
    defaultValues: {
      username: "",
    },
  });

  const {
    control: confirmControl,
    handleSubmit: handleConfirmSubmit,
    formState: { errors: confirmErrors },
  } = useForm<RecoveryFormData>({
    resolver: yupResolver(recoveryConfirmSchema),
    defaultValues: {
      username: "",
      code: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onInitSubmit = async (data: { username: string }) => {
    try {
      await recoveryInit({ username: data.username }).unwrap();
      setEmail(data.username);
      setShowCodeModal(true);
      setStep("confirm");
      // Update confirm form with email
      confirmControl._formValues.username = data.username;
    } catch (error: any) {
      let errorMsg = t("auth.failedToSendCode") || "Не удалось отправить код";
      const status = error?.status;
      const errorData = error?.data;

      if (status === 404) {
        errorMsg = t("auth.userNotFound") || "Пользователь не найден";
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      }

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    }
  };

  const onConfirmSubmit = async (data: RecoveryFormData) => {
    try {
      await recoveryConfirm({
        username: data.username,
        code: data.code,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      }).unwrap();

      // Navigate to login after successful password reset
      router.replace("/(auth)/login");
    } catch (error: any) {
      let errorMsg = t("auth.recoveryFailed") || "Не удалось восстановить пароль";
      const status = error?.status;
      const errorData = error?.data;

      if (status === 401) {
        errorMsg = t("auth.invalidCode") || "Неверный код восстановления";
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      }

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    }
  };

  const getErrorMessage = (field: string, errors: any): string | undefined => {
    const error = errors[field];
    if (error && error.message) {
      return String(error.message);
    }
    return undefined;
  };

  return (
    <View style={styles.container}>
      <RNView style={styles.content}>
        <ThemedText type="subtitle" style={styles.title}>
          {step === "init"
            ? t("auth.recoverPassword") || "Восстановление пароля"
            : t("auth.enterCode") || "Введите код"}
        </ThemedText>

        {step === "init" ? (
          <>
            <ThemedText type="default" style={styles.description}>
              {t("auth.recoveryDescription") ||
                "Введите email, на который будет отправлен код восстановления"}
            </ThemedText>
            <Controller
              control={initControl}
              name="username"
              render={({ field: { value, onChange } }) => (
                <EmailInput
                  placeholder={t("auth.email")}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={getErrorMessage("username", initErrors)}
                />
              )}
            />
            <Button
              title={t("auth.sendCode") || "Отправить код"}
              onPress={handleInitSubmit(onInitSubmit)}
            />
          </>
        ) : (
          <>
            <ThemedText type="default" style={styles.description}>
              {t("auth.codeSentTo")} {email}
            </ThemedText>
            <Controller
              control={confirmControl}
              name="code"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  label={t("auth.verificationCode")}
                  placeholder={t("auth.enterCode")}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={getErrorMessage("code", confirmErrors)}
                  keyboardType="numeric"
                  maxLength={6}
                />
              )}
            />
            <Controller
              control={confirmControl}
              name="password"
              render={({ field: { value, onChange } }) => (
                <PasswordInput
                  value={value}
                  onChangeText={onChange}
                  errorMessage={getErrorMessage("password", confirmErrors)}
                />
              )}
            />
            <Controller
              control={confirmControl}
              name="passwordConfirm"
              render={({ field: { value, onChange } }) => (
                <PasswordInput
                  label={t("auth.confirmPassword") || "Подтвердите пароль"}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={getErrorMessage("passwordConfirm", confirmErrors)}
                />
              )}
            />
            <Button
              title={t("auth.resetPassword") || "Сбросить пароль"}
              onPress={handleConfirmSubmit(onConfirmSubmit)}
            />
            <TouchableOpacity
              onPress={() => setStep("init")}
              style={styles.backButton}
            >
              <ThemedText type="xs" style={styles.backButtonText}>
                {t("common.back")} {t("auth.changeEmail") || "изменить email"}
              </ThemedText>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backToLogin}
        >
          <ThemedText type="xs" style={styles.backToLoginText}>
            {t("common.back")} {t("auth.toLogin") || "к входу"}
          </ThemedText>
        </TouchableOpacity>
      </RNView>

      <VerificationCodeModal
        isVisible={showCodeModal}
        email={email}
        onClose={() => setShowCodeModal(false)}
      />
      <ErrorModal
        isVisible={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "30%",
    paddingHorizontal: 20,
  },
  content: {
    width: "100%",
    gap: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    marginTop: 10,
    alignItems: "center",
  },
  backButtonText: {
    textDecorationLine: "underline",
  },
  backToLogin: {
    marginTop: 20,
    alignItems: "center",
  },
  backToLoginText: {
    textDecorationLine: "underline",
  },
});

export default RecoveryScreen;

