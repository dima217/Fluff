import { useGetProductsQuery } from "@/api";
import { Colors } from "@/constants/design-tokens";
import usePagination from "@/hooks/usePagination";
import { useTranslation } from "@/hooks/useTranslation";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getProductsAsMealData } from "../utils/data";

interface CaloriesBaseSectionProps {
  loadMoreSignal?: number;
}

const CaloriesBaseSection = ({
  loadMoreSignal = 0,
}: CaloriesBaseSectionProps) => {
  const { t } = useTranslation();
  const limit = 20;

  const { accumulatedData, isLoading, isFetching, isLoadingMore, handleLoadMore } =
    usePagination({
    limit,
    queryHook: useGetProductsQuery,
    queryArgs: { limit },
  });

  useEffect(() => {
    if (loadMoreSignal > 0) {
      handleLoadMore();
    }
  }, [loadMoreSignal]);

  const productsAsMealData: MealData[] = useMemo(
    () =>
      Array.isArray(accumulatedData) && accumulatedData.length > 0
        ? getProductsAsMealData(accumulatedData)
        : [],
    [accumulatedData]
  );

  return (
    <View style={styles.section}>
      <ThemedText type="s">{t("homeSections.mealsToday")}</ThemedText>
      {isLoading && productsAsMealData.length === 0 ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : productsAsMealData.length > 0 ? (
        <>
          <CardsCarousel
            products={productsAsMealData}
            onCardPress={(item) => {}}
            variant="featured"
            onScrollToEnd={handleLoadMore}
          />
          {isFetching || isLoadingMore ? (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : null}
        </>
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
  loadMoreContainer: {
    alignItems: "center",
  },
});

export default CaloriesBaseSection;
