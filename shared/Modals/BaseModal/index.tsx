import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import GradientView from "@/shared/ui/GradientView";
import { ThemedText } from "@/shared/ui/ThemedText";
import React, { ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

export interface BaseModalButton {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textColor?: string;
  variant?: "primary" | "secondary";
}

export interface BaseModalProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  children?: ReactNode;
  buttons?: BaseModalButton[];
  onClose?: () => void;
  width?: string | number;
  titleType?: "title" | "subtitle" | "default" | "mini" | "notion" | "s" | "xs";
  messageType?:
    | "title"
    | "subtitle"
    | "default"
    | "mini"
    | "notion"
    | "s"
    | "xs";
}

const BaseModal: React.FC<BaseModalProps> = ({
  isVisible,
  title,
  message,
  children,
  buttons,
  onClose,
  width = "85%",
  titleType = "subtitle",
  messageType = "default",
}) => {
  const colors = useColors();
  const styles = useThemedStyles(createBaseModalStyles);
  const { t } = useTranslation();

  const handleClose = () => {
    onClose?.();
  };

  const finalButtons: BaseModalButton[] = buttons || [
    {
      title: t("common.close"),
      onPress: handleClose,
      variant: "primary",
    },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <View style={[styles.centerWrapper]}>
          <Pressable
            style={[
              styles.container,
              {
                width: Number(width),
              },
            ]}
          >
            <GradientView style={styles.modal}>
              <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
              >
                {title && (
                  <ThemedText type={titleType} style={styles.title}>
                    {title}
                  </ThemedText>
                )}

                {message && (
                  <ThemedText type={messageType} style={styles.message}>
                    {message}
                  </ThemedText>
                )}

                {children && <View style={styles.children}>{children}</View>}
              </ScrollView>

              <View style={styles.buttons}>
                {finalButtons.map((button, index) => (
                  <Button
                    key={index}
                    title={button.title}
                    onPress={button.onPress}
                    style={[
                      styles.button,
                      button.variant === "primary" && styles.primary,
                      button.variant === "secondary" && styles.secondary,
                      button.style,
                    ]}
                    textColor={
                      button.textColor ||
                      (button.variant === "secondary"
                        ? colors.primary
                        : undefined)
                    }
                  />
                ))}
              </View>
            </GradientView>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default BaseModal;

const createBaseModalStyles = (colors: AppColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    centerWrapper: {
      width: "100%",
      alignItems: "center",
    },
    container: {
      width: "100%",
    },
    modal: {
      borderRadius: 14,
      padding: 16,
      paddingTop: 30,
      width: "85%",
      flex: 0,
    },
    content: {
      paddingBottom: 12,
    },
    title: {
      marginBottom: 8,
      textAlign: "center",
    },
    message: {
      marginBottom: 12,
      textAlign: "center",
    },
    children: {
      width: "100%",
      marginBottom: 12,
    },
    buttons: {
      gap: 10,
    },
    button: {
      width: "100%",
    },
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.text,
      borderWidth: 1,
    },
  });
