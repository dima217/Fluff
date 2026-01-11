import { useLogoutMutation } from "@/api";
import { useAppDispatch } from "@/api/hooks";
import { clearUser } from "@/api/slices/userSlice";
import { tokenStorage } from "@/api/utils/tokenStorage";
import Bell from "@/assets/images/BellIncative.svg";
import Settings from "@/assets/images/Setting.svg";
import SignOut from "@/assets/images/SignOut.svg";
import Support from "@/assets/images/Support.svg";
import Tooth from "@/assets/images/Tooth.svg";
import { useTranslation } from "@/hooks/useTranslation";
import LogoutConfirmationModal from "@/shared/Modals/LogoutConfirmationModal";
import { Href, useRouter } from "expo-router";
import { ReactNode, useState } from "react";

export interface MenuItem {
  id: string;
  title: string;
  icon: ReactNode;
  href?: Href;
  onPress?: () => void;
  isNested?: boolean;
}

export const useProfileMenuItems = (): {
  items: MenuItem[];
  logoutModal: ReactNode;
} => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    console.log("Logout clicked");

    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    console.log("[ProfileMenu] Logout confirmed");
    setShowLogoutModal(false);

    // Create a timeout promise to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        console.warn("[ProfileMenu] Logout timeout after 5 seconds");
        reject(new Error("Logout timeout"));
      }, 5000); // 5 second timeout
    });

    try {
      console.log("[ProfileMenu] Calling logout API...");
      // Call logout API with timeout - it will clear tokens in onQueryStarted
      await Promise.race([logout().unwrap(), timeoutPromise]);
      console.log("[ProfileMenu] Logout API call completed");
    } catch (error: any) {
      // Even if logout fails or times out, ensure tokens are cleared
      console.error("[ProfileMenu] Logout error or timeout:", error);
      console.log(
        "[ProfileMenu] Manually clearing tokens due to error/timeout..."
      );
      await tokenStorage.clearTokens();
    }

    // Clear user state
    console.log("[ProfileMenu] Clearing user state...");
    dispatch(clearUser());
    await tokenStorage.clearTokens();

    // Wait a bit for state to update, then navigate
    // This ensures AuthContext sees the updated state
    setTimeout(() => {
      console.log("[ProfileMenu] Navigating to login...");
      router.replace("/(auth)/login");
    }, 50);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const items: MenuItem[] = [
    {
      id: "biometry",
      title: t("profile.biometryData"),
      icon: <Tooth />,
      href: "/(app)/profile/biometry",
      isNested: true,
    },
    {
      id: "achievements",
      title: t("profile.achievements"),
      icon: <Bell />,
      href: "/(app)/profile/achievements",
      isNested: true,
    },
    {
      id: "support",
      title: t("profile.support"),
      icon: <Support />,
      href: "/(app)/profile/support",
      isNested: true,
    },
    {
      id: "settings",
      title: t("profile.accountSettings"),
      icon: <Settings />,
      href: "/(app)/profile/settings",
      isNested: true,
    },
    {
      id: "logout",
      title: t("profile.logOut"),
      icon: <SignOut />,
      onPress: handleLogoutClick,
    },
  ];

  const logoutModal = (
    <LogoutConfirmationModal
      isVisible={showLogoutModal}
      onConfirm={handleLogoutConfirm}
      onCancel={handleLogoutCancel}
    />
  );

  return { items, logoutModal };
};
