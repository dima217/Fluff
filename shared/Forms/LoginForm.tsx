import { useLoginMutation } from "@/api";
import { useTranslation } from "@/hooks/useTranslation";
import ErrorModal from "@/shared/Modals/ErrorModal";
import WelcomeModal from "@/shared/Modals/WelcomeModal";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import * as yup from "yup";
import Button from "../Buttons/Button";
import EmailInput from "../Inputs/EmailInput";
import PasswordInput from "../Inputs/PasswordInput";

interface LoginFormData {
  username: string;
  password: string;
}

const loginSchema = yup.object({
  username: yup
    .string()
    .required("Email обязателен")
    .email("Введите корректный email адрес"),
  password: yup
    .string()
    .required("Пароль обязателен")
    .min(10, "Пароль должен содержать минимум 10 символов")
    .max(15, "Пароль должен содержать максимум 15 символов"),
});

const LoginForm = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        username: data.username,
        password: data.password,
      }).unwrap();
      setShowWelcomeModal(true);
    } catch (error: any) {
      let errorMsg = t("auth.loginFailed") || "Не удалось войти в систему";

      const status = error?.status;
      const errorData = error?.data;

      if (status === 401) {
        errorMsg = t("auth.invalidCredentials") || "Неверный email или пароль";
      } else if (status === 404) {
        errorMsg = t("auth.userNotFound") || "Пользователь не найден";
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      }

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    router.replace("/(app)/home");
  };

  const getErrorMessage = (field: keyof LoginFormData): string | undefined => {
    const error = errors[field];
    if (error && error.message) {
      return String(error.message);
    }
    return undefined;
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="username"
        render={({ field: { value, onChange } }) => (
          <EmailInput
            placeholder={t("common.enter")}
            value={value}
            onChangeText={onChange}
            errorMessage={getErrorMessage("username")}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange } }) => (
          <PasswordInput
            value={value}
            onChangeText={onChange}
            errorMessage={getErrorMessage("password")}
          />
        )}
      />
      <Button
        title={t("auth.login")}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        loading={isLoading}
      />
      <WelcomeModal isVisible={showWelcomeModal} onClose={handleWelcomeClose} />
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
    width: "100%",
    display: "flex",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginForm;
