import { useTranslation } from "@/hooks/useTranslation";
import { View } from "react-native";
import SexOption from "./SexOption";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { createSexPickerStyles } from "./styles";

type Gender = "male" | "female" | null;

interface SexPickerProps {
  selectedSex: Gender;
  onSelect: (sex: Gender) => void;
}

const SexPicker = ({ selectedSex, onSelect }: SexPickerProps) => {
  const styles = useThemedStyles(createSexPickerStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <SexOption
        label={t("signUp.male")}
        iconName="male"
        value="male"
        isSelected={selectedSex === "male"}
        onPress={onSelect}
      />
      <SexOption
        label={t("signUp.female")}
        iconName="female"
        value="female"
        isSelected={selectedSex === "female"}
        onPress={onSelect}
      />
    </View>
  );
};

export default SexPicker;
