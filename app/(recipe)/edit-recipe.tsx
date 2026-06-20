import { useGetRecipeByIdQuery } from "@/api";
import {
  useMarkUploadedMutation,
  usePrepareRecipeUploadMutation,
  usePrepareStepResourcesUploadMutation,
  usePrepareVideoUploadMutation,
  useUpdateRecipeMutation,
} from "@/api/slices/recipesApi";
import type { RecipeResponse } from "@/api/types";
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
import {
  RecipeFormProvider,
  useRecipeFormContext,
} from "@/widgets/Recipe/RecipeNew/hooks/useRecipeFormContext";
import { recipeResponseToFormData } from "@/widgets/Recipe/RecipeNew/utils/recipeToFormData";
import { updateRecipeWorkflow } from "@/widgets/Recipe/RecipeNew/utils/updateRecipeWorkflow";
import AnimatedProgressBar from "@/widgets/Recipe/shared/ProgreeBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";

function EditRecipeForm({ recipe }: { recipe: RecipeResponse }) {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      scroll: { flex: 1 },
      scrollContent: { flexGrow: 1, paddingBottom: 24 },
      progressWrapper: {
        width: "100%",
        marginTop: 20,
        marginBottom: 40,
        alignItems: "center",
        justifyContent: "center",
      },
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
      centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    })
  );
  const { step, setStep, setTotalSteps } = useRecipeFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const router = useRouter();
  const validationSchemas = useMemo(() => createRecipeStepsConfig(t), [t]);

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

  const [prepareRecipeUpload] = usePrepareRecipeUploadMutation();
  const [prepareStepResourcesUpload] = usePrepareStepResourcesUploadMutation();
  const [prepareVideoUpload] = usePrepareVideoUploadMutation();
  const [markUploaded] = useMarkUploadedMutation();
  const [updateRecipe] = useUpdateRecipeMutation();

  useEffect(() => {
    setTotalSteps(5);
  }, [setTotalSteps]);

  const handleFinalSubmit = async (finalData: Partial<Recipe>) => {
    if (!recipe || isSubmitting) return;
    setIsSubmitting(true);

    const result = await updateRecipeWorkflow({
      recipeId: recipe.id,
      existingRecipe: recipe,
      recipeData: finalData,
      prepareRecipeUpload,
      prepareStepResourcesUpload,
      prepareVideoUpload,
      markUploaded,
      updateRecipe,
    });

    router.replace("/(app)/home");

    if (result.success) {
      setResultModal({
        title: t("common.success"),
        message: t("recipe.updateSuccess"),
      });
    } else {
      setResultModal({
        title: t("auth.error"),
        message: result.error ?? t("recipe.updateError"),
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
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Header title={t("recipe.editRecipe")} showExitConfirmation />

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

      <ErrorModal
        isVisible={!!resultModal}
        title={resultModal?.title}
        message={resultModal?.message ?? ""}
        onClose={() => setResultModal(null)}
      />
    </>
  );
}

export default function EditRecipeScreen() {
  const { t } = useTranslation();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    })
  );
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const id = recipeId ? Number(recipeId) : NaN;

  const { data: recipe, isLoading } = useGetRecipeByIdQuery(id, {
    skip: !Number.isInteger(id) || id < 1,
  });

  if (!Number.isInteger(id) || id < 1) {
    return (
      <View>
        <Header title={t("recipe.editRecipe")} />
        <RNView style={styles.centered}>
          <ActivityIndicator size="large" />
        </RNView>
      </View>
    );
  }

  if (isLoading || !recipe) {
    return (
      <View>
        <Header title={t("recipe.editRecipe")} />
        <RNView style={styles.centered}>
          <ActivityIndicator size="large" />
        </RNView>
      </View>
    );
  }

  const initialFormData = recipeResponseToFormData(recipe);

  return (
    <View>
      <KeyboardAwareView style={{ flex: 1 }}>
        <RecipeFormProvider initialFormData={initialFormData}>
          <EditRecipeForm recipe={recipe} />
        </RecipeFormProvider>
      </KeyboardAwareView>
    </View>
  );
}
