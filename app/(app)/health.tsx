import AccountDetails from "@/components/AccountDetails";
import { AnimatedWheelPicker } from "@/components/AnimatedWheelPicker";
import { useDayPickerData } from "@/components/DateWheelItem/utils";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Health = () => {
  const [toogle, setToogle] = useState<string>("All");
  const pickerData = useDayPickerData(60);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(
    pickerData.initialIndex
  );

  const handleValueChange = (_value: any, index: number) => {
    setSelectedDateIndex(index);
  };

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container]}>
        <AccountDetails />
        <ThemedText style={{ paddingTop: 30 }}>
          {(selectedDateIndex + 1).toString()}
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
    paddingTop: 20,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  animatedWheelPicker: {
    height: "60%",
  },
  selectContainer: {
    backgroundColor: "transparent",
  },
});
