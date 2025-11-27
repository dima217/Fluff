import { Colors } from "@/constants/Colors";
import GradientButton from "@/shared/Buttons/GradientButton";
import LoginForm from "@/shared/Forms/LoginForm";
import SignUpPrompt from "@/shared/ui/SignUpPrompt";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Fluff from "../../assets/images/Fluff.svg";

const Login = () => {
  const router = useRouter();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Fluff />
          <ThemedText>Login</ThemedText>
        </View>
        <LoginForm />
      </View>
      <View style={styles.innerContainer}>
        <GradientButton title="Continue with" onPress={() => {}} />
        <GradientButton title="Continue with" onPress={() => {}} />
        <SignUpPrompt
          onPressSignUp={() => {
            router.navigate("/(auth)/register");
          }}
        />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
    alignItems: "center",
  },
  container: {
    width: "90%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
    marginBottom: 80,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: "15%",
    width: "90%",
    alignItems: "center",
  },
});
