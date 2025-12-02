// Header.tsx
import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import Bell from "@/assets/images/Bell.svg";
import { CircleSizes } from "@/constants/components/CIrcle";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ExitConfirmationModal from "../ExitConfirmationModal";
import Circle from "../ui/Circle";
import { ThemedText } from "../ui/ThemedText";

type HeaderProps = {
  title?: string;
  showExitConfirmation?: boolean;
};

const Header = ({ title, showExitConfirmation = false }: HeaderProps) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleBackPress = () => {
    if (showExitConfirmation) {
      setIsModalVisible(true);
    } else {
      router.back();
    }
  };

  const handleConfirmExit = () => {
    setIsModalVisible(false);
    router.back();
  };

  const handleCancelExit = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Circle
        svg={<ArrowLeft />}
        frostedGlass
        onPress={handleBackPress}
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

      <ExitConfirmationModal
        isVisible={isModalVisible}
        onConfirmExit={handleConfirmExit}
        onCancel={handleCancelExit}
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
