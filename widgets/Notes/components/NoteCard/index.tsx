import { Colors } from "@/constants/design-tokens";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface NoteCardProps {
  id: string;
  createdAt: string;
  title: string;
  onPress: () => void;
  onDelete: () => void;
}

const NoteCard = ({ createdAt, title, onPress, onDelete }: NoteCardProps) => {
  return (
    <GradientView style={styles.gradientContainer}>
        <View style={styles.header}>
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <ThemedText type="xs">{createdAt}</ThemedText>
            <ThemedText type="s">{title}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={16} color={Colors.secondary} />
        </TouchableOpacity>
        </View>
    </GradientView>
  );
};

export default NoteCard;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    flex: 1,
    borderRadius: 10,
    padding: 16,
  },
  deleteButton: {
    padding: 10,
  },
  gradientContainer: {
    borderRadius: 10,
  },
});