import { useMediaUrl, useRateRecipeMutation } from "@/api";
import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { RecipeData } from "@/constants/types";
import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import Header from "@/shared/Header";
import View from "@/shared/View";
import CongratulationsSection from "@/widgets/Recipe/RecipeInfo/components/CongratulationsSection";
import AnimatedProgressBar from "@/widgets/Recipe/shared/ProgreeBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  BackHandler,
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
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useThemedStyles(createStyles);

  const [rateRecipe] = useRateRecipeMutation();

  const [stepIndex, setStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  let recipe: RecipeData;

  recipe = JSON.parse(params.data as string);

  const [rating, setRating] = useState(0);

  useEffect(() => {
    setRating(recipe.userRating ?? 0);
  }, [recipe.userRating]);

  const handleRateRecipe = () => {
    if (rating > 0 || recipe.userRating === rating) {
      rateRecipe({
        recipeId: recipe.id,
        value: rating,
      });
    }
    router.replace("/(app)/home");
  };

  useEffect(() => {
    const onBackPress = () => {
      if (stepIndex === 0) {
        router.back();
      }
      setStepIndex((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });

      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => sub.remove();
  }, [router, stepIndex]);

  const currentStep = recipe.steps[stepIndex];
  const isLast = stepIndex === recipe.steps.length - 1;

  const stepImageUri =
    currentStep.image &&
    typeof currentStep.image === "object" &&
    "uri" in currentStep.image
      ? currentStep.image.uri
      : null;

  const { url: stepImageUrl, headers: stepImageHeaders } = useMediaUrl(
    stepImageUri,
    { skip: !stepImageUri }
  );

  if (!recipe || !recipe.steps || recipe.steps.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("recipe.noSteps")}</Text>
      </View>
    );
  }

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
        <CongratulationsSection stars={rating} onRate={setRating} />
        <View style={styles.fixedButtonContainer}>
          <Button title={t("tabs.home")} onPress={handleRateRecipe} />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Header title={t("recipe.letsCook")} />
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
              <ArrowLeft color={colors.text} />
            </TouchableOpacity>
          )}
          <Text style={styles.stepNumber}>
            {currentStep.title || `${t("recipe.step")} ${currentStep.id}`}
          </Text>
          {currentStep.image && (
            <Image
              source={
                stepImageUrl
                  ? {
                      uri: stepImageUrl,
                      ...(stepImageHeaders && { headers: stepImageHeaders }),
                    }
                  : typeof currentStep.image === "object" &&
                      "uri" in currentStep.image
                    ? currentStep.image
                    : currentStep.image
              }
              style={styles.stepImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.stepDescription}>{currentStep.description}</Text>
        </RNView>
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <Button
          title={isLast ? t("recipe.finish") : t("recipe.next")}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

export default RecipeSteps;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
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
      color: colors.text,
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
      color: colors.text,
      fontSize: 22,
      fontWeight: "600",
      marginBottom: 10,
    },
    stepDescription: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 22,
      opacity: 0.85,
    },
    stepImage: {
      width: "100%",
      height: 240,
      borderRadius: 12,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      color: colors.text,
      fontSize: 16,
      textAlign: "center",
    },
  });
