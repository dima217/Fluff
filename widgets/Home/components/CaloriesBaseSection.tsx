import { useColors } from "@/contexts/ThemeContext";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useGetProductsQuery } from "@/api";

import usePagination from "@/hooks/usePagination";
import { useTranslation } from "@/hooks/useTranslation";
import type { MealData } from "@/shared/CardCarousel";
import CardsCarousel from "@/shared/CardCarousel";
import { ThemedText } from "@/shared/ui/ThemedText";
import { handleProductCardPress } from "@/utils/navigation/productNavigation";
import { useEffect, useMemo } from "react";
import { getProductsAsMealData } from "../utils/data";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface CaloriesBaseSectionProps {
  loadMoreSignal?: number;
}

const CaloriesBaseSection = ({
  loadMoreSignal = 0,
}: CaloriesBaseSectionProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createstyles);
  const { t } = useTranslation();
  const limit = 20;

  const {
    accumulatedData,
    isLoading,
    isFetching,
    isLoadingMore,
    handleLoadMore,
  } = usePagination({
    limit,
    queryHook: useGetProductsQuery,
    queryArgs: { limit },
  });

  useEffect(() => {
    if (loadMoreSignal > 0) {
      handleLoadMore();
    }
  }, [handleLoadMore, loadMoreSignal]);

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
        <ActivityIndicator size="large" color={colors.primary} />
      ) : productsAsMealData.length > 0 ? (
        <>
          <CardsCarousel
            products={productsAsMealData}
            onCardPress={handleProductCardPress}
            variant="featured"
            onScrollToEnd={handleLoadMore}
          />
          {isFetching || isLoadingMore ? (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null}
        </>
      ) : (
        <ThemedText type="xs">Нет продуктов</ThemedText>
      )}
    </View>
  );
};

const createstyles = (colors: AppColors) => StyleSheet.create({
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
