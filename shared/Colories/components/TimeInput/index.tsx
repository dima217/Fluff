import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ThemedText } from "@/shared/ui/ThemedText";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TimeInputProps {
  onChange: (time24h: string | undefined) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ onChange }) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  const notify = (h: string, m: string, p: "AM" | "PM") => {
    if (!h || !m || m.length < 1) {
      onChange(undefined);
      return;
    }
    let h24 = parseInt(h, 10);
    if (p === "AM") {
      if (h24 === 12) h24 = 0;
    } else {
      if (h24 !== 12) h24 += 12;
    }
    onChange(`${String(h24).padStart(2, "0")}:${m.padStart(2, "0")}`);
  };

  const handleHoursChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "").slice(0, 2);
    const num = parseInt(cleaned, 10);
    if (cleaned === "" || (num >= 1 && num <= 12)) {
      setHours(cleaned);
      notify(cleaned, minutes, period);
    }
  };

  const handleMinutesChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "").slice(0, 2);
    const num = parseInt(cleaned, 10);
    if (cleaned === "" || (num >= 0 && num <= 59)) {
      setMinutes(cleaned);
      notify(hours, cleaned, period);
    }
  };

  const handlePeriod = (p: "AM" | "PM") => {
    setPeriod(p);
    notify(hours, minutes, p);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelContainer}>
        <ThemedText type="xs" style={styles.label}>
          Time
        </ThemedText>
      </View>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.timeInput, { color: colors.text }]}
            value={hours}
            onChangeText={handleHoursChange}
            placeholder="11"
            placeholderTextColor={colors.secondary}
            keyboardType="numeric"
            maxLength={2}
          />
          <Text style={[styles.separator, { color: colors.text }]}>:</Text>
          <TextInput
            style={[styles.timeInput, { color: colors.text }]}
            value={minutes}
            onChangeText={handleMinutesChange}
            placeholder="30"
            placeholderTextColor={colors.secondary}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[
              styles.periodBtn,
              period === "AM" && styles.periodBtnActive,
            ]}
            onPress={() => handlePeriod("AM")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.periodText,
                { color: period === "AM" ? colors.background : colors.text },
              ]}
            >
              AM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodBtn,
              period === "PM" && styles.periodBtnActive,
            ]}
            onPress={() => handlePeriod("PM")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.periodText,
                { color: period === "PM" ? colors.background : colors.text },
              ]}
            >
              PM
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TimeInput;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },
    labelContainer: {
      marginBottom: 4,
    },
    label: {
      color: colors.secondary,
      fontSize: 12,
      marginLeft: 4,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    inputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      borderRadius: 26,
      paddingHorizontal: 16,
      height: 48,
    },
    timeInput: {
      flex: 1,
      fontSize: 16,
      textAlign: "center",
    },
    separator: {
      fontSize: 18,
      fontWeight: "600",
      marginHorizontal: 4,
    },
    periodToggle: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
    },
    periodBtn: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    periodBtnActive: {
      backgroundColor: colors.text,
    },
    periodText: {
      fontSize: 14,
      fontWeight: "600",
    },
  });
