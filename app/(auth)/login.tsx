import LoginForm from "@/components/Forms/LoginForm";
import GradientButton from "@/components/GradientButton";
import SignUpPrompt from "@/components/ui/SignUpPrompt";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Fluff from "../../assets/images/Fluff.svg";

const router = useRouter();

const Login = () => {
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
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 90,
    width: "100%",
    alignItems: "center",
  },
});
