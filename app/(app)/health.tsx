import { Colors } from "@/constants/design-tokens";
import AccountDetails from "@/shared/AccountDetails";
import { AnimatedWheelPicker } from "@/shared/AnimatedWheelPicker";
import CalorieInput from "@/shared/Colories/components/CaloriesInput";
import CalorieProgress from "@/shared/Colories/components/CaloriesProgress";
import { useDayPickerData } from "@/shared/DateWheelItem/utils";
import { ThemedText } from "@/shared/ui/ThemedText";
import MarkerContainer from "@/widgets/Health/components/MarkerContainer";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Health = () => {
  const pickerData = useDayPickerData(60);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(
    pickerData.initialIndex
  );

  const handleValueChange = (_value: any, index: number) => {
    setSelectedDateIndex(index);
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
          initialIndex={pickerData.initialIndex - 1}
          noBackground
          onValueChange={handleValueChange}
        />
        <View style={styles.markerContainerWrapper}>
          <MarkerContainer />
        </View>
        <CalorieProgress
          currentCalories={456}
          dailyGoal={2137}
          onEditPress={() => {}}
        />
        <CalorieInput onAdd={(foodName: string, calories: number) => {}} />
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
