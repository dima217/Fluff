import { useLoginMutation } from "@/api";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "expo-router";
import WelcomeModal from "@/shared/Modals/WelcomeModal";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../Buttons/Button";
import EmailInput from "../Inputs/EmailInput";
import PasswordInput from "../Inputs/PasswordInput";

interface LoginData {
  username: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const onSubmit = async () => {
    if (!formData.username || !formData.password) {
      return;
    }

    try {
      await login({
        username: formData.username,
        password: formData.password,
      }).unwrap();
      setShowWelcomeModal(true);
    } catch {
      // Ошибка обрабатывается автоматически через RTK Query
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    router.replace("/(app)/home");
  };

  return (
    <View style={styles.container}>
      <EmailInput
        placeholder={t("common.enter")}
        value={formData.username}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, username: text }))
        }
      />
      <PasswordInput
        value={formData.password}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, password: text }))
        }
      />
      <Button
        title={t("auth.login")}
        onPress={onSubmit}
        disabled={isLoading}
      />
      <WelcomeModal
        isVisible={showWelcomeModal}
        onClose={handleWelcomeClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginForm;
