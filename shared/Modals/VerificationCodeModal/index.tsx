import { useTranslation } from "@/hooks/useTranslation";
import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface VerificationCodeModalProps {
  isVisible: boolean;
  email: string;
  onClose: () => void;
}

const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
  isVisible,
  email,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      isVisible={isVisible}
      title={t("auth.verificationCodeSent")}
      message={`${t("auth.codeSentTo")} ${email}`}
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

export default VerificationCodeModal;
