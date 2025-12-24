import { Colors } from "@/constants/design-tokens";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../ThemedText";

const { width: screenWidth } = Dimensions.get("window");

const calculatedWidth = screenWidth * 0.425;

type Gender = "male" | "female" | null;

interface SexOptionProps {
  label: string;
  iconName: "male" | "female";
  value: Gender;
  isSelected: boolean;
  onPress: (value: Gender) => void;
}

const gradientColors = Colors.gradient;
const ICON_SIZE = 90;
const ACTIVE_COLOR = Colors.primary;
const INACTIVE_COLOR = "#666";

const SexOption: React.FC<SexOptionProps> = ({
  label,
  iconName,
  value,
  isSelected,
  onPress,
}) => {
  const iconColor = isSelected ? ACTIVE_COLOR : INACTIVE_COLOR;

  const pickerStyle = isSelected ? styles.pickerActive : styles.pickerInactive;

  return (
    <View style={[styles.pickerContainer]}>
      <View style={[styles.innerPickerContainer, pickerStyle]}>
        <TouchableOpacity
          onPress={() => onPress(value)}
          activeOpacity={0.8}
          style={styles.touchable}
        >
          <View style={[styles.picker]}>
            <LinearGradient
              colors={gradientColors}
              style={styles.gradientContainer}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            >
              <MaterialIcons
                name={iconName}
                size={ICON_SIZE}
                color={iconColor}
              />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
      <ThemedText
        style={[styles.label, { color: isSelected ? ACTIVE_COLOR : "white" }]}
      >
        {label}
      </ThemedText>
    </View>
  );
};

export default SexOption;

const styles = StyleSheet.create({
  pickerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: calculatedWidth,
    height: calculatedWidth,
    borderRadius: 15,
    gap: 10,
  },
  innerPickerContainer: {
    width: calculatedWidth,
    height: "100%",
    justifyContent: "center",
    borderRadius: 15,
  },
  touchable: {
    flexDirection: "row",
    height: "100%",
    flex: 1,
  },
  picker: {
    display: "flex",
    flex: 1,
  },
  pickerActive: {
    padding: 10,
    borderWidth: 2,
    borderColor: ACTIVE_COLOR,
  },
  pickerInactive: {},
  gradientContainer: {
    flex: 1,
    height: "100%",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});
