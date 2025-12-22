// widgets/Modals/ExitConfirmationModal.tsx

import { Colors } from "@/constants/design-tokens";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GradientView from "../ui/Gradient";

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
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={onCancel}
              >
                <Text style={styles.textStyleCancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={onConfirmExit}
              >
                <Text style={styles.textStyleConfirm}>Exit</Text>
              </TouchableOpacity>
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
    width: "100%",
    height: "32%",
  },
  modalView: {
    margin: 20,
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
    width: "85%",
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    flex: 1,
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
