import { View } from "react-native";
import SexOption from "./SexOption";
import { styles } from "./styles";

type Gender = "male" | "female" | null;

interface SexPickerProps {
  selectedSex: Gender;
  onSelect: (sex: Gender) => void;
}

const SexPicker = ({ selectedSex, onSelect }: SexPickerProps) => {
  return (
    <View style={styles.container}>
      <SexOption
        label="Male"
        iconName="male"
        value="male"
        isSelected={selectedSex === "male"}
        onPress={onSelect}
      />
      <SexOption
        label="Female"
        iconName="female"
        value="female"
        isSelected={selectedSex === "female"}
        onPress={onSelect}
      />
    </View>
  );
};

export default SexPicker;
