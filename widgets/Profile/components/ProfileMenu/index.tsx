import { StyleSheet, View } from "react-native";
import { profileMenuItems } from "../../menuItems";
import ProfileSection from "./ui/ProfileSection";

const ProfileMenu = () => {
  return (
    <View style={styles.container}>
      {profileMenuItems.map((item, index) => (
        <ProfileSection
          key={item.id}
          icon={item.icon}
          title={item.title}
          onPress={item.onPress}
          isNested={item.isNested ?? false}
          isLast={index === profileMenuItems.length - 1}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export default ProfileMenu;
