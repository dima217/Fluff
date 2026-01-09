import { Colors } from "@/constants/design-tokens";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import GradientView from "@/shared/ui/GradientView";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

interface WelcomeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.innerContainer}>
          <GradientView style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {t("auth.welcome")}
            </Text>
            <Text style={styles.modalText}>
              {t("auth.welcomeMessage")}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title={t("common.close")}
                style={[styles.button, styles.buttonConfirm]}
                onPress={onClose}
              />
            </View>
          </GradientView>
        </View>
      </View>
    </Modal>
  );
};

export default WelcomeModal;

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
  buttonConfirm: {
    backgroundColor: Colors.primary,
  },
});

