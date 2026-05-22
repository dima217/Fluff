import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import TextInput from "@/shared/Inputs/TextInput";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TimeInputProps {
  onChange: (time24h: string | undefined) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ onChange }) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const [value, setValue] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const prevLenRef = useRef(0);

  const notify = (raw: string, p: "AM" | "PM") => {
    const parts = raw.split(":");
    if (parts.length !== 2 || parts[0].length < 1 || parts[1].length < 2) {
      onChange(undefined);
      return;
    }
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m) || h < 1 || h > 12 || m < 0 || m > 59) {
      onChange(undefined);
      return;
    }
    let h24 = h;
    if (p === "AM") {
      if (h24 === 12) h24 = 0;
    } else {
      if (h24 !== 12) h24 += 12;
    }
    onChange(`${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  };

  const handleChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");
    const isDeleting = text.length < prevLenRef.current;
    prevLenRef.current = text.length;

    let formatted = digits;
    if (digits.length >= 3) {
      const hPart = digits.slice(0, 2);
      const mPart = digits.slice(2, 4);
      const hNum = parseInt(hPart, 10);
      if (hNum > 12) return;
      formatted = `${hPart}:${mPart}`;
    } else if (digits.length === 2 && !isDeleting) {
      const hNum = parseInt(digits, 10);
      if (hNum > 12) return;
      formatted = `${digits}:`;
    }

    setValue(formatted);
    notify(formatted, period);
  };

  const handlePeriod = (p: "AM" | "PM") => {
    setPeriod(p);
    notify(value, p);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <TextInput
          label="Time"
          style={styles.inputWrapper}
          value={value}
          onChangeText={handleChange}
          placeholder="11:30"
          placeholderTextColor={colors.secondary}
          keyboardType="numeric"
          maxLength={5}
        />
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[
              styles.periodBtn,
            ]}
            onPress={() => handlePeriod("AM")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.periodText,
                { color: period === "AM" ? colors.onPrimary : colors.label },
              ]}
            >
              AM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodBtn,
            ]}
            onPress={() => handlePeriod("PM")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.periodText,
                { color: period === "PM" ? colors.onPrimary : colors.label },
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
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    inputWrapper: {
      flex: 1,
    },
    periodToggle: {
      flexDirection: "row",
      overflow: "hidden",
    },
    periodBtn: {
      paddingHorizontal: 16,
    },

    periodText: {
      fontSize: 14,
      fontWeight: "600",
    },
  });
