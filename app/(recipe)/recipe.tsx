import {
  useAddToFavoritesMutation,
  useGetProductsByIdsQuery,
  useGetRecipeByIdQuery,
  useMediaUrl,
  useRemoveFromFavoritesMutation,
} from "@/api";
import { Colors } from "@/constants/design-tokens";
import { RecipeData } from "@/constants/types";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { cheatMealStorage } from "@/utils/cheatMealStorage";
import { searchStorage } from "@/utils/searchStorage";
import IngredientsSection from "@/widgets/Recipe/RecipeInfo/components/IngredientsSection";
import RecipeCard from "@/widgets/Recipe/RecipeInfo/components/RecipeCard";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";

import {
  ActivityIndicator,
  ImageBackground,
  View as RNView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

export default function RecipeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const recipeId = params.recipeId ? parseInt(params.recipeId as string) : null;

  const {
    data: recipe,
    isLoading,
    error,
  } = useGetRecipeByIdQuery(recipeId!, {
    skip: !recipeId,
  });

  // Save to last visited when recipe is loaded
  useEffect(() => {
    if (recipeId) {
      searchStorage.addToLastVisited(recipeId);
    }
  }, [recipeId]);

  // Get products by IDs from recipe
  const productIds = useMemo(() => {
    return recipe?.products || [];
  }, [recipe?.products]);

  const { data: recipeProducts = [] } = useGetProductsByIdsQuery(productIds, {
    skip: !recipe || !productIds || productIds.length === 0,
  });

  const { url: coverMediaUrl, headers: coverMediaHeaders } = useMediaUrl(
    recipe?.image?.cover,
    { skip: !recipe?.image?.cover }
  );

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const handleLike = useCallback(async () => {
    if (!recipeId || !recipe) return;

    const newLikedState = !recipe.favorite;

    try {
      if (newLikedState) {
        await addToFavorites({ type: "recipe", id: recipeId }).unwrap();
      } else {
        await removeFromFavorites({ type: "recipe", id: recipeId }).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  }, [recipe, recipeId, addToFavorites, removeFromFavorites]);

  const recipeData: RecipeData | null = useMemo(() => {
    if (!recipe) return null;

    const steps =
      recipe.stepsConfig?.steps?.map((step, index) => {
        const imageResource = step.resources?.find((r) => r.type === "image");
        const imageUrl = imageResource?.source;

        return {
          id: index + 1,
          title: step.name || `Step ${index + 1}`,
          description: step.description,
          image: imageUrl ? { uri: imageUrl } : undefined,
        };
      }) || [];

    return {
      title: recipe.name,
      steps,
    };
  }, [recipe]);

  const formatCookTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}м`;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}ч ${remainingMinutes}м`
        : `${hours}ч`;
    }
    return `${minutes}м`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !recipe || !recipeData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error ? "Ошибка загрузки рецепта" : "Рецепт не найден"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      bounces={false}
      alwaysBounceVertical={false}
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={
          coverMediaUrl
            ? { uri: coverMediaUrl, ...(coverMediaHeaders && { headers: coverMediaHeaders }) }
            : recipe.image?.cover
              ? { uri: recipe.image.cover }
              : require("@/assets/images/Cake.png")
        }
        style={styles.background}
        resizeMode="cover"
      >
        <RNView style={styles.backgroundContent}>
          <Header />
        </RNView>
        <LinearGradient
          colors={["transparent", Colors.background]}
          style={styles.gradient}
        />
      </ImageBackground>

      <View style={styles.innerContainer}>
        <RecipeCard
          title={recipe.name}
          category={recipe.type?.name || "Recipe"}
          restaurant={
            recipe.fluffAt
              ? "Fluff"
              : recipe.user
                ? `${recipe.user.firstName} ${recipe.user.lastName}`
                : "Unknown"
          }
          rating={recipe.average || 0}
          time={formatCookTime(recipe.cookAt)}
          calories={recipe.calories}
          description={recipe.description || ""}
          onLike={handleLike}
          isLiked={recipe.favorite ?? false}
          onMenu={() => {
            cheatMealStorage.add({
              id: recipe.id,
              name: recipe.name,
              calories: recipe.calories,
              imageUrl: recipe.image?.cover ?? recipe.image?.preview ?? "",
              author: recipe.user
                ? `${recipe.user.firstName} ${recipe.user.lastName}`
                : "Author",
            });
          }}
          onPress={() => {
            router.push({
              pathname: "/recipe-steps",
              params: { data: JSON.stringify(recipeData) },
            });
          }}
        />

        <IngredientsSection products={recipeProducts} />

        <Button
          title={t("recipe.cookIt")}
          onPress={() => {
            if (recipeData) {
              router.push({
                pathname: "/recipe-steps",
                params: { data: JSON.stringify(recipeData) },
              });
            }
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  innerContainer: {
    width: "100%",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 40,
  },
  background: {
    width: "100%",
    height: 500,
  },
  backgroundContent: {
    padding: 20,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 30,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 20,
  },
  errorText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
