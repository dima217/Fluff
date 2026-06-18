import { getProductUnitLabel, PRODUCT_UNITS } from "@/constants/productUnits";
import type { ProductUnit } from "@/constants/types";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import { Text, TouchableOpacity, View } from "react-native";
import { createProductUnitSegmentStyles } from "./styles";

interface ProductUnitSegmentProps {
  value: ProductUnit;
  onChange: (unit: ProductUnit) => void;
}

const ProductUnitSegment = ({ value, onChange }: ProductUnitSegmentProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createProductUnitSegmentStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.segment}>
      {PRODUCT_UNITS.map((unit) => (
        <TouchableOpacity
          key={unit}
          style={[styles.btn, unit === value && { backgroundColor: colors.primary }]}
          onPress={() => onChange(unit)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.btnText,
              { color: unit === value ? colors.onPrimary : colors.secondary },
            ]}
          >
            {getProductUnitLabel(unit, t)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ProductUnitSegment;
