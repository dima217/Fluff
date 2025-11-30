import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/shared/ui/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

const MediaPlaceholder: React.FC = () => {
  return (
    <View style={styles.placeholder}>
      <MaterialCommunityIcons
        name="image-plus"
        size={54}
        color="#d9d9d9"
        style={styles.icon}
      />

      <View style={styles.button}>
        <ThemedText type="mini">Add a Photo</ThemedText>
      </View>

      <ThemedText type="xs">PNG, JPG up to 100MB</ThemedText>
    </View>
  );
};

export default MediaPlaceholder;

const styles = StyleSheet.create({
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 18,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  infoText: {
    color: "#d9d9d9",
    fontSize: 14,
  },
});
