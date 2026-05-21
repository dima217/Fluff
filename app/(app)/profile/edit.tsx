import { useGetProfileQuery, useUpdateProfileMutation } from "@/api";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import Header from "@/shared/Header";
import TextInput from "@/shared/Inputs/TextInput";
import ErrorModal from "@/shared/Modals/ErrorModal";
import View from "@/shared/View";
import AvatarUploader from "@/widgets/Profile/components/AvatarUploader";
import { useAvatarUpload } from "@/widgets/Profile/hooks/useAvatarUpload";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

const EditProfile = () => {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const router = useRouter();

  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const { uploadAvatar, isUploading } = useAvatarUpload();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.user?.firstName ?? "");
      setLastName(profile.user?.lastName ?? "");
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      let photoUrl: string | undefined;

      if (localAvatarUri) {
        const result = await uploadAvatar(localAvatarUri);
        if (!result.success) {
          setErrorMessage(result.error ?? t("common.error"));
          setShowError(true);
          return;
        }
        photoUrl = result.photoUrl;
      }

      await updateProfile({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        ...(photoUrl ? { photo: photoUrl } : {}),
      }).unwrap();

      router.back();
    } catch (e: any) {
      setErrorMessage(e?.data?.message ?? e?.message ?? t("common.error"));
      setShowError(true);
    }
  };

  const loading = isSaving || isUploading;

  return (
    <View>
      <Tabs.Screen options={{ tabBarStyle: { display: "none" } }} />
      <Header title={t("profile.editProfile")} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AvatarUploader
            value={localAvatarUri}
            onChange={setLocalAvatarUri}
          />

          <TextInput
            label={t("auth.firstName") || "Name*"}
            placeholder={t("common.enter")}
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            label={t("auth.lastName") || "Last Name"}
            placeholder={t("common.enter")}
            value={lastName}
            onChangeText={setLastName}
          />
        </ScrollView>

        <Button
          title={t("common.save")}
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />
      </KeyboardAvoidingView>

      <ErrorModal
        isVisible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </View>
  );
};

export default EditProfile;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    content: {
      alignItems: "center",
      gap: 16,
      paddingTop: 24,
      paddingBottom: 24,
    },
    saveButton: {
      marginBottom: 16,
      width: "100%",
    },
  });
