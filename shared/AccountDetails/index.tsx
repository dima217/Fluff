import Bell from "@/assets/images/Bell.svg";
import { CircleSizes } from "@/constants/components/CIrcle";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Avatar from "../ui/Avatar";
import Circle from "../ui/Circle";
import { ThemedText } from "../ui/ThemedText";

const AccountDetails = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Avatar size={CircleSizes.MEDIUM} title="K" />
        <View style={styles.infoContainer}>
          <ThemedText type="s">Katsiaryna</ThemedText>
          <ThemedText type="xs">katrinkaling@gmail.com</ThemedText>
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
