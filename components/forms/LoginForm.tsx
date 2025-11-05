import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../ui/common/button/CustomButtom";
import CustomInput from "../ui/common/input/CustomInput";

interface LoginData {
  login: string;
  password: string;
}

const LoginForm = () => {
  const { control, handleSubmit } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {};

  return (
    <View style={styles.container}>
      <Text
        style={{ fontSize: 22, fontWeight: "600", marginBottom: 10 }}
      ></Text>

      <CustomInput name="login" control={control} placeholder="Enter" />
      <CustomButton title="Login" onPress={handleSubmit(onSubmit)} />
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
