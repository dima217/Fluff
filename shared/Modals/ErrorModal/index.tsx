import { useTranslation } from "@/hooks/useTranslation";
import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface ErrorModalProps {
  isVisible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isVisible,
  title,
  message,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      isVisible={isVisible}
      title={title || t("auth.error")}
      message={message}
      onClose={onClose}
      buttons={[
        {
          title: t("common.close"),
          onPress: onClose,
          variant: "primary",
        },
      ]}
    />
  );
};

export default ErrorModal;

