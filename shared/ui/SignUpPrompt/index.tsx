import { Colors } from "@/constants/Colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SignUpPromptProps {
  onPressSignUp: () => void;
}

const SignUpPrompt: React.FC<SignUpPromptProps> = ({ onPressSignUp }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.baseText}>Don't have an account? </Text>
      <Pressable onPress={onPressSignUp} style={{ padding: 0 }}>
        <Text style={styles.highlightText}>Sign Up</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
  },
  baseText: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: "200",
  },
  highlightText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "300",
    paddingHorizontal: 2,
  },
});

export default SignUpPrompt;
