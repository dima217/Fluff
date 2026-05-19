import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { memo } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { createToggleStyles } from "./styles";

type Props = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
};

const ToggleButtons = ({
  options,
  selected,
  onSelect,
  style,
  containerStyle,
}: Props) => {
  const colors = useColors();
  const styles = useThemedStyles(createToggleStyles);

  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => {
        const isActive = selected === option;

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.button,
              {
                backgroundColor: isActive ? colors.purple : colors.inactive,
              },
              style,
            ]}
            onPress={() => onSelect(option)}
            activeOpacity={0.8}
          >
            <ThemedText
              style={{ color: isActive ? colors.onPrimary : colors.secondary }}
              type="xs"
            >
              {option}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default memo(ToggleButtons);
