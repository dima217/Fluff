import { useAppSelector } from "@/api/hooks";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import View from "@/shared/View";
import BiometryForm from "@/widgets/Profile/components/BiometryForm";
import { mapProfileToBiometryFormData } from "@/widgets/Profile/lib/mapProfileToBiometryForm";
import { Tabs } from "expo-router";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

const BiometryFormScreen = () => {
  const { t } = useTranslation();
  const profile = useAppSelector((state) => state.user.profile);

  const initialFormData = useMemo(
    () => mapProfileToBiometryFormData(profile),
    [profile],
  );

  return (
    <View style={styles.screen}>
      <Tabs.Screen options={{ tabBarStyle: { display: "none" } }} />
      <Header title={t("profile.recalculate")} />
      <BiometryForm initialFormData={initialFormData} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default BiometryFormScreen;
