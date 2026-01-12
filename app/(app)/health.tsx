import { useCreateTrackingMutation, useGetCalendarQuery } from "@/api";
import { Colors } from "@/constants/design-tokens";
import AccountDetails from "@/shared/AccountDetails";
import { AnimatedWheelPicker } from "@/shared/AnimatedWheelPicker";
import CalorieInput from "@/shared/Colories/components/CaloriesInput";
import CalorieProgress from "@/shared/Colories/components/CaloriesProgress";
import { useDayPickerData } from "@/shared/DateWheelItem/utils";
import { ThemedText } from "@/shared/ui/ThemedText";
import MarkerContainer from "@/widgets/Health/components/MarkerContainer";
import TrackingHistory from "@/widgets/Health/components/TrackingHistory";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Health = () => {
  // Get calendar data for current month
  const { data: calendar, refetch: refetchCalendar } = useGetCalendarQuery();

  const dailyGoal = 2137; // TODO: Get from user profile/settings
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(() => {
    const currentDate = new Date();
    return currentDate.getDate() - 1; // 0-based index
  });

  const pickerData = useDayPickerData(
    60,
    calendar,
    dailyGoal,
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
    recipeId?: number
  ) => {
    try {
      await createTracking({
        name: recipeId ? undefined : foodName,
        calories: recipeId ? undefined : calories,
        recipeId: recipeId,
      }).unwrap();
      // Refetch calendar after adding
      refetchCalendar();
    } catch (error) {
      console.error("Failed to create tracking:", error);
    }
  };

  const label =
    new Date().toLocaleString("en-US", { month: "long" }) +
    " " +
    (selectedDateIndex + 1).toString();

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container]}>
        <AccountDetails />
        <ThemedText type="s" style={{ paddingTop: 30 }}>
          {label}
        </ThemedText>
        <AnimatedWheelPicker
          containerStyle={styles.animatedWheelPicker}
          selectStyle={styles.selectContainer}
          data={pickerData.data}
          visibleCount={7}
          initialIndex={selectedDateIndex}
          noBackground
          onValueChange={handleValueChange}
        />
        <View style={styles.markerContainerWrapper}>
          <MarkerContainer />
        </View>
        <CalorieProgress
          currentCalories={currentCalories}
          dailyGoal={dailyGoal}
          onEditPress={() => {}}
        />
        <CalorieInput onAdd={handleAddFood} />
        {dayData?.records && dayData.records.length > 0 && (
          <TrackingHistory records={dayData.records} />
        )}
      </View>
    </ScrollView>
  );
};

export default Health;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
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
