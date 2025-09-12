import React from "react";
import { useForm } from "react-hook-form";
import { Button, Text, View } from "react-native";
import CustomInput from "../ui/common/input/CustomInput";

interface LoginData {
  login: string;
  password: string;
}

const LoginForm = () => {
  const { control, handleSubmit } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 10 }}>
      </Text>

      <CustomInput
        name="login"
        control={control}
        placeholder="Login"
      />

      <CustomInput
        name="password"
        control={control}
        placeholder="Password"
        secureTextEntry
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Login" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

export default LoginForm;
