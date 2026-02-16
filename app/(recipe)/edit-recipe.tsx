import {
  useMarkUploadedMutation,
  usePrepareRecipeUploadMutation,
  useUpdateRecipeMutation,
} from "@/api/slices/recipesApi";
import { Recipe } from "@/constants/types";
import Header from "@/shared/Header";
import View from "@/shared/View";
import BaseInfo from "@/widgets/Recipe/RecipeNew/components/forms/BaseInfo";
import CookingProcess from "@/widgets/Recipe/RecipeNew/components/forms/CookingProcess";
import Preview from "@/widgets/Recipe/RecipeNew/components/forms/Preview";
import Tutorial from "@/widgets/Recipe/RecipeNew/components/forms/Tutorial";
import RecipeFormWrapper from "@/widgets/Recipe/RecipeNew/components/FormWrapper";
import { RecipeFormProvider, useRecipeFormContext } from "@/widgets/Recipe/RecipeNew/hooks/useRecipeFormContext";
import { recipeResponseToFormData } from "@/widgets/Recipe/RecipeNew/utils/recipeToFormData";
import { updateRecipeWorkflow } from "@/widgets/Recipe/RecipeNew/utils/updateRecipeWorkflow";
import { stepsConfig } from "@/widgets/Recipe/RecipeNew/components/validation/validationSchemas";
import AnimatedProgressBar from "@/widgets/Recipe/shared/ProgreeBar";
import { useLocalSearchParams } from "expo-router";
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
import { useGetRecipeByIdQuery } from "@/api";
import type { RecipeResponse } from "@/api/types";

function EditRecipeForm({ recipe }: { recipe: RecipeResponse }) {
  const { step, setStep, setTotalSteps } = useRecipeFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prepareRecipeUpload] = usePrepareRecipeUploadMutation();
  const [markUploaded] = useMarkUploadedMutation();
  const [updateRecipe] = useUpdateRecipeMutation();

  useEffect(() => {
    setTotalSteps(4);
  }, [setTotalSteps]);

  const handleFinalSubmit = async (finalData: Partial<Recipe>) => {
    if (!recipe || isSubmitting) return;
    setIsSubmitting(true);

    const result = await updateRecipeWorkflow({
      recipeId: recipe.id,
      existingRecipe: recipe,
      recipeData: finalData,
      prepareRecipeUpload,
      markUploaded,
      updateRecipe,
    });

    if (result.success) {
      Alert.alert("Готово", "Рецепт обновлён");
    } else {
      Alert.alert("Ошибка", result.error ?? "Не удалось обновить рецепт");
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
    <>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header title="Редактировать рецепт" showExitConfirmation />

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
    </>
  );
}

export default function EditRecipeScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const id = recipeId ? Number(recipeId) : NaN;
  const { data: recipe, isLoading } = useGetRecipeByIdQuery(id, {
    skip: !Number.isInteger(id) || id < 1,
  });

  if (!Number.isInteger(id) || id < 1) {
    return (
      <View>
        <Header title="Редактировать рецепт" />
        <RNView style={styles.centered}>
          <ActivityIndicator size="large" />
        </RNView>
      </View>
    );
  }

  if (isLoading || !recipe) {
    return (
      <View>
        <Header title="Редактировать рецепт" />
        <RNView style={styles.centered}>
          <ActivityIndicator size="large" />
        </RNView>
      </View>
    );
  }

  const initialFormData = recipeResponseToFormData(recipe);

  return (
    <View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <RecipeFormProvider initialFormData={initialFormData}>
          <EditRecipeForm recipe={recipe} />
        </RecipeFormProvider>
      </KeyboardAvoidingView>
    </View>
  );
}

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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
