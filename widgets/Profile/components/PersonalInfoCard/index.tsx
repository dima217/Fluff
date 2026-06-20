import type { ProfileResponse } from "@/api/types";
import { useTranslation } from "@/hooks/useTranslation";
import type { PendingBiometry } from "@/storage/pendingBiometry/pendingBiometryStorage";
import { ThemedText } from "@/shared/ui/ThemedText";
import {
  formatBirthDateWithAge,
  formatGenderLabel,
  formatHeightLabel,
  formatSportActivityLabel,
  formatWeightLabel,
} from "@/widgets/Profile/lib/formatBiometryDisplay";
import { StyleSheet, View, type ViewStyle } from "react-native";

interface InfoFieldProps {
  label: string;
  value: string;
  style?: ViewStyle;
}

const InfoField = ({ label, value, style }: InfoFieldProps) => (
  <View style={[styles.field, style]}>
    <ThemedText type="caption" color="secondary">
      {label}
    </ThemedText>
    <ThemedText type="body" weight="semibold" color="text">
      {value}
    </ThemedText>
  </View>
);

interface PersonalInfoCardProps {
  profile?: ProfileResponse | null;
  pending?: PendingBiometry | null;
}

const PersonalInfoCard = ({ profile, pending }: PersonalInfoCardProps) => {
  const { t } = useTranslation();

  const gender = pending ? pending.gender : profile?.gender;
  const birthDate = pending ? pending.birthDate : profile?.birthDate;
  const height = pending ? pending.height : profile?.height;
  const weight = pending ? pending.weight : profile?.weight;
  const sportActivity = pending ? pending.sportActivity : profile?.sportActivity;

  return (
    <View style={styles.container}>
      <ThemedText type="body" weight="semibold">
        {t("profile.personalInfo")}
      </ThemedText>

      <View style={styles.row}>
        <InfoField
          label={t("profile.gender")}
          value={formatGenderLabel(gender, t)}
          style={styles.half}
        />
        <InfoField
          label={t("profile.age")}
          value={formatBirthDateWithAge(birthDate)}
          style={styles.half}
        />
      </View>

      <View style={styles.row}>
        <InfoField
          label={t("profile.height")}
          value={formatHeightLabel(height)}
          style={styles.half}
        />
        <InfoField
          label={t("profile.weight")}
          value={formatWeightLabel(weight)}
          style={styles.half}
        />
      </View>

      <InfoField
        label={t("profile.lifestyle")}
        value={formatSportActivityLabel(sportActivity, t)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  field: {
    gap: 6,
  },
  half: {
    flex: 1,
  },
});

export default PersonalInfoCard;
