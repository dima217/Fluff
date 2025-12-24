import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { RecipeData } from "@/constants/types";
import Button from "@/shared/Buttons/Button";
import Header from "@/shared/Header";
import View from "@/shared/View";
import CongratulationsSection from "@/widgets/Recipe/RecipeInfo/components/CongratulationsSection";
import AnimatedProgressBar from "@/widgets/Recipe/shared/ProgreeBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  View as RNView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const RecipeSteps = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const recipe: RecipeData = JSON.parse(params.data as string);
  const [stepIndex, setStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = recipe.steps[stepIndex];
  const isLast = stepIndex === recipe.steps.length - 1;

  const handleNext = () => {
    if (isLast) setIsFinished(true);
    else setStepIndex(stepIndex + 1);
  };

  const handlePrev = () => {
    if (stepIndex === 0) return;
    else setStepIndex(stepIndex - 1);
  };

  if (isFinished) {
    return (
      <View style={styles.congratulationContainer}>
        <RNView style={{ paddingHorizontal: 20 }}>
          <Header title={recipe.title} />
        </RNView>
        <CongratulationsSection />
        <View style={styles.fixedButtonContainer}>
          <Button title="Home" onPress={() => {}} />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Header title={recipe.title} />
      <RNView style={styles.progressWrapper}>
        <AnimatedProgressBar progress={(stepIndex + 1) / recipe.steps.length} />
      </RNView>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <RNView style={styles.stepCard}>
          {stepIndex > 0 && (
            <TouchableOpacity onPress={handlePrev}>
              <ArrowLeft />
            </TouchableOpacity>
          )}
          <Text style={styles.stepNumber}>Step {currentStep.id}</Text>
          {currentStep.image && (
            <Image source={currentStep.image} style={styles.stepImage} />
          )}
          <Text style={styles.stepDescription}>{currentStep.description}</Text>
        </RNView>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button title={isLast ? "Finish" : "Next"} onPress={handleNext} />
      </View>
    </View>
  );
};

export default RecipeSteps;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  congratulationContainer: {
    paddingHorizontal: 0,
  },
  progressWrapper: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 40,
  },
  content: {
    paddingBottom: 140,
  },
  fixedButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
  },
  stepCard: {
    gap: 16,
    borderRadius: 16,
    marginTop: 45,
  },
  stepNumber: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  stepDescription: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 22,
  },
  stepImage: {
    width: "100%",
    height: 240,
    borderRadius: 12,
  },
});
