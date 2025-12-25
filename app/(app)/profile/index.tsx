import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import View from "@/shared/View";
import ProfileCard from "@/widgets/Profile/components/ProfileCard";
import ProfileMenu from "@/widgets/Profile/components/ProfileMenu";
import { View as RNView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Profile = () => {
  const { t } = useTranslation();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Header title={t("profile.myProfile")} />
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
