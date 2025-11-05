import LoginForm from "@/components/forms/LoginForm";
import CustomButton from "@/components/ui/common/button/CustomButtom";
import { Colors } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";
import Fluff from "../../assets/images/Fluff.svg";

const Login = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Fluff />
        <LoginForm />
      </View>
      <View style={styles.innerContainer}>
        <CustomButton title="Continue with" onPress={() => {}} />
        <CustomButton title="Continue with" onPress={() => {}} />
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
  innerContainer: {
    marginBottom: 90,
    width: "100%",
    alignItems: "center",
  },
});
