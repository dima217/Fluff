import {
  RootState,
  useDeleteRecipeMutation,
  useGetRecipeByIdQuery,
  useMediaUrl,
  useUpdateProfileMutation,
} from "@/api";
import { useFavoriteToggle } from "@/api/hooks/useFavoriteToggle";
import Cookie from "@/assets/images/Cookie.svg";
import EditFill from "@/assets/images/EditFill.svg";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import ConfirmModal from "@/shared/Modals/ConfirmModal";
import ErrorModal from "@/shared/Modals/ErrorModal";
import { ContextMenuItem } from "@/shared/ui/ContextMenu";
import View from "@/shared/View";
import { searchStorage } from "@/storage/search/searchStorage";
import DetailHero from "@/widgets/Recipe/RecipeInfo/components/DetailHero";
import DetailScreenState from "@/widgets/Recipe/RecipeInfo/components/DetailScreenState";
import IngredientsSection from "@/widgets/Recipe/RecipeInfo/components/IngredientsSection";
import RecipeCard from "@/widgets/Recipe/RecipeInfo/components/RecipeCard";
import { createDetailScreenStyles } from "@/widgets/Recipe/RecipeInfo/utils/detailScreenStyles";
import { formatCookTime } from "@/widgets/Recipe/RecipeInfo/utils/formatCookTime";
import { getRecipeAuthor } from "@/widgets/Recipe/RecipeInfo/utils/getRecipeAuthor";
import { mapRecipeToRecipeData } from "@/widgets/Recipe/RecipeInfo/utils/mapRecipeToRecipeData";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";

export default function RecipeScreen() {
  const colors = useColors();
  const styles = useThemedStyles(createDetailScreenStyles);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  const { toggleFavorite } = useFavoriteToggle();
  const profile = useSelector((state: RootState) => state.user.profile);
  const [updateProfile] = useUpdateProfileMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteErrorVisible, setDeleteErrorVisible] = useState(false);

  const recipeId = params.recipeId ? parseInt(params.recipeId as string, 10) : null;

  const { data: recipe, isLoading, error } = useGetRecipeByIdQuery(recipeId!, {
    skip: !recipeId,
  });

  useEffect(() => {
    if (recipeId) searchStorage.addToLastVisited(recipeId);
  }, [recipeId]);

  const { url: coverMediaUrl, headers: coverMediaHeaders } = useMediaUrl(
    recipe?.image?.cover,
    { skip: !recipe?.image?.cover },
  );

  const recipeData = useMemo(
    () => (recipe ? mapRecipeToRecipeData(recipe) : null),
    [recipe],
  );

  const navigateToSteps = useCallback(() => {
    if (!recipeData) return;
    router.push({
      pathname: "/recipe-steps",
      params: { data: JSON.stringify(recipeData) },
    });
  }, [recipeData, router]);

  const handleLike = useCallback(() => {
    if (!recipeId || !recipe) return;
    toggleFavorite({ id: recipeId, isFavorite: recipe.favorite, type: "recipe" });
  }, [recipe, recipeId, toggleFavorite]);

  const isOwner = useMemo(() => {
    if (!recipe?.user || !profile?.user.id) return false;
    return String(recipe.user.id) === String(profile.user.id);
  }, [profile?.user.id, recipe?.user]);

  const isInCheatMeal = useMemo(
    () => (recipe ? (profile?.cheatMeal ?? []).includes(recipe.id) : false),
    [profile?.cheatMeal, recipe],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!recipeId) return;
    setDeleteConfirmVisible(false);

    try {
      await deleteRecipe(recipeId).unwrap();
      router.back();
    } catch {
      setDeleteErrorVisible(true);
    }
  }, [deleteRecipe, recipeId, router]);

  const menuItems = useMemo<ContextMenuItem[]>(() => {
    if (!recipe) return [];

    const items: ContextMenuItem[] = [];

    if (!isInCheatMeal) {
      items.push({
        id: "cheat-meal",
        label: t("recipe.addToCheatMeal"),
        icon: <Cookie width={18} height={18} />,
        onPress: () => {
          updateProfile({ recipeToCheatMealId: recipe.id });
        },
      });
    }

    if (isOwner) {
      items.push({
        id: "edit",
        label: t("recipe.editRecipe"),
        icon: <EditFill width={18} height={18} />,
        onPress: () => {
          router.push({
            pathname: "/(recipe)/edit-recipe",
            params: { recipeId: String(recipe.id) },
          });
        },
      });
      items.push({
        id: "delete",
        label: t("common.delete"),
        icon: <Ionicons name="trash-outline" size={20} color={colors.reject} />,
        destructive: true,
        onPress: () => setDeleteConfirmVisible(true),
      });
    }

    return items;
  }, [
    colors.reject,
    isInCheatMeal,
    isOwner,
    recipe,
    router,
    t,
    updateProfile,
  ]);

  if (isLoading) {
    return <DetailScreenState styles={styles} colors={colors} variant="loading" />;
  }

  if (error || !recipe || !recipeData) {
    return (
      <DetailScreenState
        styles={styles}
        colors={colors}
        variant="error"
        message={error ? t("recipe.loadError") : t("recipe.notFound")}
      />
    );
  }

  return (
    <>
      <ScrollView
        bounces={false}
        alwaysBounceVertical={false}
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DetailHero
          coverUrl={coverMediaUrl}
          coverHeaders={coverMediaHeaders}
          fallbackUri={recipe.image?.cover}
          colors={colors}
          styles={styles}
        />

        <View style={styles.innerContainer}>
          <RecipeCard
            title={recipe.name}
            category={recipe.type?.name || "Recipe"}
            restaurant={getRecipeAuthor(recipe)}
            rating={recipe.average || 0}
            time={formatCookTime(recipe.cookAt)}
            calories={recipe.calories}
            proteins={recipe.proteins}
            fats={recipe.fats}
            carbs={recipe.carbs}
            description={recipe.description || ""}
            onLike={handleLike}
            isLiked={recipe.favorite ?? false}
            menuItems={menuItems}
            onPress={navigateToSteps}
          />

          <IngredientsSection
            products={recipe.products}
            customProducts={recipe.customProducts}
          />

          <Button title={t("recipe.cookIt")} onPress={navigateToSteps} />
        </View>
      </ScrollView>

      <ConfirmModal
        isVisible={deleteConfirmVisible}
        title={t("recipe.deleteRecipeTitle")}
        message={t("recipe.deleteRecipeMessage")}
        confirmLabel={t("common.delete")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmVisible(false)}
        destructive
      />

      <ErrorModal
        isVisible={deleteErrorVisible}
        message={t("recipe.deleteRecipeError")}
        onClose={() => setDeleteErrorVisible(false)}
      />
    </>
  );
}
