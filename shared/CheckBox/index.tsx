import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { StyleSheet } from "react-native";
import { CheckBox as RNCheckBox } from "react-native-elements";
import { useColors } from "@/contexts/ThemeContext";

interface CheckBoxProps {
  title: string;
  checked: boolean | null;
  setChecked: (checked: boolean | null) => void;
  size?: number;
  allowNull?: boolean;
}

const CheckBox = ({
  title,
  checked,
  setChecked,
  size = 24,
  allowNull = false,
}: CheckBoxProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createCheckBoxStyles);
  const isChecked = allowNull ? checked === false : checked === true;

  const handlePress = () => {
    if (!allowNull) {
      setChecked(!checked);
    } else {
      if (checked === true) {
        setChecked(false);
      } else if (checked === false) {
        setChecked(null);
      } else {
        setChecked(false);
      }
    }
  };

  return (
    <RNCheckBox
      title={title}
      checked={isChecked}
      checkedIcon="dot-circle-o"
      uncheckedIcon="circle-o"
      onPress={handlePress}
      containerStyle={styles.checkboxContainer}
      textStyle={styles.checkboxText}
      checkedColor={colors.primary}
      uncheckedColor={colors.border}
      size={size}
    />
  );
};

const createCheckBoxStyles = (colors: AppColors) =>
  StyleSheet.create({
    checkboxContainer: {
      backgroundColor: "transparent",
      marginLeft: 0,
      borderWidth: 0,
      padding: 0,
      margin: 0,
    },
    checkboxText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.secondary,
    },
  });

export default CheckBox;
