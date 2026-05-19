import { useColors } from "@/contexts/ThemeContext";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { CircleSizes } from "@/constants/components/CIrcle";

import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ProfileSectionProps {
  icon: ReactNode;
  title: string;
  onPress: () => void;
  isNested: boolean;
  isLast: boolean;
}

const ProfileSection = ({
  icon,
  title,
  onPress,
  isNested,
  isLast,
}: ProfileSectionProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createstyles);
  return (
    <TouchableOpacity
      style={[styles.container, !isLast ? styles.itemBorder : ""]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <GradientView style={styles.iconGradientContainer}>
            {icon}
          </GradientView>
        </View>
        <ThemedText>{title}</ThemedText>
      </View>
      {isNested && (
        <Ionicons name="arrow-forward" size={24} color={colors.border} />
      )}
    </TouchableOpacity>
  );
};

const createstyles = (colors: AppColors) => StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: 85,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: CircleSizes.MEDIUM,
    height: CircleSizes.MEDIUM,
  },
  iconGradientContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: CircleSizes.MEDIUM / 2,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderColor: colors.inactive,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default ProfileSection;
