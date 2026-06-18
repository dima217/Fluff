import {
  useGetProductByIdQuery,
  useMediaUrl,
} from "@/api";
import { useFavoriteToggle } from "@/api/hooks/useFavoriteToggle";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useTranslation } from "@/hooks/useTranslation";
import View from "@/shared/View";
import DetailHero from "@/widgets/Recipe/RecipeInfo/components/DetailHero";
import DetailScreenState from "@/widgets/Recipe/RecipeInfo/components/DetailScreenState";
import { createDetailScreenStyles } from "@/widgets/Recipe/RecipeInfo/utils/detailScreenStyles";
import ProductCard from "@/widgets/Product/ProductInfo/components/ProductCard";
import PopularRecipesSection from "@/widgets/Product/ProductInfo/components/PopularRecipesSection";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";

export default function ProductScreen() {
  const colors = useColors();
  const styles = useThemedStyles(createDetailScreenStyles);
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  const { toggleFavorite } = useFavoriteToggle();

  const productId = params.productId ? parseInt(params.productId as string, 10) : null;

  const { data: product, isLoading, error } = useGetProductByIdQuery(productId!, {
    skip: !productId,
  });

  const { url: coverMediaUrl, headers: coverMediaHeaders } = useMediaUrl(
    product?.image?.cover,
    { skip: !product?.image?.cover },
  );

  const handleLike = useCallback(() => {
    if (!productId || !product) return;
    toggleFavorite({ id: productId, isFavorite: product.favorite, type: "product" });
  }, [product, productId, toggleFavorite]);

  if (isLoading) {
    return <DetailScreenState styles={styles} colors={colors} variant="loading" />;
  }

  if (error || !product) {
    return (
      <DetailScreenState
        styles={styles}
        colors={colors}
        variant="error"
        message={error ? t("product.loadError") : t("product.notFound")}
      />
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
      <DetailHero
        coverUrl={coverMediaUrl}
        coverHeaders={coverMediaHeaders}
        fallbackUri={product.image?.cover}
        colors={colors}
        styles={styles}
      />

      <View style={styles.innerContainer}>
        <ProductCard
          title={product.name}
          calories={product.calories}
          massa={product.massa}
          favoritesCount={product.countFavorites}
          description={product.description}
          proteins={product.proteins}
          fats={product.fats}
          carbs={product.carbs}
          onLike={handleLike}
          isLiked={product.favorite ?? false}
          onMenu={() => {}}
        />

        <PopularRecipesSection productId={product.id} />
      </View>
    </ScrollView>
  );
}
