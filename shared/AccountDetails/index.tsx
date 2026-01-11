import { useGetProfileQuery } from "@/api";
import { useAppSelector } from "@/api/hooks";
import Bell from "@/assets/images/Bell.svg";
import { CircleSizes } from "@/constants/components/CIrcle";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Avatar from "../ui/Avatar";
import Circle from "../ui/Circle";
import { ThemedText } from "../ui/ThemedText";

const AccountDetails = () => {
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const user = useAppSelector((state) => state.user.profile);

  const displayProfile = profile || user;

  const getInitials = () => {
    if (!displayProfile?.user) return "?";
    const firstName = displayProfile.user.firstName || "";
    const lastName = displayProfile.user.lastName || "";
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) return firstName[0].toUpperCase();
    if (displayProfile.user.email)
      return displayProfile.user.email[0].toUpperCase();
    return "?";
  };

  const getFirstName = () => {
    if (!displayProfile?.user) return "";
    return displayProfile.user.firstName || displayProfile.user.email || "";
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Avatar size={CircleSizes.MEDIUM} title={getInitials()} />
        <View style={styles.infoContainer}>
          <ThemedText type="s">{getFirstName()}</ThemedText>
          <ThemedText type="xs">{displayProfile?.user?.email || ""}</ThemedText>
        </View>
      </View>
      <Circle
        size={CircleSizes.MEDIUM}
        onPress={() => {
          router.push("/notifications");
        }}
        svg={<Bell />}
      />
    </View>
  );
};

export default AccountDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: 55,
    display: "flex",
    flexDirection: "row",
    alignSelf: "stretch",

    justifyContent: "space-between",
    alignItems: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  infoContainer: {
    flexDirection: "column",
    gap: 5,
  },
});
