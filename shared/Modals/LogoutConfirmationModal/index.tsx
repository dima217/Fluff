import { useTranslation } from "@/hooks/useTranslation";
import ConfirmModal from "@/shared/Modals/ConfirmModal";
import React from "react";

interface LogoutConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <ConfirmModal
      isVisible={isVisible}
      title={t("profile.logoutConfirmTitle")}
      message={t("profile.logoutConfirmMessage")}
      confirmLabel={t("profile.logOut")}
      onConfirm={onConfirm}
      onCancel={onCancel}
      destructive
    />
  );
};

export default LogoutConfirmationModal;
