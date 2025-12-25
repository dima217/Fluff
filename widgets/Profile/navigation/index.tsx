import Bell from "@/assets/images/BellIncative.svg";
import Settings from "@/assets/images/Setting.svg";
import SignOut from "@/assets/images/SignOut.svg";
import Support from "@/assets/images/Support.svg";
import Tooth from "@/assets/images/Tooth.svg";
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

export const profileMenuItems: MenuItem[] = [
  {
    id: "biometry",
    title: "Biometry Data",
    icon: <Tooth />,
    href: "/(app)/profile/biometry",
    isNested: true,
  },
  {
    id: "achievements",
    title: "Achievements",
    icon: <Bell />,
    href: "/(app)/profile/achievements",
    isNested: true,
  },
  {
    id: "support",
    title: "Support",
    icon: <Support />,
    href: "/(app)/profile/support",
    isNested: true,
  },
  {
    id: "settings",
    title: "Account Settings",
    icon: <Settings />,
    href: "/(app)/profile/settings",
    isNested: true,
  },
  {
    id: "logout",
    title: "Log Out",
    icon: <SignOut />,
    onPress: () => {
      console.log("Logout");
    },
  },
];
