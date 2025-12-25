import { BlurView } from "expo-blur";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

import Add from "@/assets/images/Add.svg";
import BookTab from "@/assets/images/BookTab.svg";
import HomeTab from "@/assets/images/HomeTab.svg";
import HealthTab from "@/assets/images/PillTab.svg";
import UserTab from "@/assets/images/UserTab.svg";
import { CircleSizes } from "@/constants/components/CIrcle";
import { Colors } from "@/constants/design-tokens";
import Circle from "@/shared/ui/Circle";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          bottom: 16,
          marginHorizontal: 16,
          height: 52,
          borderRadius: 35,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              borderRadius: 35,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(255, 255, 254, 0.3)",
            }}
          >
            <BlurView
              intensity={70}
              tint="dark"
              style={{
                flex: 1,
                backgroundColor: "rgba(36, 35, 35, 0.95)",
              }}
            />
          </View>
        ),
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
          tabBarButton: () => (
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
          ),
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
          tabBarIcon: ({ color }) => <UserTab width={28} height={28} />,
        }}
      />
    </Tabs>
  );
}
