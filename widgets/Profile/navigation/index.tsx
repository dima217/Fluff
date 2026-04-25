import { useLogoutMutation } from "@/api";
import { useAppDispatch, useAppSelector } from "@/api/hooks";
import { clearUser } from "@/api/slices/userSlice";
import { RootState } from "@/api/store";
import { tokenStorage } from "@/api/utils/tokenStorage";
import Bell from "@/assets/images/BellIncative.svg";
import Settings from "@/assets/images/Setting.svg";
import SignOut from "@/assets/images/SignOut.svg";
import Support from "@/assets/images/Support.svg";
import Tooth from "@/assets/images/Tooth.svg";
import { useTranslation } from "@/hooks/useTranslation";
import LogoutConfirmationModal from "@/shared/Modals/LogoutConfirmationModal";
import { Href, useRouter } from "expo-router";
import { ReactNode, useEffect, useState } from "react";

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

  const isAuthenticated = useAppSelector((state: RootState) => state.user.isAuthenticated);

  useEffect(() => {
    console.log("isAuthenticated changed:", isAuthenticated);
  }, [isAuthenticated]);
  
  const handleLogoutClick = () => {
    console.log("Logout clicked");

    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    console.log("[ProfileMenu] Logout confirmed");
    setShowLogoutModal(false);

    await tokenStorage.clearTokens();
    dispatch(clearUser());
    
    router.replace("/(auth)/login");
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
