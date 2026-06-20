import { useAppSelector } from "@/api/hooks";
import { useUpdateProfileMutation } from "@/api/slices/profileApi";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import ErrorModal from "@/shared/Modals/ErrorModal";
import View from "@/shared/View";
import { calorieGoalStorage } from "@/storage/calorieGoal/calorieGoalStorage";
import {
  pendingBiometryStorage,
  type PendingBiometry,
} from "@/storage/pendingBiometry/pendingBiometryStorage";
import PersonalCalculatedIntakeCard from "@/widgets/Profile/components/PersonalCalculatedIntakeCard";
import PersonalInfoCard from "@/widgets/Profile/components/PersonalInfoCard";
import { getCalculatedIntakeFromProfile } from "@/widgets/Profile/utils/getCalculatedIntakeFromProfile";
import { useFocusEffect } from "@react-navigation/native";
import { Tabs, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const BiometryScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useAppSelector((state) => state.user.profile);
  const [updateProfile, { isLoading: isApplying }] = useUpdateProfileMutation();
  const [pending, setPending] = useState<PendingBiometry | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      setPending(pendingBiometryStorage.getPending());
    }, []),
  );

  const profileCalories = useMemo(
    () => getCalculatedIntakeFromProfile(profile),
    [profile],
  );

  const displayCalories = pending?.calculatedCalories ?? profileCalories;

  const handleRecalculate = useCallback(() => {
    router.push("/(app)/profile/biometry-form");
  }, [router]);

  const handleUseAsDailyIntake = useCallback(async () => {
    if (!displayCalories || displayCalories <= 0) return;

    const pending = pendingBiometryStorage.getPending();

    try {
      if (pending) {
        await updateProfile({
          gender: pending.gender,
          birthDate: pending.birthDate,
          height: pending.height,
          weight: pending.weight,
          sportActivity: pending.sportActivity,
        }).unwrap();
        pendingBiometryStorage.clear();
        setPending(null);
      }

      calorieGoalStorage.set(displayCalories);
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ?? error?.message ?? t("auth.error"),
      );
      setShowErrorModal(true);
    }
  }, [displayCalories, router, t, updateProfile]);

  return (
    <View style={styles.screen}>
      <Tabs.Screen options={{ tabBarStyle: { display: "none" } }} />
      <Header title={t("profile.biometryData")} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PersonalCalculatedIntakeCard
          calories={displayCalories}
          onRecalculate={handleRecalculate}
          onUseAsDailyIntake={handleUseAsDailyIntake}
          isApplying={isApplying}
        />

        <PersonalInfoCard profile={profile} pending={pending} />
      </ScrollView>

      <ErrorModal
        isVisible={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
});

export default BiometryScreen;
