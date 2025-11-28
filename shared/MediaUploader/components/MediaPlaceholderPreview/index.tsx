import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
        <Text style={styles.buttonText}>Добавить медиа</Text>
      </View>

      <Text style={styles.infoText}>Фото или видео до 100MB</Text>
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
    backgroundColor: "#e91e63",
    paddingVertical: 12,
    paddingHorizontal: 32,
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
