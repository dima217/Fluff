import { Tabs } from "expo-router";

import Add from "@/assets/images/Add.svg";
import BookTab from "@/assets/images/BookTab.svg";
import HomeTab from "@/assets/images/HomeTab.svg";
import HealthTab from "@/assets/images/PillTab.svg";
import UserTab from "@/assets/images/UserTab.svg";
import Circle from "@/components/ui/Circle";
import { Colors } from "@/constants/Colors";
import { View } from "react-native";

export default function TabLayout() {
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
          tabBarButton: (props) => (
            <View
              style={{
                top: -20,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Circle size={56} svg={<Add />} />
            </View>
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
          tabBarIcon: ({ color }) => (
            <UserTab width={28} height={28} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}
