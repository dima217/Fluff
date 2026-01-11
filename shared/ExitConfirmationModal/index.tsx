import { useTranslation } from "@/hooks/useTranslation";
import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

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
  const { t } = useTranslation();

  return (
    <BaseModal
      isVisible={isVisible}
      title={t("modal.warning")}
      message={t("modal.exitConfirm")}
      onClose={onCancel}
      buttons={[
        {
          title: t("modal.exit"),
          onPress: onConfirmExit,
          variant: "primary",
        },
        {
          title: t("common.cancel"),
          onPress: onCancel,
          variant: "secondary",
        },
      ]}
    />
  );
};

export default ExitConfirmationModal;
