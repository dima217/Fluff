import { Colors } from "@/constants/design-tokens";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import Button from "../Buttons/Button";
import GradientView from "../ui/GradientView";

interface ExitConfirmationModalProps {
  isVisible: boolean;
  onConfirmExit: () => void;
  onCancel: () => void;
}

const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  isVisible,
  onConfirmExit,
  onCancel,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.innerContainer}>
          <GradientView style={styles.modalView}>
            <Text style={styles.modalTitle}>Warning</Text>
            <Text style={styles.modalText}>
              Are you sure you want to exit? Your progress will not be
              saved.{" "}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Exit"
                style={[styles.button, styles.buttonConfirm]}
                onPress={onConfirmExit}
              ></Button>

              <Button
                title="Cancel"
                style={[styles.button, styles.buttonCancel]}
                onPress={onCancel}
                textColor={Colors.primary}
              ></Button>
            </View>
          </GradientView>
        </View>
      </View>
    </Modal>
  );
};

export default ExitConfirmationModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  innerContainer: {
    width: "85%",
    height: "32%",
  },
  modalView: {
    borderRadius: 12,
    justifyContent: "center",
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.text,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    color: Colors.border,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  button: {
    elevation: 2,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: Colors.text,
    borderWidth: 1,
  },
  buttonConfirm: {
    backgroundColor: Colors.primary,
  },
  textStyleCancel: {
    color: Colors.inactive,
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyleConfirm: {
    color: Colors.text,
    fontWeight: "bold",
    textAlign: "center",
  },
});
