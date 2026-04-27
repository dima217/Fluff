import { Colors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";
import { CheckBox as RNCheckBox } from "react-native-elements";

interface CheckBoxProps {
    title: string;
    checked: boolean;
    setChecked: (checked: boolean) => void;
    size?: number;
}

const CheckBox = ({title, checked, setChecked, size = 24}: CheckBoxProps) => {
    return (
        <RNCheckBox
            title={title}
            checked={checked}
            checkedIcon="dot-circle-o"  
            uncheckedIcon="circle-o"   
            onPress={() => setChecked(!checked)}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            checkedColor={Colors.primary}
            uncheckedColor="#D1D1D1" 
            size={size} 
        />   
    )
}

const styles = StyleSheet.create({
    checkboxContainer: {
      backgroundColor: 'transparent',
      marginLeft: 0, 
      borderWidth: 0,
      padding: 0,
      margin: 0,
    },
    checkboxText: {
      fontSize: 14,
      fontWeight: '500',
      color: Colors.secondary,
    },
});

export default CheckBox;