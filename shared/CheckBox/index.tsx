import { Colors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";
import { CheckBox as RNCheckBox } from "react-native-elements";

interface CheckBoxProps {
    title: string;
    checked: boolean | null;
    setChecked: (checked: boolean | null) => void;
    size?: number;
    allowNull?: boolean; 
}

const CheckBox = ({title, checked, setChecked, size = 24, allowNull = false}: CheckBoxProps) => {
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