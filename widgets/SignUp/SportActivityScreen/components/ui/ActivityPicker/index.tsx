import { Colors } from "@/constants/design-tokens";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const calculatedWidth = screenWidth * 0.35;

interface ActivityPickerProps {
  isSelected: boolean;
  label: string;
  trainingCount: string;
  description: string;
  onPress: () => void;
}

const ACTIVE_COLOR = Colors.primary;

const ActivityPicker: React.FC<ActivityPickerProps> = ({
  isSelected,
  onPress,
  label,
  trainingCount,
  description,
}) => {
  const pickerStyle = isSelected ? styles.pickerActive : styles.pickerInactive;

  return (
    <View style={[styles.pickerContainer]}>
      <View style={[styles.innerPickerContainer, pickerStyle]}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={styles.touchable}
        >
        <GradientView style={styles.gradientContainer}>
            <ThemedText style={styles.label}>{label}</ThemedText>
            <View style={styles.trainingCountContainer}>
            <ThemedText highlightLastWord type="xs">{`Training count: ${trainingCount}`}</ThemedText>
            <ThemedText type="xs">{description}</ThemedText>
            </View>
        </GradientView>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActivityPicker;

const styles = StyleSheet.create({
  pickerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: calculatedWidth,
  },
  innerPickerContainer: {
    width: "100%",
    height: "100%",
  },
  touchable: {
    flexDirection: "row",
    height: "100%",
    flex: 1,
  },
  pickerActive: {
    padding: 6,
    borderWidth: 2,
    borderColor: ACTIVE_COLOR,
    borderRadius: 15,
    // Надо чтобы прямоугольник был без лишних темных углов
    backgroundColor: Colors.background,
    // iOS — цветное свечение
    shadowColor: ACTIVE_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 20,
  },
  pickerInactive: {},
  gradientContainer: {
    flex: 1,
    height: "100%",
    gap: 10,
    borderRadius: 15,
    padding: 10,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: "600",
  },
  trainingCountContainer: {
    gap: 4,
  },
});
