import { useTranslation } from "@/hooks/useTranslation";
import TextInput from "@/shared/Inputs/TextInput";
import { Control, Controller, useForm } from "react-hook-form";
import BaseModal from "../BaseModal";

interface FormValues {
    dailyGoal: string;
}
  
const EditDailyCalorieGoalForm = ({
    control,
  }: {
    control: Control<FormValues>;
  }) => {
    const { t } = useTranslation();
  
    return (
      <Controller
        control={control}
        name="dailyGoal"
        rules={{
          required: true,
          validate: value => Number(value) > 0,
        }}
        render={({ field: { value, onChange } }) => (
          <TextInput
            label={t("editDailyCalorieGoalModal.dailyGoal")}
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
      />
    );
  };


  interface EditDailyCalorieGoalModalProps {
    isVisible: boolean;
    dailyGoal: number;
    onClose: (newDailyGoal: number) => void;
  }

  const EditDailyCalorieGoalModal: React.FC<EditDailyCalorieGoalModalProps> = ({
    isVisible,
    dailyGoal,
    onClose,
  }) => {
    const { t } = useTranslation();
  
    const { control, handleSubmit } = useForm<FormValues>({
      defaultValues: {
        dailyGoal: dailyGoal.toString(),
      },
    });
  
    const submit = (data: FormValues) => {
      onClose(Number(data.dailyGoal));
    };
  
    return (
      <BaseModal
        isVisible={isVisible}
        title={t("editDailyCalorieGoalModal.title")}
        message={t("editDailyCalorieGoalModal.message")}
        buttons={[
          {
            title: t("common.cancel"),
            onPress: () => onClose(dailyGoal),
            variant: "secondary",
          },
          {
            title: t("common.save"),
            onPress: handleSubmit(submit),
            variant: "primary",
          },
        ]}
      >
        <EditDailyCalorieGoalForm control={control} />
      </BaseModal>
    );
  };

  export default EditDailyCalorieGoalModal;