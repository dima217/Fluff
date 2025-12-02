import Header from "@/shared/Header";
import View from "@/shared/View";
import BaseInfo from "@/widgets/Recipe/RecipeNew/components/forms/BaseInfo";
import CookingProcess from "@/widgets/Recipe/RecipeNew/components/forms/CookingProcess";
import Preview from "@/widgets/Recipe/RecipeNew/components/forms/Preview";
import Tutorial from "@/widgets/Recipe/RecipeNew/components/forms/Tutorial";
import StepWrapper from "@/widgets/Recipe/RecipeNew/components/StepWrapper";
import {
  baseInfoSchema,
  cookingProcessSchema,
  tutorialSchema,
} from "@/widgets/Recipe/RecipeNew/components/validation/validationSchemas";
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
  const { step, setStep, setTotalSteps, formData, updateFormData, resetForm } =
    useRecipeFormContext();

  useEffect(() => {
    setTotalSteps(4);
  }, [setTotalSteps]);

  const handleStepSubmit = (stepIndex: number, stepData: any) => {
    updateFormData(stepData);

    if (stepIndex === 3) {
      handleFinalSubmit({ ...formData, ...stepData });
    } else {
      setStep(stepIndex + 1);
    }
  };

  const handleFinalSubmit = (finalData: any) => {
    console.log("Все данные формы:", finalData);
    alert("Рецепт успешно создан!");
    resetForm();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <StepWrapper
            key={step}
            stepIndex={0}
            onSubmit={handleStepSubmit}
            validationSchema={baseInfoSchema}
            defaultValues={formData}
          >
            <BaseInfo />
          </StepWrapper>
        );
      case 1:
        return (
          <StepWrapper
            key={step}
            stepIndex={1}
            onSubmit={handleStepSubmit}
            validationSchema={cookingProcessSchema}
            defaultValues={formData}
          >
            <CookingProcess onBack={() => setStep(step - 1)} />
          </StepWrapper>
        );
      case 2:
        return (
          <StepWrapper
            key={step}
            stepIndex={2}
            onSubmit={handleStepSubmit}
            validationSchema={tutorialSchema}
            defaultValues={formData}
          >
            <Tutorial onBack={() => setStep(step - 1)} />
          </StepWrapper>
        );
      case 3:
        return (
          <StepWrapper
            key={step}
            stepIndex={3}
            onSubmit={handleStepSubmit}
            validationSchema={tutorialSchema}
            defaultValues={formData}
          >
            <Preview
              data={formData}
              onBack={() => setStep(step - 1)}
              onSubmit={() => handleFinalSubmit(formData)}
              onChange={updateFormData}
            />
          </StepWrapper>
        );
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

          {renderStep()}
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
