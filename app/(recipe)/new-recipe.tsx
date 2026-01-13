import {
  useConfirmRecipeUploadMutation,
  useCreateRecipeWithMediaIdsMutation,
  useMarkUploadedMutation,
  usePrepareRecipeUploadMutation,
  usePrepareStepResourcesUploadMutation,
} from "@/api/slices/recipesApi";
import { Recipe } from "@/constants/types";
import Header from "@/shared/Header";
import View from "@/shared/View";
import BaseInfo from "@/widgets/Recipe/RecipeNew/components/forms/BaseInfo";
import CookingProcess from "@/widgets/Recipe/RecipeNew/components/forms/CookingProcess";
import Preview from "@/widgets/Recipe/RecipeNew/components/forms/Preview";
import Tutorial from "@/widgets/Recipe/RecipeNew/components/forms/Tutorial";
import RecipeFormWrapper from "@/widgets/Recipe/RecipeNew/components/FormWrapper";
import { stepsConfig } from "@/widgets/Recipe/RecipeNew/components/validation/validationSchemas";
import { useRecipeFormContext } from "@/widgets/Recipe/RecipeNew/hooks/useRecipeFormContext";
import { createRecipeWorkflow } from "@/widgets/Recipe/RecipeNew/utils/createRecipeWorkflow";
import AnimatedProgressBar from "@/widgets/Recipe/shared/ProgreeBar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";

const CreateRecipeScreen = () => {
  const { step, setStep, setTotalSteps, resetForm } = useRecipeFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prepareRecipeUpload] = usePrepareRecipeUploadMutation();
  const [prepareStepResourcesUpload] = usePrepareStepResourcesUploadMutation();
  const [markUploaded] = useMarkUploadedMutation();
  const [createRecipeWithMediaIds] = useCreateRecipeWithMediaIdsMutation();
  const [confirmRecipeUpload] = useConfirmRecipeUploadMutation();

  useEffect(() => {
    setTotalSteps(4);
  }, [setTotalSteps]);

  const handleFinalSubmit = async (finalData: Partial<Recipe>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const result = await createRecipeWorkflow({
      recipeData: finalData,
      prepareRecipeUpload,
      prepareStepResourcesUpload,
      markUploaded,
      createRecipeWithMediaIds,
      confirmRecipeUpload,
    });

    if (result.success) {
      Alert.alert("Success", "Recipe created successfully!");
      resetForm();
    } else {
      Alert.alert("Error", result.error || "Failed to create recipe");
    }

    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <BaseInfo />;
      case 1:
        return <CookingProcess onBack={() => setStep(step - 1)} />;
      case 2:
        return <Tutorial onBack={() => setStep(step - 1)} />;
      case 3:
        return <Preview onBack={() => setStep(step - 1)} />;
      default:
        return null;
    }
  };

  return (
    <View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <Header title={"Add New Recipe"} showExitConfirmation />

          <RNView style={styles.progressWrapper}>
            <AnimatedProgressBar progress={(step + 1) / 4} />
          </RNView>

          {isSubmitting && (
            <RNView style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </RNView>
          )}

          <RecipeFormWrapper
            key={step}
            onFinalSubmit={handleFinalSubmit}
            validationSchemas={stepsConfig}
          >
            {renderStep()}
          </RecipeFormWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateRecipeScreen;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  progressWrapper: {
    width: "100%",
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  button: {
    marginTop: 30,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
