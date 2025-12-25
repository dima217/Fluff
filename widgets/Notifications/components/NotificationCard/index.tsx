import { Colors } from "@/constants/design-tokens";
import Button from "@/shared/Buttons/Button";
import Avatar from "@/shared/ui/Avatar";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, View } from "react-native";
import { renderTime } from "../../utils";

interface NotificationCardProps {
  title?: string;
  description?: string;
  actionText?: string;
  action2Text?: string;
  createdAt?: Date | string;
}

const NotificationCard = ({
  title = "Not enough calories today",
  description = "At this rate, you yourself will become like my stem. Have another meal!",
  actionText = "Add a meal",
  action2Text,
  createdAt,
}: NotificationCardProps) => {
  return (
    <View style={styles.container}>
      <Avatar size="medium" source={require("@/assets/images/Fluffy.png")} />
      <View style={styles.content}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText type="mini" style={styles.description}>
          {description}
        </ThemedText>
        <View style={styles.buttons}>
          <Button
            title={actionText}
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => {}}
          />
          {action2Text && (
            <Button
              title={action2Text}
              style={styles.button}
              textStyle={styles.buttonText}
              onPress={() => {}}
            />
          )}
        </View>
      </View>
      {createdAt && (
        <ThemedText style={styles.time}>{renderTime(createdAt)}</ThemedText>
      )}
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    padding: 12,
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    marginBottom: 4,
    color: "#888",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  button: {
    width: "45%",
    height: 30,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  buttonText: {
    fontSize: 12,
  },
});
