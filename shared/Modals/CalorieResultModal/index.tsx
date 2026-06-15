import { useColors } from "@/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";
import TextInput from "@/shared/Inputs/TextInput";
import { ThemedText } from "@/shared/ui/ThemedText";
import React from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import BaseModal from "../BaseModal";

interface FormValues {
  customGoal: string;
}

const CalorieGoalForm = ({
  control,
}: {
  control: Control<FormValues>;
}) => {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name="customGoal"
      rules={{
        required: true,
        validate: (value) => Number(value) > 0,
      }}
      render={({ field: { value, onChange } }) => (
        <TextInput
          label={t("calorieResultModal.yourGoal")}
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
        />
      )}
    />
  );
};

interface CalorieResultModalProps {
  isVisible: boolean;
  calculatedCalories: number;
  onSave: (customCalories: number) => void;
  onCancel: () => void;
}

const CalorieResultModal: React.FC<CalorieResultModalProps> = ({
  isVisible,
  calculatedCalories,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const colors = useColors();

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      customGoal: String(calculatedCalories),
    },
  });

  const submit = (data: FormValues) => {
    onSave(Number(data.customGoal));
  };

  return (
    <BaseModal
      isVisible={isVisible}
      buttons={[
        {
          title: t("common.save"),
          onPress: handleSubmit(submit),
          variant: "primary",
        },
        {
          title: t("common.cancel"),
          onPress: onCancel,
          variant: "secondary",
        },
      ]}
    >
      <View style={styles.content}>
        <ThemedText type="default" style={styles.label}>
          {t("calorieResultModal.title")}
        </ThemedText>

        <View style={styles.caloriesRow}>
          <ThemedText type="title" style={[styles.calories, { color: colors.text }]}>
            {calculatedCalories}
          </ThemedText>
          <ThemedText type="subtitle" style={[styles.unit, { color: colors.text }]}>
            {t("calorieResultModal.unit")}
          </ThemedText>
        </View>

        <ThemedText type="default" style={styles.message}>
          {t("calorieResultModal.message")}
        </ThemedText>

        <CalorieGoalForm control={control} />
      </View>
    </BaseModal>
  );
};

export default CalorieResultModal;

const styles = StyleSheet.create({
  content: {
    width: "100%",
  },
  label: {
    textAlign: "center",
    marginBottom: 4,
  },
  caloriesRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
    marginBottom: 12,
  },
  calories: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: "bold",
  },
  unit: {
    marginBottom: 4,
  },
  message: {
    textAlign: "center",
    marginBottom: 16,
  },
});
