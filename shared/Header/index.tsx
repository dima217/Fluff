import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import Bell from "@/assets/images/Bell.svg";
import { CircleSizes } from "@/constants/components/CIrcle";
import { StyleSheet, View } from "react-native";
import Circle from "../ui/Circle";
import { ThemedText } from "../ui/ThemedText";

type HeaderProps = {
  title?: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <Circle
        svg={<ArrowLeft />}
        frostedGlass
        onPress={() => {}}
        size={CircleSizes.MEDIUM}
      />

      {title && (
        <ThemedText type="s" style={styles.title}>
          {title}
        </ThemedText>
      )}

      <Circle
        svg={<Bell />}
        frostedGlass
        onPress={() => {}}
        size={CircleSizes.MEDIUM}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 30,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
});
