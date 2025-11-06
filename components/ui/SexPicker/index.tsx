import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { styles } from "./styles";

const gradientColors = Colors.gradient;

const SexPicker = () => {
  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <View style={styles.picker}>
          <LinearGradient
            colors={gradientColors}
            style={[styles.gradientContainer]}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 0.5, y: 1 }}
          >
            <MaterialIcons name="male" size={90} color={Colors.primary} />
          </LinearGradient>
        </View>
        <ThemedText>Male</ThemedText>
      </View>
      <View style={styles.pickerContainer}>
        <View style={styles.picker}>
          <LinearGradient
            colors={gradientColors}
            style={[styles.gradientContainer]}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 0.5, y: 1 }}
          >
            <MaterialIcons name="female" size={90} color={Colors.primary} />
          </LinearGradient>
        </View>
        <ThemedText>M</ThemedText>
      </View>
    </View>
  );
};

export default SexPicker;
