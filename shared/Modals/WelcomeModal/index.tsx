import { useTranslation } from "@/hooks/useTranslation";
import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface WelcomeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isVisible, onClose }) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      isVisible={isVisible}
      title={t("auth.welcome")}
      message={t("auth.welcomeMessage")}
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

export default WelcomeModal;
