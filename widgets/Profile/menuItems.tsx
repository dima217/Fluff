import Bell from "@/assets/images/BellIncative.svg";
import Settings from "@/assets/images/Setting.svg";
import SignOut from "@/assets/images/SignOut.svg";
import Support from "@/assets/images/Support.svg";
import Tooth from "@/assets/images/Tooth.svg";
import { ReactNode } from "react";

export interface MenuItem {
  id: string;
  title: string;
  icon: ReactNode;
  onPress: () => void;
  isNested?: boolean;
}

export const profileMenuItems: MenuItem[] = [
  {
    id: "biometry",
    title: "Biometry Data",
    icon: <Tooth />,
    onPress: () => console.log("Account pressed"),
    isNested: true,
  },
  {
    id: "achievements",
    title: "Achievements",
    icon: <Bell />,
    onPress: () => console.log("Notifications pressed"),
    isNested: true,
  },
  {
    id: "support",
    title: "Support",
    icon: <Support />,
    onPress: () => console.log("Settings pressed"),
    isNested: true,
  },
  {
    id: "account",
    title: "Account Settings",
    icon: <Settings />,
    onPress: () => console.log("Help pressed"),
    isNested: true,
  },
  {
    id: "log out",
    title: "Log Out",
    icon: <SignOut />,
    onPress: () => console.log("Help pressed"),
    isNested: false,
  },
];
