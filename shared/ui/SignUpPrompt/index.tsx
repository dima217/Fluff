import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SignUpPromptProps {
  onPressSignUp: () => void;
}

const SignUpPrompt: React.FC<SignUpPromptProps> = ({ onPressSignUp }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.baseText}>{t("auth.dontHaveAccount")} </Text>
      <Pressable onPress={onPressSignUp} style={{ padding: 0 }}>
        <Text style={styles.highlightText}>{t("auth.signUp")}</Text>
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
