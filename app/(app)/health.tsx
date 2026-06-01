import {
  RootState,
  useCreateTrackingMutation,
  useGetCalendarQuery,
} from "@/api";
import { AppColors } from "@/constants/design-tokens";
import { useThemedStyles } from "@/hooks/useThemedStyles";

import { getAge } from "@/services/equation/age";
import { calculateDailyCalories } from "@/services/equation/calories";
import AccountDetails from "@/shared/AccountDetails";
import { AnimatedWheelPicker } from "@/shared/AnimatedWheelPicker";
import CalorieInput from "@/shared/Colories/components/CaloriesInput";
import CalorieProgress from "@/shared/Colories/components/CaloriesProgress";
import KeyboardAwareView from "@/shared/KeyboardAwareView";
import { useDayPickerData } from "@/shared/DateWheelItem/utils";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useTranslation } from "@/hooks/useTranslation";
import { getAppLocale } from "@/utils/locale";
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

  const router = useRouter();

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
  let dailyGoal;

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

  const currentCalories = dayData?.totalCalories || 0;

  const handleValueChange = (_value: any, index: number) => {
    setSelectedDateIndex(index);
  };

  const handleAddFood = async (
    foodName: string,
    calories: number,
    recipeId?: number,
    time24h?: string
  ) => {
    try {
      const created = time24h
        ? new Date(`${formattedDate}T${time24h}:00`).toISOString()
        : undefined;

      await createTracking({
        name: recipeId ? undefined : foodName,
        calories: recipeId ? undefined : calories,
        recipeId: recipeId,
        created,
      }).unwrap();
      refetchCalendar();
    } catch (error) {
      console.error("Failed to create tracking:", error);
    }
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
            onEditPress={() => {}}
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
    </KeyboardAwareView>
  );
};

export default Health;

const createstyles = (colors: AppColors) => StyleSheet.create({
  wrapper: {
    flex: 1,
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
