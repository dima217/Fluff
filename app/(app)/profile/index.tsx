import Header from "@/shared/Header";
import View from "@/shared/View";
import ProfileCard from "@/widgets/Profile/components/ProfileCard";
import ProfileMenu from "@/widgets/Profile/components/ProfileMenu";
import { View as RNView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Profile = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Header title="My Profile" />
        <RNView style={styles.content}>
          <ProfileCard />
          <ProfileMenu />
        </RNView>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
});
