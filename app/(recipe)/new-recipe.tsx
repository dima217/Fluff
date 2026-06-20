import {
  useConfirmRecipeUploadMutation,
  useCreateRecipeWithMediaIdsMutation,
  useMarkUploadedMutation,
  usePrepareRecipeUploadMutation,
  usePrepareStepResourcesUploadMutation,
  usePrepareVideoUploadMutation,
} from "@/api/slices/recipesApi";
import { Recipe } from "@/constants/types";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import KeyboardAwareView from "@/shared/KeyboardAwareView";
import ErrorModal from "@/shared/Modals/ErrorModal";
import View from "@/shared/View";
import BaseInfo from "@/widgets/Recipe/RecipeNew/components/forms/BaseInfo";
import CookingProcess from "@/widgets/Recipe/RecipeNew/components/forms/CookingProcess";
import Ingredients from "@/widgets/Recipe/RecipeNew/components/forms/Ingredients";
import Preview from "@/widgets/Recipe/RecipeNew/components/forms/Preview";
import Tutorial from "@/widgets/Recipe/RecipeNew/components/forms/Tutorial";
import RecipeFormWrapper from "@/widgets/Recipe/RecipeNew/components/FormWrapper";
import { createRecipeStepsConfig } from "@/widgets/Recipe/RecipeNew/components/validation/validationSchemas";
import { useRecipeFormContext } from "@/widgets/Recipe/RecipeNew/hooks/useRecipeFormContext";
import { createRecipeWorkflow } from "@/widgets/Recipe/RecipeNew/utils/createRecipeWorkflow";
import AnimatedProgressBar from "@/widgets/Recipe/shared/ProgreeBar";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";

const CreateRecipeScreen = () => {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      scroll: { flex: 1 },
      progressWrapper: {
        width: "100%",
        marginTop: 20,
        marginBottom: 40,
        alignItems: "center",
        justifyContent: "center",
      },
      scrollContent: { flexGrow: 1, paddingBottom: 24 },
      fullScreenContent: { flex: 1 },
      progressText: {
        fontSize: 14,
        color: c.secondary,
        marginBottom: 8,
      },
      button: { marginTop: 30 },
      loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: c.overlay,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      },
    })
  );
  const { step, setStep, setTotalSteps, resetForm } = useRecipeFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const router = useRouter();
  const validationSchemas = useMemo(() => createRecipeStepsConfig(t), [t]);

  const [prepareRecipeUpload] = usePrepareRecipeUploadMutation();
  const [prepareStepResourcesUpload] = usePrepareStepResourcesUploadMutation();
  const [prepareVideoUpload] = usePrepareVideoUploadMutation();
  const [markUploaded] = useMarkUploadedMutation();
  const [createRecipeWithMediaIds] = useCreateRecipeWithMediaIdsMutation();
  const [confirmRecipeUpload] = useConfirmRecipeUploadMutation();

  useEffect(() => {
    setTotalSteps(5);
  }, [setTotalSteps]);

  useEffect(() => {
    const onBackPress = () => {
      if (step === 0) {
        router.back();
      }
      setStep(step - 1);

      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => sub.remove();
  }, [router, setStep, step]);

  const handleFinalSubmit = async (finalData: Partial<Recipe>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const result = await createRecipeWorkflow({
      recipeData: finalData,
      prepareRecipeUpload,
      prepareStepResourcesUpload,
      prepareVideoUpload,
      markUploaded,
      createRecipeWithMediaIds,
      confirmRecipeUpload,
    });

    if (result.success) {
      resetForm();
      setResultModal({
        title: t("common.success"),
        message: t("recipe.createSuccess"),
      });
    } else {
      setResultModal({
        title: t("auth.error"),
        message: result.error || t("recipe.createError"),
      });
    }

    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <BaseInfo />;
      case 1:
        return <Ingredients onBack={() => setStep(step - 1)} />;
      case 2:
        return <CookingProcess onBack={() => setStep(step - 1)} />;
      case 3:
        return <Tutorial onBack={() => setStep(step - 1)} />;
      case 4:
        return <Preview onBack={() => setStep(step - 1)} />;
      default:
        return null;
    }
  };

  return (
    <View>
      <KeyboardAwareView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Header title={t("recipe.addNewRecipe")} showExitConfirmation />

          <RNView style={styles.progressWrapper}>
            <AnimatedProgressBar progress={(step + 1) / 5} />
          </RNView>

          {isSubmitting && (
            <RNView style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.onPrimary} />
            </RNView>
          )}

          <RecipeFormWrapper
            key={step}
            onFinalSubmit={handleFinalSubmit}
            validationSchemas={validationSchemas}
          >
            {renderStep()}
          </RecipeFormWrapper>
        </ScrollView>
      </KeyboardAwareView>
      <ErrorModal
        isVisible={!!resultModal}
        title={resultModal?.title}
        message={resultModal?.message ?? ""}
        onClose={() => setResultModal(null)}
      />
    </View>
  );
};

export default CreateRecipeScreen;
