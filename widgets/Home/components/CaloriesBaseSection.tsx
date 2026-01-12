import { useGetProductsQuery } from "@/api";
import { useTranslation } from "@/hooks/useTranslation";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

const CaloriesBaseSection = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [accumulatedProducts, setAccumulatedProducts] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useGetProductsQuery({ page, limit });

  const products = useMemo(() => {
    if (!productsResponse) return [];
    if (typeof productsResponse === "object" && "data" in productsResponse) {
      return Array.isArray(productsResponse.data) ? productsResponse.data : [];
    }
    return Array.isArray(productsResponse) ? productsResponse : [];
  }, [productsResponse]);

  const totalProducts = useMemo(() => {
    if (!productsResponse) return 0;
    if (typeof productsResponse === "object" && "meta" in productsResponse) {
      return productsResponse.meta?.total || 0;
    }
    return 0;
  }, [productsResponse]);

  useEffect(() => {
    if (products && products.length > 0) {
      if (page === 1) {
        setAccumulatedProducts(products);
      } else {
        setAccumulatedProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueNewProducts = products.filter(
            (p: any) => !existingIds.has(p.id)
          );
          return [...prev, ...uniqueNewProducts];
        });
      }
      setIsLoadingMore(false);
    } else if (page === 1 && !isLoadingProducts) {
      setAccumulatedProducts([]);
      setIsLoadingMore(false);
    }
  }, [products, page, isLoadingProducts]);

  const handleLoadMore = useCallback(() => {
    if (
      productsResponse &&
      totalProducts > 0 &&
      accumulatedProducts.length < totalProducts &&
      !isFetchingProducts &&
      !isLoadingProducts &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [
    productsResponse,
    accumulatedProducts.length,
    totalProducts,
    isLoadingProducts,
    isFetchingProducts,
    isLoadingMore,
  ]);

  const productsAsMealData: MealData[] = useMemo(
    () =>
      Array.isArray(accumulatedProducts) && accumulatedProducts.length > 0
        ? accumulatedProducts.map((product) => ({
            id: product.id.toString(),
            title: product.name,
            calories: `${product.calories} ккал / ${product.massa}г`,
            imageUrl: product.image?.cover || product.image?.preview || "",
            isLiked: product.favorite,
            productId: product.id,
          }))
        : [],
    [accumulatedProducts]
  );

  return (
    <View style={styles.section}>
      <ThemedText type="s">{t("homeSections.mealsToday")}</ThemedText>
      {isLoadingProducts && page === 1 ? (
        <ThemedText type="xs">Загрузка...</ThemedText>
      ) : productsAsMealData.length > 0 ? (
        <CardsCarousel
          products={productsAsMealData}
          onCardPress={(item) => {}}
          variant="featured"
          onScrollToEnd={handleLoadMore}
        />
      ) : (
        <ThemedText type="xs">Нет продуктов</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 20,
    marginTop: "10%",
    alignSelf: "stretch",
  },
});

export default CaloriesBaseSection;
