import {
  RootState,
  useCreateTrackingMutation,
  useGetCalendarQuery,
  useGetRecipesByIdsQuery,
} from "@/api";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";

import { useTranslation } from "@/hooks/useTranslation";
import { getAge } from "@/services/equation/age";
import { calculateDailyCalories } from "@/services/equation/calories";
import { calculateConsumedNutrients } from "@/services/equation/consumedNutrients";
import { calculateDailyNutrients } from "@/services/equation/nutrients";
import AccountDetails from "@/shared/AccountDetails";
import { AnimatedWheelPicker } from "@/shared/AnimatedWheelPicker";
import CalorieInput, { TrackingAddParams } from "@/shared/Colories/components/CaloriesInput";
import CalorieProgress from "@/shared/Colories/components/CaloriesProgress";
import { useDayPickerData } from "@/shared/DateWheelItem/utils";
import KeyboardAwareView from "@/shared/KeyboardAwareView";
import EditDailyCalorieGoalModal from "@/shared/Modals/EditDailyCalorieGoalModal";
import NutrientDetailsModal from "@/shared/Modals/NutrientDetailsModal";
import { ThemedText } from "@/shared/ui/ThemedText";
import { calorieGoalStorage } from "@/storage/calorieGoal/calorieGoalStorage";
import { appSettingsStorage } from "@/storage/appSettings/appSettingsStorage";
import { getAppLocale } from "@/utils/locale";
import { useFocusEffect } from "@react-navigation/native";
import MarkerContainer from "@/widgets/Health/components/MarkerContainer";
import TrackingHistory from "@/widgets/Health/components/TrackingHistory";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

const Health = () => {
  const styles = useThemedStyles(createstyles);
  const { language } = useTranslation();
  const { data: calendar, refetch: refetchCalendar } = useGetCalendarQuery();
  const [isEditDailyCalorieGoalModalVisible, setIsEditDailyCalorieGoalModalVisible] = useState(false);
  const [isNutrientDetailsVisible, setIsNutrientDetailsVisible] = useState(false);
  const [nutrientTrackingEnabled, setNutrientTrackingEnabled] = useState(
    () => appSettingsStorage.isNutrientTrackingEnabled(),
  );
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setNutrientTrackingEnabled(appSettingsStorage.isNutrientTrackingEnabled());
    }, []),
  );

  const handleTrackingCardPress = useCallback(
    (recipeId?: number) => {
      if (!recipeId) return;

      router.push({
        pathname: "/(recipe)/recipe",
        params: {
          recipeId: recipeId.toString(),
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const profile = useSelector((state: RootState) => state.user.profile);
  let dailyGoal: number | null = null;

  if (
    profile?.weight != null &&
    profile?.height != null &&
    profile?.birthDate &&
    profile?.gender
  ) {
    const age = getAge(profile.birthDate);

    dailyGoal = calculateDailyCalories({
      weight: Number(profile.weight),
      height: Number(profile.height),
      age,
      gender: profile.gender,
      activity: profile.sportActivity ?? null,
    });
  }
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(() => {
    const currentDate = new Date();
    return currentDate.getDate() - 1;
  });

  const pickerData = useDayPickerData(
    60,
    calendar,
    dailyGoal ?? undefined,
    selectedDateIndex
  );

  const [createTracking] = useCreateTrackingMutation();

  // Get selected date
  const selectedDate = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const dayNumber = selectedDateIndex + 1;
    return new Date(currentYear, currentMonth, dayNumber);
  }, [selectedDateIndex]);

  // Format date as YYYY-MM-DD
  const formattedDate = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  // Get statistics for selected date from calendar
  const dayData = useMemo(() => {
    return calendar?.[formattedDate];
  }, [calendar, formattedDate]);

  const recipeIds = useMemo(
    () =>
      [
        ...new Set(
          (dayData?.records ?? [])
            .map((record) => record.recipeId)
            .filter((id): id is number => id != null),
        ),
      ],
    [dayData?.records],
  );

  const { data: trackedRecipes = [] } = useGetRecipesByIdsQuery(recipeIds, {
    skip: recipeIds.length === 0,
  });

  const currentCalories = dayData?.totalCalories || 0;

  const handleValueChange = (_value: any, index: number) => {
    setSelectedDateIndex(index);
  };

  const handleAddFood = async ({
    foodName,
    calories,
    recipeId,
    time24h,
    grams,
    proteins,
    fats,
    carbs,
  }: TrackingAddParams) => {
    try {
      const created = time24h
        ? new Date(`${formattedDate}T${time24h}:00`).toISOString()
        : undefined;

      await createTracking({
        name: recipeId ? undefined : foodName,
        calories: recipeId ? undefined : calories,
        recipeId,
        grams,
        proteins: recipeId ? undefined : proteins,
        fats: recipeId ? undefined : fats,
        carbs: recipeId ? undefined : carbs,
        created,
      }).unwrap();
      refetchCalendar();
    } catch (error) {
      console.error("Failed to create tracking:", error);
    }
  };

  const dailyNutrientNorms = useMemo(
    () => (dailyGoal ? calculateDailyNutrients(dailyGoal) : null),
    [dailyGoal],
  );

  const consumedNutrients = useMemo(() => {
    const consumed = calculateConsumedNutrients(dayData?.records ?? [], trackedRecipes);
    return {
      ...consumed,
      calories: currentCalories,
    };
  }, [currentCalories, dayData?.records, trackedRecipes]);

  const handleEditDailyCalorieGoalModalClose = (newDailyGoal: number) => {
    setIsEditDailyCalorieGoalModalVisible(false);
    calorieGoalStorage.set(newDailyGoal);
  };

  const label = useMemo(() => {
    const month = selectedDate.toLocaleString(getAppLocale(language), {
      month: "long",
    });
    return `${month} ${selectedDate.getDate()}`;
  }, [language, selectedDate]);

  return (
    <KeyboardAwareView style={styles.wrapper}>
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container]}>
          <AccountDetails />
          <ThemedText type="s" style={{ paddingTop: 30 }}>
            {label}
          </ThemedText>
          <AnimatedWheelPicker
            itemSize={60}
            containerStyle={styles.animatedWheelPicker}
            selectStyle={styles.selectContainer}
            data={pickerData.data}
            noBackground
            visibleCount={7}
            initialIndex={selectedDateIndex}
            onValueChange={handleValueChange}
          />
          <View style={styles.markerContainerWrapper}>
            <MarkerContainer />
          </View>
          <CalorieProgress
            currentCalories={currentCalories}
            dailyGoal={dailyGoal ?? 1000}
            onEditPress={() => setIsEditDailyCalorieGoalModalVisible(true)}
            onNutrientDetailsPress={
              nutrientTrackingEnabled
                ? () => setIsNutrientDetailsVisible(true)
                : undefined
            }
          />
          <CalorieInput onAdd={handleAddFood} />
          {dayData?.records && dayData.records.length > 0 && (
            <TrackingHistory
              onPress={handleTrackingCardPress}
              records={dayData.records}
              onDeleteSuccess={refetchCalendar}
            />
          )}
        </View>
      </ScrollView>
      <EditDailyCalorieGoalModal
        isVisible={isEditDailyCalorieGoalModalVisible}
        dailyGoal={dailyGoal ?? 1000}
        onClose={handleEditDailyCalorieGoalModalClose}
      />
      <NutrientDetailsModal
        isVisible={isNutrientDetailsVisible}
        norms={dailyNutrientNorms}
        consumed={consumedNutrients}
        onClose={() => setIsNutrientDetailsVisible(false)}
      />
    </KeyboardAwareView>
  );
};

export default Health;

const createstyles = (colors: AppColors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContainer: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
  container: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  animatedWheelPicker: {
    height: 210,
  },
  selectContainer: {
    backgroundColor: "transparent",
  },
  markerContainerWrapper: {
    width: "100%",
    alignItems: "flex-start",
    paddingBottom: 24,
  },
});
