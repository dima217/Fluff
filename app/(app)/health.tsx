import AccountDetails from "@/components/AccountDetails";
import { AnimatedWheelPicker } from "@/components/AnimatedWheelPicker";
import { useDayPickerData } from "@/components/DateWheelItem/utils";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Health = () => {
  const [toogle, setToogle] = useState<string>("All");
  const pickerData = useDayPickerData(60);
  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container]}>
        <AccountDetails />
        <AnimatedWheelPicker
          containerStyle={styles.animatedWheelPicker}
          selectStyle={styles.selectContainer}
          data={pickerData.data}
          visibleCount={7}
          initialIndex={pickerData.initialIndex}
          noBackground
          onValueChange={() => {}}
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
    marginTop: 40,
    height: "60%",
  },
  selectContainer: {
    backgroundColor: "transparent",
  },
});
