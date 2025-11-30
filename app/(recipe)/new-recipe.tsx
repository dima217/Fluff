import { Recipe } from "@/constants/types";
import Button from "@/shared/Buttons/Button";
import Header from "@/shared/Header";
import View from "@/shared/View";
import BaseInfo from "@/widgets/Recipe/RecipeNew/components/forms/BaseInfo";
import CookingProcess from "@/widgets/Recipe/RecipeNew/components/forms/CookingProcess";
import Preview from "@/widgets/Recipe/RecipeNew/components/forms/Preview";
import Tutorial from "@/widgets/Recipe/RecipeNew/components/forms/Tutorial";
import AnimatedProgressBar from "@/widgets/Recipe/shared/ProgreeBar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";

const CreateRecipeScreen = () => {
  const [step, setStep] = useState(1);

  const [recipe, setRecipe] = useState<Partial<Recipe>>({});

  enum CreateStep {
    BaseInfo = 1,
    CookingProcess = 2,
    Tutorial = 3,
    Review = 4,
  }

  const updateRecipe = (patch: Partial<Recipe>) => {
    setRecipe((prev) => ({ ...prev, ...patch }));
  };

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  const renderStep = () => {
    switch (step) {
      case CreateStep.BaseInfo:
        return <BaseInfo data={recipe} onChange={updateRecipe} />;
      case CreateStep.CookingProcess:
        return (
          <CookingProcess
            data={recipe}
            onChange={updateRecipe}
            onBack={goBack}
          />
        );
      case CreateStep.Tutorial:
        return (
          <Tutorial data={recipe} onChange={updateRecipe} onBack={goBack} />
        );
      case CreateStep.Review:
        return (
          <Preview
            data={recipe}
            onChange={updateRecipe}
            onSubmit={() => console.log("FINAL", recipe)}
            onBack={goBack}
          />
        );
    }
  };

  return (
    <View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <Header title={"Add New Recipe"} />
          <RNView style={styles.progressWrapper}>
            <AnimatedProgressBar progress={step / 4} />
          </RNView>
          {renderStep()}
          <Button title={"Next"} onPress={goNext} style={styles.button} />
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
  button: {
    marginTop: 30,
  },
});
