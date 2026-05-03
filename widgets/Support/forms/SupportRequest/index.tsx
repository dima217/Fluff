import { getFilenameFromUri, getFileSizeFromUri, ReactNativeFile, uploadFile, useCreateSupportTicketMutation } from "@/api";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import ErrorModal from "@/shared/Modals/ErrorModal";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { RequestFormData, supportSchema } from "../shemas";
  
const SupportRequest = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: yupResolver(supportSchema),
    defaultValues: {
      title: "",
      screenshot: "",
      description: "",
    },
  });
  const { t } = useTranslation();
  const [createSupportTicket] = useCreateSupportTicketMutation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getErrorMessage = (field: keyof RequestFormData): string | undefined => {
    const error = errors[field];

    if (error && error.message) {
      return String(error.message);
    }

    return undefined;
  };

  const onSubmit = async (data: RequestFormData) => {
    try {
      const fileName = getFilenameFromUri(data.screenshot);
      const fileSize = await getFileSizeFromUri(data.screenshot);
      
      const response = await createSupportTicket({
        subject: data.title,
        message: data.description,
        screenshot: {
          name: fileName,
          size: fileSize,
        },
      }).unwrap();
    
      response.media ? await uploadFile({ uploadUrl: response.media.uploadUrl, file: { uri: data.screenshot } as ReactNativeFile }) : {};

    } catch (error: any) {
      let errorMsg = t("auth.loginFailed") || "Не удалось войти в систему";

      const status = error?.status;
      const errorData = error?.data;

      if (status === 401) {
        errorMsg = t("auth.invalidCredentials") || "Неверный email или пароль";
      } else if (status === 404) {
        errorMsg = t("auth.userNotFound") || "Пользователь не найден";
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      }

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    }
  };

  return (
    <View>
      {/* NAME */}
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label={t("recipe.name")}
              placeholder={t("common.enter")}
              value={value}
              errorMessage={getErrorMessage("title")}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      {/* MEDIA */}
      <View style={styles.mediaContainer}>
        <Controller
          control={control}
          name="screenshot"
          render={({ field: { value, onChange } }) => (
            <MediaUploader value={value} onChange={onChange} type="image" />
          )}
        />
      </View>

      {/* DESCRIPTION */}
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <LongTextInput
              label={t("recipe.ingredients")}
              placeholder={t("common.enter")}
              value={value}
              onChangeText={onChange}
              errorMessage={getErrorMessage("description")}
            />
          )}
        />
       <ErrorModal
        isVisible={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
      </View>

    <View style={styles.submitButton}>
      <Button
        title={t("auth.send")}
        onPress={() => handleSubmit(onSubmit)}
        //disabled={isLoading}
        //loading={isLoading}
      />
    </View>
    </View>
  );
};

export default SupportRequest;

const styles = StyleSheet.create({
  mediaContainer: {
    marginBottom: 30,
  },
  submitButton: {
    position: "absolute",
    bottom: 20,
  },
  inputWrapper: {
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});
