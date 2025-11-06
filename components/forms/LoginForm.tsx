import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Button from "../Button";
import EmailInput from "../EmailInput";

interface LoginData {
  login: string;
  password: string;
}

const LoginForm = () => {
  const { control, handleSubmit } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {};

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
