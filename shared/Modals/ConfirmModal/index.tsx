import { useColors } from "@/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";
import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

export interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <BaseModal
      isVisible={isVisible}
      title={title}
      message={message}
      messageType="xs"
      onClose={onCancel}
      buttons={[
        {
          title: confirmLabel ?? t("common.confirm"),
          onPress: onConfirm,
          variant: "primary",
          style: destructive ? { backgroundColor: colors.reject } : undefined,
        },
        {
          title: cancelLabel ?? t("common.cancel"),
          onPress: onCancel,
          variant: "secondary",
        },
      ]}
    />
  );
};

export default ConfirmModal;
