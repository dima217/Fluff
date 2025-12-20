import { Tabs, useRouter } from "expo-router";

import Add from "@/assets/images/Add.svg";
import BookTab from "@/assets/images/BookTab.svg";
import HomeTab from "@/assets/images/HomeTab.svg";
import HealthTab from "@/assets/images/PillTab.svg";
import UserTab from "@/assets/images/UserTab.svg";
import { CircleSizes } from "@/constants/components/CIrcle";
import { Colors } from "@/constants/design-tokens";
import Circle from "@/shared/ui/Circle";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          backgroundColor: Colors.tab,
          borderTopWidth: 0,
          elevation: 0,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <HomeTab width={28} height={28} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: "Health",
          tabBarIcon: ({ color }) => (
            <HealthTab width={28} height={28} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plus"
        options={{
          tabBarButton: () => {
            return (
              <TouchableOpacity
                onPress={() => router.push("/(recipe)/new-recipe")}
                style={{
                  top: -CircleSizes.MEDIUM / 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Circle size={56} svg={<Add />} />
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <BookTab width={28} height={28} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <UserTab width={28} height={28} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}
