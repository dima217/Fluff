import { StyleSheet } from "react-native";
import Button from "../Button";

interface TransparentButtonProps {
  title: string;
  onPress: () => void;
}

export default function TransparentButton({ title, onPress }: TransparentButtonProps) {
  return (
    <Button title={title} onPress={onPress} style={styles.button}/>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
  },
});