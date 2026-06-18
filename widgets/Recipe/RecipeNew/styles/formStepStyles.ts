import { AppColors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

export const createFormStepStyles = (colors: AppColors) =>
  StyleSheet.create({
    backButton: { paddingBottom: 10 },
    header: { gap: 6, marginVertical: 30 },
    headerFirst: { gap: 6, marginBottom: 30 },
    fieldsContainer: { gap: 20 },
    stepsContainer: { gap: 30, marginBottom: 20 },
    contentContainer: { gap: 10 },
    taggedSection: { marginTop: 16, gap: 10 },
    fieldError: { color: colors.reject, marginBottom: 12 },
  });

export type FormStepStyles = ReturnType<typeof createFormStepStyles>;
