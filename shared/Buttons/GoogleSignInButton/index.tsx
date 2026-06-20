import { GOOGLE_WEB_CLIENT_ID } from "@/constants/googleAuth";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import ErrorModal from "@/shared/Modals/ErrorModal";
import { useState } from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";

type Props = {
  title?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function GoogleSignInButton({
  title = "Continue with Google",
  style,
  disabled = false,
}: Props) {
  const { t } = useTranslation();
  const { signInWithGoogle, loading, alert, clearAlert } = useGoogleAuth();
  const [localAlert, setLocalAlert] = useState<{ title: string; message: string } | null>(
    null,
  );

  const onPress = () => {
    if (Platform.OS === "web") {
      setLocalAlert({
        title: t("auth.googleSignInTitle"),
        message: t("auth.googleSignInWebOnly"),
      });
      return;
    }
    if (!GOOGLE_WEB_CLIENT_ID) {
      setLocalAlert({
        title: t("auth.googleSignInTitle"),
        message: t("auth.googleSignInConfigError"),
      });
      return;
    }
    void signInWithGoogle();
  };

  const activeAlert = localAlert ?? alert;

  return (
    <>
      <Button
        title={title}
        onPress={onPress}
        loading={loading}
        disabled={disabled}
        style={style}
      />
      <ErrorModal
        isVisible={!!activeAlert}
        title={activeAlert?.title}
        message={activeAlert?.message ?? ""}
        onClose={() => {
          setLocalAlert(null);
          clearAlert();
        }}
      />
    </>
  );
}
