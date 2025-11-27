import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Button from "../Buttons/Button";
import EmailInput from "../Inputs/EmailInput";

interface LoginData {
  login: string;
  password: string;
}

const LoginForm = () => {
  const { handleSubmit } = useForm<LoginData>();
  const router = useRouter();

  const onSubmit = (data: LoginData) => {
    router.replace("/(app)/home");
  };

  return (
    <View style={styles.container}>
      <EmailInput placeholder="Enter" />
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
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
