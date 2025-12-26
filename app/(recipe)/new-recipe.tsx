import { Recipe } from "@/constants/types";
import Header from "@/shared/Header";
import View from "@/shared/View";
import BaseInfo from "@/widgets/Recipe/RecipeNew/components/forms/BaseInfo";
import CookingProcess from "@/widgets/Recipe/RecipeNew/components/forms/CookingProcess";
import Preview from "@/widgets/Recipe/RecipeNew/components/forms/Preview";
import Tutorial from "@/widgets/Recipe/RecipeNew/components/forms/Tutorial";
import FormWrapper from "@/widgets/Recipe/RecipeNew/components/FormWrapper";
import { stepsConfig } from "@/widgets/Recipe/RecipeNew/components/validation/validationSchemas";
import { useRecipeFormContext } from "@/widgets/Recipe/RecipeNew/hooks/useRecipeFormContext";
import AnimatedProgressBar from "@/widgets/Recipe/shared/ProgreeBar";
import { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";

const CreateRecipeScreen = () => {
  const { step, setStep, setTotalSteps, resetForm } = useRecipeFormContext();

  useEffect(() => {
    setTotalSteps(4);
  }, [setTotalSteps]);

  const handleFinalSubmit = (finalData: Partial<Recipe>) => {
    console.log("Все данные формы:", finalData);
    alert("Рецепт успешно создан!");
    resetForm();
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

          <FormWrapper
            key={step}
            onFinalSubmit={handleFinalSubmit}
            validationSchemas={stepsConfig}
          >
            {renderStep()}
          </FormWrapper>
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
});
