import Bell from "@/assets/images/BellIncative.svg";
import Settings from "@/assets/images/Setting.svg";
import SignOut from "@/assets/images/SignOut.svg";
import Support from "@/assets/images/Support.svg";
import Tooth from "@/assets/images/Tooth.svg";
import { useTranslation } from "@/hooks/useTranslation";
import { Href } from "expo-router";
import { ReactNode } from "react";

export interface MenuItem {
  id: string;
  title: string;
  icon: ReactNode;
  href?: Href;
  onPress?: () => void;
  isNested?: boolean;
}

export const useProfileMenuItems = (): MenuItem[] => {
  const { t } = useTranslation();
  
  return [
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
      onPress: () => {
        console.log("Logout");
      },
    },
  ];
};
